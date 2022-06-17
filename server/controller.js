'use strict';

var sqlite3 = require('sqlite3');
const dayjs = require('dayjs');
const Exceptions = require('./exceptions')
const crypto = require('crypto');



class Controller {
    #db;

    constructor(){
        this.#db = new sqlite3.Database('db.db');
    }


    async getAllCourses(){
        const sqlQuery = "SELECT * FROM COURSES ORDER BY name;";

        
        return new Promise((resolve, reject) => {
            this.#db.all(sqlQuery, (err, rows) => {
                if (err) {
                    console.log("Database get error: err", err);
                    reject(new Exceptions(500));
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async getStudyPlan(id){
        const sqlQuery = "SELECT C.code AS code, C.name AS name, C.credits AS credits, C.preparatoryCourse AS preparatoryCourse FROM STUDY_PLAN SP, COURSES C WHERE SP.studentId = ? AND SP.courseCode = C.code";

        return new Promise((resolve, reject) => {
            this.#db.all(sqlQuery, id, (err, rows) => {
                if (err) {
                    console.log("Database get error: err", err);
                    reject(new Exceptions(500));
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async hasStudyPlan(id){
        const sqlQuery = "SELECT hasStudyPlan FROM STUDENTS WHERE id = ?";

        return new Promise((resolve, reject) => {
            this.#db.all(sqlQuery, id, (err, rows) => {
                if (err) {
                    console.log("Database get error: err", err);
                    reject(new Exceptions(500));
                } else {
                    resolve(rows);
                }
            });
        });
    }


    async getIncompatibleCourses(code){
        const sqlGetIncompatibleCourses = `SELECT C.code AS code, C.name AS name FROM COURSES C, COURSE_INCOMPATIBILITY CI
                                           WHERE CI.courseCode = ? AND CI.incompatibility = C.code`;

        return new Promise((resolve, reject) => {
            this.#db.all(sqlGetIncompatibleCourses, code, (err, rows) => {
                if (err) {
                    console.log("Database get error: err", err);
                    reject(new Exceptions(500));
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async getCourseByCode(code){
        const sqlQuery = `SELECT C.code AS code, C.name AS name, C.credits AS credits FROM COURSES C WHERE C.code = ?`;

        //console.log(code);
        return new Promise((resolve, reject) => {
            this.#db.all(sqlQuery, code, (err, rows) => {
                if (err) {
                    console.log("Database get error: err", err);
                    reject(new Exceptions(500));
                } else {
                    //console.log(rows);
                    resolve(rows);
                }
            });
        });
    }

    async addStudyPlan(studentId, type){
        const sqlQuery = `UPDATE STUDENTS SET type = ?, hasStudyPlan = 1 WHERE id = ?;`;

        return new Promise((resolve, reject) => {
            this.#db.all(sqlQuery, type, studentId, (err, rows) => {
                if (err) {
                    console.log("Database get error: err", err);
                    reject(new Exceptions(500));
                } else {
                    //console.log(rows);
                    resolve(rows);
                }
            });
        });
    }


    async getPreparatoryCourse(courseCode){
        const sqlQuery = `SELECT preparatoryCourse FROM COURSES WHERE code = ?`;

        return new Promise((resolve, reject) => {
            this.#db.all(sqlQuery, courseCode, async (err, rows) => {
                if(err){
                    reject(new Exceptions(500));
                }
                else {
                    resolve(rows);
                }
            });
        });
    }



    async checkPreparatoryCourse(courseCode, studyPlan){
        const prepCourse = await this.getPreparatoryCourse(courseCode);

        const result = studyPlan.filter((course) => course.code === prepCourse);

        return result.length === 1 ? true : false;
        // false -> not ok, true -> ok


    }

    async checkIncompatibleCourses(courseCode, studyPlan){
        //check the function to get incompatible
        const incompatibleCourses = await this.getIncompatibleCourses(courseCode);

        for(let incompatibleCourse of incompatibleCourses){
            for(let spCourse of studyPlan){
                if(incompatibleCourse.code === spCourse.code){
                    return false;
                }
            }
        }

        return true;
    }

    async checkAlreadyInStudyPlan(courseCode, studyPlan){
        const result = studyPlan.filter((spCourse) => spCourse.code === courseCode);

        return result.length === 1 ? false : true; 
    }


    async checkCreditsMaxBoundary(courseCode, studyPlan, studentId){
        const courseCredits = (await this.getCourseByCode(courseCode))[0].credits;
        const currentStudyPlanCredits = studyPlan.map((spCourse) => spCourse.credits).reduce((partial, value) => partial + value, 0);
        const studentType = (await this.getStudentType(studentId))[0].type;

        const typeToMaxCFU = {"partime" : 40, "fulltime" : 80}
        if(currentStudyPlanCredits + courseCredits > typeToMaxCFU[studentType]){
            return false;
        }
        else {
            return true;
        }
    }


    async checkCourseConstraints(studentId, courseCode){
        const studyPlan = await this.getStudyPlan(studentId);

        if(!this.checkPreparatoryCourse(courseCode, studyPlan)){
            return false;
        }
        if(!this.checkIncompatibleCourses(courseCode, studyPlan)){
            return false;
        }
        if(!this.checkAlreadyInStudyPlan(courseCode, studyPlan)){
            return false;
        }
        if(!this.checkCreditsMaxBoundary(courseCode, studyPlan, studentId)){
            return false;
        }

        return true;
    }


    async addCourseToStudyPlan(studentId, courseCode){
        if(!this.checkCourseConstraints(studentId, courseCode)){
            return new Exceptions(500);
        }

        const sqlQuery = `INSERT INTO STUDY_PLAN (studentId, courseCode) VALUES (?, ?)`;

        return new Promise((resolve, reject) => {
            this.#db.all(sqlQuery, studentId, courseCode, async (err, rows) => {
                if (err) {
                    console.log("Database get error: err", err);
                    reject(new Exceptions(500));
                } 
                else {
                    await this.updateEnrolledStudents("add", courseCode).then(() => {
                        console.log("Deleted ", courseCode, " from student ", studentId);
                        resolve(rows);
                    }).catch((err) => {
                        console.log(err);
                        reject(new Exceptions(500));
                    })
                }
            });
        });
    }


    async removeCourseFromStudyPlan(studentId, courseCode){
        const sqlQuery = `DELETE FROM STUDY_PLAN WHERE studentId = ? AND courseCode = ?`;

        return new Promise((resolve, reject) => {
            this.#db.all(sqlQuery, studentId, courseCode, async (err, rows) => {
                if (err) {
                    console.log("Database get error: err", err);
                    reject(new Exceptions(500));
                } 
                else {
                    await this.updateEnrolledStudents("sub", courseCode).then(() => {
                        console.log("Deleted ", courseCode, " from student ", studentId);
                        resolve(rows);
                    }).catch((err) => {
                        console.log(err);
                        reject(new Exceptions(500));
                    })
                }
            });
        });
    }

