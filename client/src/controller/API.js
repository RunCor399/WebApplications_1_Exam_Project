
import { Course } from "../model/course";

const APIURL = 'http://localhost:3001';


async function getAllCourses() {
    const url = APIURL + '/courses';

    try {
        const response = await fetch(url, {
            credentials: 'include',
        });

        const list = await response.json();
        if (response.ok) {
            return list.map((fullCourse)=>{ return new Course(fullCourse.course.code, fullCourse.course.name, fullCourse.course.credits, fullCourse.course.enrolledStudents, fullCourse.course.maxStudents, fullCourse.preparatoryCourseDetails, fullCourse.incompatibleCourses)});
        } 
        else {
            throw list;
        }
    } catch (ex) {
        throw ex;
    }
}


async function getStudyPlan(id){
  const url = APIURL + '/studyPlan';

  try {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({id : id}),
        headers: {
          'Content-Type': 'application/json'
        },
    });

    const list = await response.json();
    if (response.ok) {
         return list.map((course)=>{ return new Course(course.code, course.name, course.credits, undefined, undefined, course.preparatoryCourse, undefined)});
    } 
    else {
        throw list;
    }
} catch (ex) {
    throw ex;
}
}

async function hasStudyPlan(id){
  const url = APIURL + '/hasStudyPlan';

  try {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({id : id}),
        headers: {
          'Content-Type': 'application/json'
        },
    });

    const studyPlanInfo = await response.json();
    if (response.ok) {
         return studyPlanInfo;
    } 
    else {
        throw studyPlanInfo;
    }
} catch (ex) {
    throw ex;
}
}

async function addStudyPlan(studentId, type){
  const url = APIURL + '/addStudyPlan';

  try {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({studentId : studentId, type : type}),
        headers: {
          'Content-Type': 'application/json'
        },
    });

    await response.json();

    if (response.ok) {
         return true;
    } 
    else {
        return false;
    }
} catch (ex) {
    throw ex;
  }
}


async function modifyCoursesInStudyPlan(studentId, courses){
  const url = APIURL + '/modifyCoursesInStudyPlan';

  try {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({studentId : studentId, courses : courses}),
        headers: {
          'Content-Type': 'application/json'
        },
    });

    if (response.ok) {
         return true;
    } 
    else {
        return false;
    }
} catch (ex) {
    throw ex;
  }
}



async function deleteStudyPlan(studentId){
  const url = APIURL + '/deleteStudyPlan';

  try {
    const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
        body: JSON.stringify({studentId : studentId}),
        headers: {
          'Content-Type': 'application/json'
        },
    });

    await response.json();

    if (response.ok) {
      return true;
    } 
    else {
      return false;
    }
} catch (ex) {
    throw ex;
  }
}



//LOGIN APIs

async function login(credentials) {
    const response = await fetch(APIURL + '/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });
      if(response.ok) {
        const user = await response.json();
        return user;
      }
      else {
        const errDetails = await response.text();
        throw errDetails;
      }
}

async function logout() {
    const response = await fetch(APIURL + '/api/sessions/current', {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok)
        return null;
}

async function getUserInfo() {
    const response = await fetch(APIURL + '/api/sessions/current', {
        method: 'GET',
        credentials: 'include',
      });

      const user = await response.json();
      if (response.ok) {
        return user;
      } else {
        throw user;
      }
}

const API = {getAllCourses, getUserInfo, logout, login, getStudyPlan, hasStudyPlan, addStudyPlan, deleteStudyPlan, modifyCoursesInStudyPlan};
export default API;