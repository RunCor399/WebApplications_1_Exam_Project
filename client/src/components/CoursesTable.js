import 'bootstrap-icons/font/bootstrap-icons.css';
import { Table, Accordion, Row, Col } from 'react-bootstrap';
import { CourseAccordion, StudyPlanCourse } from './CourseDescription';
import { useEffect, useState } from 'react';


function CoursesTable(props){
    const [studyPlanCredits, setStudyPlanCredits] = useState(0);


    let courses = props.courses;
    if(courses === undefined){
        courses = [];
    }

    const computeTotalCredits = (courses) => {
        let totalCredits = courses.map((spCourse) => spCourse.credits).reduce((partial, value) => partial + value, 0);

        return totalCredits;
    }


    useEffect(() => {
        if(props.listType === "studyplan"){
            setStudyPlanCredits(computeTotalCredits(courses));
        }
    }, [props.courses])

    //console.log(props.creditsBoundaries)



    const titleDict = {"courses": "Courses", "studyplan": "Study Plan"};

    return (
        <>
            <Row>
                <Col className="col-md-4">
                    <h2>{titleDict[props.listType]}</h2>
                </Col>
                {props.listType === "studyplan" && <Col>
                    <h3 className="offset-md-2 col-md-6">Total Credits: {studyPlanCredits}/{props.creditsBoundaries.max}</h3>
                </Col>}
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
                        courses.map((course) => {return(<CourseAccordion key={course.code} mode={props.mode} computeTotalCredits={computeTotalCredits} creditsBoundaries={props.creditsBoundaries} studyPlan={props.studyPlan} course={course}  />)})
                        :
                        courses.map((course) => {return(<StudyPlanCourse key={course.code} course={course}></StudyPlanCourse>)})
                        }
                    </tbody>
                </Table>
        </>
    );
}


export {CoursesTable}