    //TO be checked
    async updateEnrolledStudents(op, courseCode){
        let sqlQuery;
        if(op === "add"){
            sqlQuery = `UPDATE COURSES SET enrolledStudents = enrolledStudents + 1 WHERE code = ?`;
        }
        else if(op === "sub"){
            sqlQuery = `UPDATE COURSES SET enrolledStudents = enrolledStudents - 1 WHERE code = ?`;
        }
        console.log(sqlQuery);
        
        return new Promise((resolve, reject) => {
            this.#db.all(sqlQuery, courseCode, (err, rows) => {
                if (err) {
                    console.log("Database get error: err", err);
                    reject(new Exceptions(500));
                } else {
                    resolve(rows);
                }
            });
        });
    }


    async deleteStudyPlan(studentId){
        const sqlQuery = `UPDATE STUDENTS SET type = "", hasStudyPlan = 0 WHERE id = ?;`;

        return new Promise((resolve, reject) => {
            this.#db.all(sqlQuery, studentId, async (err, rows) => {
                if (err) {
                    console.log("Database get error: err", err);
                    reject(new Exceptions(500));
                } else {
                    console.log("update students succeeds");
                    await this.modifyEnrolledStudentsInStudyPlanCourses(studentId).then(async () => {
                        console.log("modify enrolled succeeds");
                        await this.deleteStudyPlanCourses(studentId).then(() => {
                            console.log("delete succeeds");
                            resolve(rows);
                        }).catch((err) => {
                            console.log(err);
                            reject(new Exceptions(501));
                        });
                    }).catch((err) => {
                        console.log(err);
                        reject(new Exceptions(500));
                    });
                }
            });
        });
    }


    async deleteStudyPlanCourses(studentId){
        const sqlQuery = `DELETE FROM STUDY_PLAN WHERE studentId = ?`;
        
        return new Promise((resolve, reject) => {
            this.#db.all(sqlQuery, studentId, (err, rows) => {
                if (err) {
                    console.log("Database get error: err", err);
                    reject(new Exceptions(500));
                } else {
                    resolve(rows);
                }
            });
        });
    }


    async modifyEnrolledStudentsInStudyPlanCourses(studentId){
        const sqlQuery = `SELECT courseCode FROM STUDY_PLAN WHERE studentId = ?`;

        return new Promise((resolve, reject) => {
            this.#db.all(sqlQuery, studentId, (err, result) => {
                if (err) {
                    console.log("Database get error: err", err);
                    reject(new Exceptions(500));
                } else {
                    result.map((row) => row["courseCode"]).forEach(async (code) => {
                        await this.updateEnrolledStudents("sub", code).catch((err) => {
                            reject(new Exceptions(500));
                        });
                    })

                    resolve();
                }
            });
        });
    }



    async getStudentType(studentId){
        const sqlQuery = `SELECT type FROM STUDENTS WHERE id = ?;`;

        return new Promise((resolve, reject) => {
            this.#db.all(sqlQuery, studentId, (err, rows) => {
                if (err) {
                    console.log("Database get error: err", err);
                    reject(new Exceptions(500));
                } else {
                    console.log(rows);
                    resolve(rows);
                }
            });
        });
    }

    
//LOGIN Methods

async getUser(email, password){
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM STUDENTS WHERE email = ?';
      this.#db.get(sql, [email], (err, row) => {
        if (err) { 
          reject(err); 
        }
        else if (row === undefined) { 
          resolve(false); 
        }
        else {
          const user = {id: row.id, username: row.email, name: row.name};
          crypto.scrypt(password, row.salt, 32, function(err, hashedPassword) {
            if (err) reject(err);
            if(!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword))
              resolve(false);
            else
              resolve(user);
          });
        }
      });
    });
  };


}


module.exports = Controller;