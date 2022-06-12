import '../App.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Accordion, Table, Row, Col, Alert} from 'react-bootstrap';
import { useEffect, useState } from 'react';




function CourseAccordion(props){
    const [errorsChecked, setErrorsChecked] = useState(false);
    const [errors, setErrors] = useState([]);

    const course = props.course;
    const preparatoryCourse = course.preparatoryCourse;
    const incompatibleCourses = course.incompatibleCourses;

    const studyPlan = props.studyPlan;
    const myErrors = [];

    const checkPreparatoryCourse = () => {
        const checkResult = studyPlan.filter((spCourse) => spCourse.code === preparatoryCourse.code);
        if(checkResult.length !== 1){
            let error = "Preparatory course '" + preparatoryCourse.name + "' is not present in the Study Plan";
            myErrors.push(error);
            //setErrors([...errors, error]);
        }
    }

    const checkIncompatibleCourses = () => {
        for(let incompatibleCourse of incompatibleCourses){
            for(let studyPlanCourse of studyPlan){
                if(incompatibleCourse.code === studyPlanCourse.code){
                    let error = "Incompatible with course '" + studyPlanCourse.name + "'";
                    myErrors.push(error);
                    //setErrors([...errors, error]);
                }
            }
        }
    }

    //Not adding more than one error (checked with 01SQLOV)
    const checkAlreadyInStudyPlan = () => {
        const result = studyPlan.filter((spCourse) => spCourse.code === course.code);
        if(result.length === 1){   
            let error = "This course is already present in the study plan";
            myErrors.push(error);
           // setErrors([...errors, error]);
        }
    }

    const checkCreditsBoundaries = () => {
        const studyPlanCredits = props.computeTotalCredits(studyPlan);
        const futureCredits = studyPlanCredits + course.credits;

        if(futureCredits > props.creditsBoundaries.max){
            let error = "Total number of credits ("+futureCredits+") would exceed the maximum of "+props.creditsBoundaries.max+" credits";
            myErrors.push(error);
            //setErrors([...errors, error]);
        }
    }


        
    

    

    useEffect(() => {  
        
        if(studyPlan.length > 0){
            if(course.preparatoryCourse !== undefined && !errorsChecked){
                checkPreparatoryCourse();
                
            }
            if(incompatibleCourses !== undefined && !errorsChecked){
                checkIncompatibleCourses();
            }
            if(!errorsChecked){
                checkCreditsBoundaries();
                checkAlreadyInStudyPlan();
            }

            setErrorsChecked(true); 
            //USE PREVIOUS MANAGEMENT? [...errors, error]
            setErrors(myErrors);
        }
        
        
    }, [studyPlan.length > 0, props.mode]);

    //ERRORS ARE NOT PASSED TO THE COMPONENT
    

    return (
      <tr className='col-md-11'>
        <td>
            <Accordion>
                <Accordion.Item eventKey={course.code}>
                    <Accordion.Header>
                        <CourseMain errors={errors} mode={props.mode} course={course}></CourseMain>
                    </Accordion.Header>
                    <Accordion.Body>
                        <h5>Preparatory Course:</h5>
                        { <CourseDetails course={preparatoryCourse ? preparatoryCourse : ""}></CourseDetails> }

                         <h5 className="mt-5">Incompatible Courses:</h5>
                         {incompatibleCourses.length === 0 ? <CourseDetails course=""></CourseDetails> :
                         incompatibleCourses.map((incompatibleCourse) => {return(<CourseDetails key={incompatibleCourse.code} course={incompatibleCourse ? incompatibleCourse : ""}  />)})}

                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </td>
      </tr>  
    );
}

function CourseMain(props){
    return (
        <>
            <Row>
            <Row className='col-md-11'>
                <Col className='col-md-4'>
                    <h3 className="courseCode">{props.course.code}</h3> 
                </Col>
                <Col className='col-md-8'>
                    <h3 className="courseName">{props.course.name}</h3>
                </Col>
            </Row>
            {props.errors.length > 0 && props.mode == "edit" && <Row>
                {props.errors.map((error) => {return(<Alert key={props.errors.indexOf(error)} className="col-md-12 course-error" variant="danger">{error}</Alert>)})}
            </Row>}

            <Row className="col-md-11 mt-5">
                <Col className="col-md-4">
                    <Row className="">
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
                        <h6 className="courseMax col-md-3">{props.course.maxStudents}</h6> 
                    </Row>
                </Col>
            </Row>
            </Row>
        </>
    );
}

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

function StudyPlanCourse(props){
    return (
        <tr className='col-md-11'>
            <td className="col-md-3"><h3>{props.course.code}</h3></td>
            <td className="col-md-6"><h3>{props.course.name}</h3></td>
            <td className="col-md-3"><h4>{props.course.credits}</h4></td>
        </tr>
    );
}





export { CourseAccordion, StudyPlanCourse }