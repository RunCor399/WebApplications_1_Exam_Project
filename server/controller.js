'use strict';

var sqlite3 = require('sqlite3');
const dayjs = require('dayjs');
const Exceptions = require('./exceptions')
const crypto = require('crypto');
const { Console } = require('console');



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

        return new Promise((resolve, reject) => {
            this.#db.all(sqlQuery, code, (err, rows) => {
                if (err) {
                    console.log("Database get error: err", err);
                    reject(new Exceptions(500));
                } else {
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
                    resolve(rows);
                }
            });
        });
    }

    //can be removed and used getCourseById instead (add prepCourse column in attributes)
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


    async checkPreparatoryCourses(courses){
        let result;

        for(let prepCourse of courses){
            result = false;
            console.log(prepCourse.preparatoryCourse);
            if(prepCourse.preparatoryCourse === null || prepCourse.preparatoryCourse === undefined){
                console.log("continues");
                result = true;
                continue;
            }

            for(let spCourse of courses){
                if(spCourse.code === prepCourse.preparatoryCourse.code){
                    console.log("found prep");
                    result = true;
                }
            }

            if(!result){
                return false;
            }
        }

        return result;
    }

    async checkIncompatibleCourses(courses){
        let incompatibleCourses, result = false;

        for(let course of courses){
            incompatibleCourses = await this.getIncompatibleCourses(course.code);

            if(incompatibleCourses.length === 0){
                continue;
            }

            for(let spCourse of courses){
                let count = incompatibleCourses.filter((incCourse) => incCourse.code === spCourse.code);

                if(count.length >= 1){
                    return false;
                } 
            }
        }

        return true;
    }

    async checkAlreadyInStudyPlan(courses){
        for(let course of courses){
            let result = courses.filter((spCourse) => spCourse.code === course.code);

            if(result.length > 1){
                return false;
            }
        }

        return true;
    }


    async checkCreditsBoundaries(courses, studentId){
        const studentType = (await this.getStudentType(studentId))[0].type;
        const typeToBoundaries = {"partime" : {min : 20, max : 40}, "fulltime" : {min : 60, max : 80}};
        
        let creditsTotal = courses.map((spCourse) => spCourse.credits).reduce((partial, value) => partial + value, 0);

        return creditsTotal >= typeToBoundaries[studentType].min && creditsTotal <= typeToBoundaries[studentType].max; 
    }

    async checkMaxStudents(courses){
        let result = true;

        courses.filter((spCourse) => (spCourse.maxStudents !== null || spCourse.maxStudents !== undefined))
               .map((spCourse) => {
                    if(spCourse.enrolledStudents === spCourse.maxStudents){
                        result = false;
                    }
        });


        return result;
    }


    async checkCourseConstraints(studentId, courses){
        let resPrepChecks = await this.checkPreparatoryCourses(courses);
        let resIncompChecks = await this.checkIncompatibleCourses(courses);
        let resAlreadyChecks = await this.checkAlreadyInStudyPlan(courses);
        let resBoundaryChecks = await this.checkCreditsBoundaries(courses, studentId);
        let resMaxStudentsChecks = await this.checkMaxStudents(courses);

        return resPrepChecks && resIncompChecks && resAlreadyChecks && resBoundaryChecks && resMaxStudentsChecks;
    }


    async modifyCoursesInStudyPlan(studentId, courses){
        let result = await this.checkCourseConstraints(studentId, courses);
 
        if(!result){
            return new Exceptions(411);
        }


        await this.modifyEnrolledStudentsInStudyPlanCourses(studentId).then(async () => {
            await this.deleteStudyPlanCourses(studentId).catch((err) => {
                console.log(err);
                return new Exceptions(500);
            })
        }).catch((err) => {
            console.log(err);
            return new Exceptions(500);
        })
        

       
        courses.map(async (course) => {
            await this.addCourseToStudyPlan(studentId, course.code).catch((err) => {
                console.log(err);
                return new Exceptions(500);
            })
        })
    }


    async addCourseToStudyPlan(studentId, courseCode){
        const sqlQuery = `INSERT INTO STUDY_PLAN (studentId, courseCode) VALUES (?, ?)`;

        return new Promise((resolve, reject) => {
            this.#db.all(sqlQuery, studentId, courseCode, async (err, rows) => {
                if (err) {
                    console.log("Database get error: err", err);
                    reject(new Exceptions(500));
                } 
                else {
                    await this.updateEnrolledStudents("add", courseCode).then(() => {
                        resolve(rows);
                    }).catch((err) => {
                        console.log(err);
                        reject(new Exceptions(500));
                    })
                }
            });
        });
    }

    async updateEnrolledStudents(op, courseCode){
        let sqlQuery;
        if(op === "add"){
            sqlQuery = `UPDATE COURSES SET enrolledStudents = enrolledStudents + 1 WHERE code = ?`;
        }
        else if(op === "sub"){
            sqlQuery = `UPDATE COURSES SET enrolledStudents = enrolledStudents - 1 WHERE code = ?`;
        }
        
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
                    await this.modifyEnrolledStudentsInStudyPlanCourses(studentId).then(async () => {
                        await this.deleteStudyPlanCourses(studentId).then(() => {
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