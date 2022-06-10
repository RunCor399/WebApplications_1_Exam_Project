import 'bootstrap-icons/font/bootstrap-icons.css';
import { Table, Accordion, Row, Col } from 'react-bootstrap';
import { CourseAccordion, StudyPlanCourse } from './CourseDescription';


function CoursesTable(props){
    let courses = props.courses;
    if(courses === undefined){
        courses = [];
    }

    const titleDict = {"courses": "Courses", "studyplan": "Study Plan"};

    return (
        <>
            <h2>{titleDict[props.listType]}</h2>
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
                        courses.map((course) => {return(<CourseAccordion key={course.code} course={course}  />)})
                        :
                        courses.map((course) => {return(<StudyPlanCourse key={course.code} course={course}></StudyPlanCourse>)})
                        }
                    </tbody>
                </Table>
        </>
    );
}


export {CoursesTable}