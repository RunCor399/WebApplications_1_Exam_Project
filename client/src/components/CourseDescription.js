import '../App.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Accordion, Table, Row, Col} from 'react-bootstrap';




function CourseAccordion(props){
    const course = props.course;
    const preparatoryCourse = course.preparatoryCourse;
    const incompatibleCourses = course.incompatibleCourses;

    return (
      <tr className='col-md-11'>
        <td>
            <Accordion>
                <Accordion.Item eventKey={course.code}>
                    <Accordion.Header>
                        <CourseMain course={course}></CourseMain>
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





export { CourseAccordion }