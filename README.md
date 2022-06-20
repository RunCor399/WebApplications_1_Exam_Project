# Exam #1: "StudyPlan"
## Student: s297014 COLOTTI MANUEL ENRIQUE 

## React Client Application Routes

- Route `/`: Main Route in which courses and study plan (if present and if student is logged in) are shown; in this page will also be possible to edit the study plan.
- 
- Route `/login`: Login page of the Web Application
- Route `*`: Default page to be shown if the user searches for a non-existing page

## API Server

### POST `/api/sessions`
  **Request Body**
  ```
  {
    "username" : "tizio@polito.it",
    "password" : "password"
  }
  ```

  **Response Body**
  ```
  {
  "id": 1,
  "username": "tizio@polito.it",
  "name": "tizio"
  }
  ```

### GET `/api/sessions/current`
**Request Body**
`No request body`

**Response Body**
 ```
  "id": 1,
  "username": "tizio@polito.it",
  "name": "tizio"
}
```

### DELETE `/api/sessions/current`
**Request Body**
`No request body`

**Request Body**
`No response body`

### GET `/courses`
**Request Body**
`No request body`

**Response Body**
```
[
  {
    "course": {
      "code": "01UDFOV",
      "name": "Applicazioni Web I",
      "credits": 6,
      "enrolledStudents": 2,
      "maxStudents": null,
      "preparatoryCourse": null
    },
    "incompatibleCourses": [
      {
        "code": "01TXYOV",
        "name": "Web Applications I"
      }
    ]
  },
  {
    ...
  }
]
```

### POST `/studyPlan`
**Request Body**
```
{
    "id" : 1
}
```

**Response Body**
```
[
  {
    "code": "01UDFOV",
    "name": "Applicazioni Web I",
    "credits": 6,
    "preparatoryCourse": null
  },
  {
    ...
  }
]
```

### POST `/hasStudyPlan`
**Request Body**
```
{
    "id" : 1
}
```

**Response Body**
```
{
  "hasStudyPlan": 1,
  "studyPlanType": "partime"
}
```

### POST `/addStudyPlan`
**Request Body**
```
{
    "studentId" : 1,
    "type" : "partime"
}
```

**Response Body**
```
[]
```



### POST `/modifyCoursesInStudyPlan`
**Request Body**
```
{
  "studentId" : 1,
  "courses" : [
    {"code" : "01UDFOV", "name" : "Applicazioni Web I", "credits" : 6, "enrolledStudents" : 0},
    {"code" : "02GOLOV", "name" : "Architetture dei sistemi di elaborazione", "credits" : 12, "enrolledStudents" : 0},
    {"code" : "01URROV", "name" : "Computational Intelligence", "credits" : 6, "enrolledStudents" : 0
    }
  ]
    
}
```

**Response Body**
``No response Body``

### DELETE `/deleteStudyPlan`
**Request Body**
```
{
    "studentId" : 1
}
```

**Response Body**
```
[]
```





## Database Tables

- Table `COURSES` - contains code, name, credits, enrolledStudents, maxStudents, preparatoryCourse
   
- Table `STUDENTS` - contains id, name, type, hasStudyPlan, email, password, salt
  
- Table `STUDY_PLAN` - contains studentId, courseCode

- Table `COURSE_INCOMPATIBILITY` contains courseCode, incompatibility
  

## Main React Components

- `LoginForm` (in `AuthComponents.js`): Component in charge of handling login form

- `LoginRoute` (in `AppViews.js`): Component in which the LoginForm component will be shown
  
- `MainRoute` (in `AppViews.js`): Main route of the Web Application in which courses and study plan are shown
  
- `CreateStudyPlan` (in `CreateStudyPlanAccordion.js`): Accordion used for the creation of a new study plan

- `CoursesTable` (in `CoursesTable.js`): Table in which either all courses or the study plan ones are shown

- `CourseAccordion` (in `CourseDescription.js`): Accordion containing all the information of a single course

- `CourseMain` (in `CourseDescription.js`): Head part of the CourseAccordion filled with main information of a course

- `CourseDetails` (in `CourseDescription.js`): Body part of the CourseAccordion filled with preparatory and incompatible courses of a course

- `StudyPlanCourse` (in `CourseDescription.js`): Row containing information of one study plan course

- `TopNavbar` (in `TopNavbar.js`): Navigation bar of the Web Application

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)
