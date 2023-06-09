import '../App.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Course } from "../model/course";
import {Accordion, Row, Col, Alert} from 'react-bootstrap';
import { BsPlusCircleFill, BsCheckLg, BsTrashFill } from "react-icons/bs";
import { useEffect, useState } from 'react';




function CourseAccordion(props){
    const [courseErrors, setCourseErrors] = useState([]);

    const course = props.course;
    const preparatoryCourse = course.preparatoryCourse;
    const incompatibleCourses = course.incompatibleCourses;

    const studyPlan = props.studyPlan;
    let myErrors = [];


    const checkPreparatoryCourse = () => {
        const checkResult = studyPlan.filter((spCourse) => spCourse.code === preparatoryCourse.code);
        if(checkResult.length !== 1){
            let error = "Preparatory course '" + preparatoryCourse.name + "' is not present in the Study Plan";
            let code = "preparatory";
            myErrors.push({errorCode: code, errorMsg : error});
        }
    }

    const checkIncompatibleCourses = () => {
        for(let incompatibleCourse of incompatibleCourses){
            for(let studyPlanCourse of studyPlan){
                if(incompatibleCourse.code === studyPlanCourse.code){
                    let error = "Incompatible with course '" + studyPlanCourse.name + "'";
                    let code = "incompatible";
                    myErrors.push({errorCode: code, errorMsg : error});
                }
            }
        }
    }

    const checkAlreadyInStudyPlan = () => {
        const result = studyPlan.filter((spCourse) => spCourse.code === course.code);
        if(result.length === 1){   
            let error = "This course is already present in the study plan";
            let code = "already";
            myErrors.push({errorCode: code, errorMsg : error});
        }
    }

    const checkCreditsBoundaries = () => {
        const studyPlanCredits = props.computeTotalCredits(studyPlan);
        const futureCredits = studyPlanCredits + course.credits;

        if(futureCredits > props.creditsBoundaries.max){
            let error = "Total number of credits ("+futureCredits+") would exceed the maximum of "+props.creditsBoundaries.max+" credits";
            let code = "credits";
            myErrors.push({errorCode: code, errorMsg : error});
        }
    }

    const checkMaxStudents = () => {
        if(course.enrolledStudents === course.maxStudents){
            let error = "This course has reached the maximum number of students";
            let code = "max";
            myErrors.push({errorCode: code, errorMsg : error});
        }
    }



    useEffect(() => {
        if(studyPlan.length > 0){
            if(course.preparatoryCourse !== undefined){
                checkPreparatoryCourse();
                
            }
            if(incompatibleCourses !== undefined){
                checkIncompatibleCourses();
            }

            checkMaxStudents();
            checkCreditsBoundaries();
            checkAlreadyInStudyPlan();

            setCourseErrors(myErrors);
        }
        else {
            checkMaxStudents();
            setCourseErrors(myErrors);
        }
    }, [props.mode === "edit", props.studyPlan])
        

    return (
      <tr className='col-md-11'>
        <td>
            <Accordion>
                <Accordion.Item eventKey={course.code}>
                    <Accordion.Header>
                        <CourseMain addCourseToTemporaryStudyPlan={props.addCourseToTemporaryStudyPlan} studyPlan={studyPlan} errors={courseErrors} mode={props.mode} course={course}></CourseMain>
                    </Accordion.Header>
                    <Accordion.Body>
                        <h5>Preparatory Course:</h5>
                        { <CourseDetails course={preparatoryCourse ? preparatoryCourse : ""}></CourseDetails> }

                         <h5 className="mt-5">Incompatible Courses:</h5>
                         {incompatibleCourses.length === 0 ? <CourseDetails course=""></CourseDetails> :
                         incompatibleCourses.map((incompatibleCourse) => {return(<CourseDetails key={incompatibleCourse.code +"courseDetails"} course={incompatibleCourse ? incompatibleCourse : ""}  />)})}

                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </td>
      </tr>  
    );
}

