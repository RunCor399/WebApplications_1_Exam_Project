
-- DROP TABLE STUDENTS;
-- CREATE TABLE STUDENTS (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     name TEXT,
--     type TEXT,
--     email TEXT,
--     password TEXT,
--     salt TEXT
-- );

-- CREATE TABLE COURSES (
--     code TEXT PRIMARY KEY,
--     name TEXT NOT NULL,
--     credits INTEGER NOT NULL,
--     enrolledStudents INTEGER NOT NULL,
--     maxStudents INTEGER,
--     preparatoryCourse TEXT
-- );

-- DROP TABLE STUDY_PLAN;

-- CREATE TABLE STUDY_PLAN (
--     studentId INTEGER NOT NULL,
--     courseCode TEXT NOT NULL,
--     PRIMARY KEY (studentId, courseCode),
--     CONSTRAINT FK_STUDENT_ID FOREIGN KEY(studentId) REFERENCES STUDENTS(id),
--     CONSTRAINT FK_COURSE_CODE FOREIGN KEY(courseCode) REFERENCES COURSES(code)
-- );

-- CREATE TABLE COURSE_INCOMPATIBILITY (
--     courseCode TEXT NOT NULL,
--     incompatibility TEXT NOT NULL,
--     PRIMARY KEY (courseCode, incompatibility),
--     FOREIGN KEY(courseCode) REFERENCES COURSES(code),
--     FOREIGN KEY(incompatibility) REFERENCES COURSES(code)
-- );


-- Insert courses

-- INSERT INTO COURSES(code, name, credits, enrolledStudents, maxStudents, preparatoryCourse)
-- VALUES ("02LSNMP", "Computer Architectures", 10, 35, 100, 1),
--        ("02LSFGP", "Data Science and Database Technology", 8, 15, 200, 1);  


-- 
-- INSERT INTO STUDENTS (name, type, email, password, salt)
-- VALUES ("tizio", "full-time", "tizio@polito.it", "1405f25115e75b7782c6c73d07070f389780476c87d7a6f7525f3fc9d64073a7", "1234567887654321");



-- INSERT INTO STUDY_PLAN (studentId, courseCode)
-- VALUES (1, "02LSNMP"), (1, "02LSFGP");

-- INSERT INTO COURSES (code, name, credits, enrolledStudents, maxStudents, preparatoryCourse)
-- VALUES ("01GNLPD", "Computer Network Technologies and Services", 6, 50, 200, "02LSNMP");

-- INSERT INTO COURSE_INCOMPATIBILITY (courseCode, incompatibility)
-- VALUES ("02LSNMP", "01GNLPD");

--  UPDATE COURSES SET preparatoryCourse = "" WHERE credits = 8 OR credits = 10;