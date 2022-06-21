import 'bootstrap-icons/font/bootstrap-icons.css';
import { Table, Row, Col, Alert } from 'react-bootstrap';
import { CourseAccordion, StudyPlanCourse } from './CourseDescription';
import { useEffect, useState } from 'react';


function CoursesTable(props){
    /* study plan current credits */
    const [studyPlanCredits, setStudyPlanCredits] = useState(0);

    /* These states keep track of a course that cannot be removed from study plan because of a preparatory course constraint*/
    const [prepCourseConstraint, setPrepCourseConstraint] = useState(false);
    const [constraintCourseName, setConstraintCourseName] = useState("");
    const [constraintPrepName, setConstraintPrepName] = useState("");


    let courses = props.courses;
    if(courses === undefined){
        courses = [];
    }

    const computeTotalCredits = (courses) => {
        let totalCredits = courses.map((spCourse) => spCourse.credits).reduce((partial, value) => partial + value, 0);

        return totalCredits;
    }


    useEffect(() => {
        setPrepCourseConstraint(false);
        if(props.listType === "studyplan"){
            setStudyPlanCredits(computeTotalCredits(courses));
        }
    }, [props.courses])

    const checkPreparatoryConstraint = (constraint) => {
        setPrepCourseConstraint(constraint.value);
        setConstraintCourseName(constraint.courseName);
        setConstraintPrepName(constraint.spPreparatoryFor);
    }



    const titleDict = {"courses": "Courses", "studyplan": "Study Plan"};

    return (
        <>
            <Row>
                <Col className="col-md-4 px-0">
                    <h2>{titleDict[props.listType]}</h2>
                </Col>
                {props.listType === "studyplan" && <Col className="col-md-2 minCFUCol">
                    <h5>Min Credits: {props.creditsBoundaries.min}</h5>    
                </Col>}
                {props.listType === "studyplan" && <Col className="offset-md-1 col-md-3">
                    <h3>Total Credits: {studyPlanCredits}</h3>
                </Col>}
            </Row>
            {props.listType === "studyplan" && <Col className="offset-md-4 col-md-2 maxCFUCol">
                <h5>Max Credits: {props.creditsBoundaries.max}</h5>
                </Col>}
            <Row>

            </Row>
            
                <Table className="coursesTable col-md-12">
                    {props.listType === "studyplan" && 
                    <thead>
                        <tr>
                            <td>Code</td>
                            <td>Name</td>
                            <td>Credits</td>
                        </tr>
                    </thead>
                    }
                    <tbody>
                        
                        { props.listType === "courses" ?
                        courses.map((course) => {return(<CourseAccordion key={course.code} addCourseToTemporaryStudyPlan={props.addCourseToTemporaryStudyPlan}  mode={props.mode} computeTotalCredits={computeTotalCredits} creditsBoundaries={props.creditsBoundaries} studyPlan={props.studyPlan} course={course}  />)})
                        :
                        courses.map((course) => {return(<StudyPlanCourse key={course.code} setPreparatoryCourseConstraint={checkPreparatoryConstraint} mode={props.mode} course={course} studyPlan={props.studyPlan} removeCourseFromTemporaryStudyPlan={props.removeCourseFromTemporaryStudyPlan}></StudyPlanCourse>)})
                        }
                    </tbody>
                </Table>
                {props.mode === "edit" && prepCourseConstraint ? <Alert className="col-md-12 course-error-prep" variant="danger">{constraintCourseName} cannot be removed as it is a preparatory course for {constraintPrepName} </Alert> : ""}
        </>
    );
}


export {CoursesTable}