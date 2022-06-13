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
        const sqlQuery = "SELECT * FROM COURSES;";

        
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
        const sqlQuery = "SELECT C.code AS code, C.name AS name, C.credits AS credits FROM STUDY_PLAN SP, COURSES C WHERE SP.studentId = ? AND SP.courseCode = C.code";

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
        const sqlQuery = `SELECT C.code AS code, C.name AS name FROM COURSES C WHERE C.code = ?`;

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



    //TO be checked
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


    async removeCourseFromStudyPlan(studentId, courseCode){

    }

    //TO be checked
    async updateEnrolledStudents(op, courseCode){
        let sqlQuery;
        if(op === "add"){
            sqlQuery = `UPDATE COURSES SET enrolledStudents = enrolledStudents + 1 WHERE code = ?`;
        }
        else {
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

    //Deletes a studyplan by:
    // 1) Update student table (type and hasStudyPlan)
    // 2) Update COURSES enrolledStudents (reduce count by 1 for each course in studyPlan)
    // 3) Delete entries in STUDY_PLAN for studentId
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

    //Delete all the courses of a student studyplan
    //TO be checked
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

    //When deleteing studyplan this function reduces the enrolledStudents by one for each course
    //TO be checked
    async modifyEnrolledStudentsInStudyPlanCourses(studentId){
        const sqlQuery = `SELECT courseCode FROM STUDY_PLAN WHERE studentId = ?`;

        return new Promise((resolve, reject) => {
            this.#db.all(sqlQuery, studentId, (err, result) => {
                if (err) {
                    console.log("Database get error: err", err);
                    reject(new Exceptions(500));
                } else {
                    result.map((row) => row["courseCode"]).forEach(async (code) => {
                        await updateEnrolledStudents("sub", code).catch((err) => {
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