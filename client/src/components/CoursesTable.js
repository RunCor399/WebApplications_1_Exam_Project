import 'bootstrap-icons/font/bootstrap-icons.css';
import { Table, Accordion } from 'react-bootstrap';
import { CourseAccordion } from './CourseDescription';


function CoursesTable(props){
    const courses = props.courses;

    return (
        <>
            <h2>Courses/My study plan</h2>
                <Table className="coursesTable col-md-12">
                    <tbody>
                        {courses.map((course) => {return(<CourseAccordion key={course.code} course={course}  />)})}
                    </tbody>
                </Table>
        </>
    );
}


export {CoursesTable}