/* Main information of courses */
function CourseMain(props){
    const handleAdd = (event) => {
        event.stopPropagation();
        props.addCourseToTemporaryStudyPlan(new Course(props.course.code, props.course.name, props.course.credits, props.course.enrolledStudents, props.course.maxStudents, props.course.preparatoryCourse, undefined));
    }

    const courseAlreadyPresent = () => {
        const result = props.errors.map((error) => error.errorCode).filter((code) => code === "already");
        return result.length > 0;
    }
   

    return (
        <>
            <Row className='col-md-12'>
            <Row className='col-md-12 maincourse-row'>
                <Col className='col-md-4'>
                    <h3 className="courseCode">{props.course.code}</h3> 
                </Col>
                <Col className='col-md-7'>
                    <h3 className="courseName">{props.course.name}</h3>
                </Col>
                {props.mode === "edit" && props.errors.length === 0 && !courseAlreadyPresent() && <Col>
                    <BsPlusCircleFill onClick={(event) => {handleAdd(event)}} className="addCourseButton mt-1"></BsPlusCircleFill>
                </Col>}
                {props.mode === "edit" && courseAlreadyPresent() &&
                <Col>
                <BsCheckLg className="alreadyCourseIcon"></BsCheckLg>
                </Col>
                }
            </Row>
            {props.errors.length > 0 && props.mode === "edit" && <Row>
                {props.errors.map((error) => {return(<Alert key={props.errors.indexOf(error)} className="col-md-12 course-error" variant="danger">{error.errorMsg}</Alert>)})}
            </Row>}

            <Row className="col-md-11 mt-5">
                <Col className="col-md-4">
                    <Row>
                        <h6 className="courseCFULabel col-md-5">Credits: </h6>
                        <h6 className="courseCFU col-md-2 px-0">{props.course.credits}</h6>
                    </Row>
                </Col>
                <Col className="col-md-8">
                    <Row>
                        <h6 className="courseEnrolledLabel col-md-5">Enrolled Students:</h6> 
                        <h6 className="courseEnrolled col-md-3 mx-0">{props.course.enrolledStudents}</h6> 
                    </Row>
                </Col>
            </Row>
            <Row className="offset-md-3 col-md-8 mt-2">
                <Col>
                    <Row>
                        <h6 className="courseMaxLabel col-md-5">Max Students:</h6> 
                        <h6 className="courseMax col-md-2 mx-0">{props.course.maxStudents === null ? "/" : props.course.maxStudents}</h6> 
                    </Row>
                </Col>
            </Row>
            </Row>
        </>
    );
}

/* Details of each course */
function CourseDetails(props){
    return (
        <>
            <Row>
                <Col className='col-md-4'>
                    <h6 className="courseCode">{props.course === "" ? "None" : props.course.code}</h6> 
                </Col>
                <Col className='col-md-8'>
                    <h6 className="courseName">{props.course === "" ? "" : props.course.name}</h6>
                </Col>
            </Row>
        </>
    );
}

/* Study plan course component */
function StudyPlanCourse(props){
    const studyPlan = props.studyPlan;

    /* Removes a course from the study plan if the preparatory course constrained is respected */
    const handleRemove = (event) => {
        event.stopPropagation();
        if(!checkPreparatoryCourse()){
            props.removeCourseFromTemporaryStudyPlan(new Course(props.course.code, props.course.name, props.course.credits, undefined, undefined, undefined, undefined));
        }  
    }

    /* Check if the selected course to be removed is preparatory for another one currently present inside the study plan*/
    const checkPreparatoryCourse = () => {
        let result = false;
        let spCoursePreparatoryFor, constraint;
        
        let coursesWithPrep = studyPlan.filter((spCourse) => spCourse.preparatoryCourse !== null)
                                       .filter((spCourse) => spCourse.preparatoryCourse !== undefined);

        for(let spCourse of coursesWithPrep){
                if(spCourse.preparatoryCourse.code === props.course.code){
                    result = true;
                    spCoursePreparatoryFor = spCourse;
                }

                if(spCourse.preparatoryCourse === props.course.code){
                    result = true;
                    spCoursePreparatoryFor = spCourse;
                }
        }  

        
        if(result){
            constraint = {value: result, courseName : props.course.name, spPreparatoryFor : spCoursePreparatoryFor.name};
        }
        else {
            constraint = {value: result, courseName : undefined, spPreparatoryFor : undefined};
        }

        props.setPreparatoryCourseConstraint(constraint);

        return result;
    }

    return (
        <>
            <tr className='col-md-8'>
                <td className="col-md-3"><h3>{props.course.code}</h3></td>
                <td className="col-md-6"><h3>{props.course.name}</h3></td>
                <td className="col-md-2"><h4>{props.course.credits}</h4></td>
                {props.mode === "edit" && <td className="col-md-1"><BsTrashFill className="trash-icon" onClick={(event) => {handleRemove(event)}}></BsTrashFill></td>}
            </tr>
        </>
    );
}





export { CourseAccordion, StudyPlanCourse }