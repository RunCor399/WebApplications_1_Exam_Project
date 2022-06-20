-- Tables creation

CREATE TABLE STUDENTS (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT,
    hasStudyPlan INTEGER NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    salt TEXT NOT NULL
);

CREATE TABLE COURSES (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    credits INTEGER NOT NULL,
    enrolledStudents INTEGER NOT NULL,
    maxStudents INTEGER,
    preparatoryCourse TEXT
);

DROP TABLE STUDY_PLAN;

CREATE TABLE STUDY_PLAN (
    studentId INTEGER NOT NULL,
    courseCode TEXT NOT NULL,
    PRIMARY KEY (studentId, courseCode),
    CONSTRAINT FK_STUDENT_ID FOREIGN KEY(studentId) REFERENCES STUDENTS(id),
    CONSTRAINT FK_COURSE_CODE FOREIGN KEY(courseCode) REFERENCES COURSES(code)
);

CREATE TABLE COURSE_INCOMPATIBILITY (
    courseCode TEXT NOT NULL,
    incompatibility TEXT NOT NULL,
    PRIMARY KEY (courseCode, incompatibility),
    FOREIGN KEY(courseCode) REFERENCES COURSES(code),
    FOREIGN KEY(incompatibility) REFERENCES COURSES(code)
);




--OFFICIAL QUERIES


 INSERT INTO STUDENTS (name, type, hasStudyPlan, email, password, salt)
 VALUES ("tizio", "", 0, "tizio@polito.it", "1405f25115e75b7782c6c73d07070f389780476c87d7a6f7525f3fc9d64073a7", "1234567887654321"),
        ("caio", "", 0, "caio@polito.it", "1c596e10a5519d6a037aeb8fdeb728bd1c46b48ad887f24f3a636db4cf1c9177", "8765432112345678")
        ("student3", "", 0, "student3@polito.it", "7e699a6015953e1bb48a94a71fb5fc16931a1c3256ac8f1e533d2fbb2dff2337", "1234432112344321"),
        ("student4", "", 0, "student4@polito.it", "16d578921727f8977ea73fb34c842ca8954dd7567c35a484d7d28e5f0dc5e98b", "4321123443211234"),
        ("student5", "", 0, "student5@polito.it", "6453b1dbc673ebcdcd642c597cfddaba39fb5f6b1349e112a7b9b1f3a97bbeba", "1111222233334444");





INSERT INTO COURSES (code, name, credits, enrolledStudents)
VALUES ("02GOLOV", "Architetture dei sistemi di elaborazione", 12, 0),
       ("02LSEOV", "Computer architectures", 12, 0),
       ("01SQJOV", "Data Science and Database Technology", 8, 0),
       ("01SQMOV", "Data Science e Tecnologie per le Basi di Dati", 8, 0),
       ("01SQLOV", "Database systems", 8, 0),
       ("01TYMOV", "Information systems security services", 12, 0),
       ("01UDUOV", "Sicurezza dei sistemi informativi ", 12, 0),
       ("01UDFOV", "Applicazioni Web I", 6, 0),
       ("02GRSOV", "Programmazione di sistema", 6, 0),
       ("01SQOOV", "Reti Locali e Data Center", 6, 0),
       ("01TYDOV", "Software networking ", 7, 0),
       ("03UEWOV", "Challenge", 5, 0),
       ("01URROV", "Computational intelligence ", 6, 0),
       ("01OUZPD", "Model based software design", 4, 0);



INSERT INTO COURSES (code, name, credits, enrolledStudents, preparatoryCourse)
VALUES ("05BIDOV", "Ingegneria del software", 6, 0, "02GOLOV"),
       ("04GSPOV", "Software engineering ", 6, 0, "02LSEOV"),
       ("01TXSOV", "Web Applications II", 6, 0, "01TXYOV");


INSERT INTO COURSES (code, name, credits, enrolledStudents, maxStudents)
VALUES ("01OTWOV", "Computer network technologies and services", 6, 0, 3),
       ("02KPNOV", "Tecnologie e servizi di rete", 6, 0, 3),
       ("01TXYOV", "Web Applications I", 6, 0, 3),
       ("01NYHOV", "System and device programming", 6, 0, 3),
       ("01URSPD", "Internet Video Streaming", 6, 0, 2);




INSERT INTO COURSE_INCOMPATIBILITY (courseCode, incompatibility)
VALUES ("02GOLOV", "02LSEOV"),
       ("02LSEOV", "02GOLOV"),
       ("01SQJOV", "01SQMOV"),
       ("01SQJOV", "01SQLOV"),
       ("01SQMOV", "01SQJOV"),
       ("01SQMOV", "01SQLOV"),
       ("01SQLOV", "01SQJOV"),
       ("01SQLOV", "01SQMOV"),
       ("01OTWOV", "02KPNOV"),
       ("02KPNOV", "01OTWOV"),
       ("01TYMOV", "01UDUOV"),
       ("01UDUOV", "01TYMOV"),
       ("05BIDOV", "04GSPOV"),
       ("04GSPOV", "05BIDOV"),
       ("01UDFOV", "01TXYOV"),
       ("01TXYOV", "01UDFOV"),
       ("02GRSOV", "01NYHOV"),
       ("01NYHOV", "02GRSOV");