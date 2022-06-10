
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
            //incompatible courses instead of undefined (need new query)
            return list.map((fullCourse)=>{ return new Course(fullCourse.course.code, fullCourse.course.name, fullCourse.course.credits, fullCourse.course.enrolledStudents, fullCourse.course.maxStudents, fullCourse.preparatoryCourseDetails, fullCourse.incompatibleCourses)});
        } 
        else {
            throw list;
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
    console.log("call del");
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
        throw user;  // an object with the error coming from the server
      }
}

const API = {getAllCourses, getUserInfo, logout, login};
export default API;