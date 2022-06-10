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
        const sqlQuery = "SELECT * FROM STUDY_PLAN SP, COURSES C WHERE SP.studentId = ? AND SP.courseCode = C.code";

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