import {Button, Row, Col, Alert} from 'react-bootstrap';
import { TopNavbar } from './TopNavbar';
import { LoginForm } from './AuthComponents';
import { CoursesTable } from './CoursesTable';
import { CreateStudyPlan } from './CreateStudyPlanAccordion';
import { useState } from 'react';

function DefaultRoute() {
    return(
        <>
          <Row>
            <Col>
              <h1>404 - Page not Found</h1>
              <p>No content in this page!</p>
            </Col>
          </Row>
        </>
      );
    }


function MainRoute(props) {
    const [minCreditsConstraint, setMinCreditsConstraint] = useState(false);

    const computeTotalCredits = () => {
      let studyPlan;
      if(props.mode === "edit"){
        studyPlan = props.temporaryStudyPlan;
      }
      else {
        studyPlan = props.studyPlan;
      }

      let totalCredits = studyPlan.map((spCourse) => spCourse.credits).reduce((partial, value) => partial + value, 0);

        return totalCredits;
    }

    const handleModeSubmit = (value) => { 

      if(value === "delete"){
        setMinCreditsConstraint(false);
        props.setMode("view");
        props.deleteStudyPlan();
        props.setTempCourses([]);
      }
      else if(value === "edit"){
        props.initTemporaryStudyPlan();
        props.setMode("edit");
        props.setTempCourses(props.courses);
        setMinCreditsConstraint(false);
      }
      else if(value === "cancel"){
        if(props.creditsBoundaries.min <= computeTotalCredits()){
          props.cancelTemporaryStudyPlan();
          props.setMode("view");
          setMinCreditsConstraint(false);
          props.setTempCourses([]);
        }
        else {
          setMinCreditsConstraint(true);
        }
      }
      else if(value === "save"){
        if(props.creditsBoundaries.min <= computeTotalCredits()){
          props.saveTemporaryStudyPlan();
          props.setMode("view");
          setMinCreditsConstraint(false);
          props.setTempCourses([]);
        }
        else {
          setMinCreditsConstraint(true);
        }
      }
    }


    return (
        <>
          <TopNavbar user={props.user} message={props.message} setMessage={props.setMessage} loggedIn={props.loggedIn} logout={props.handleLogout}></TopNavbar>
          <Row className="col-md-12 mt-5 mb-4">
            {props.hasStudyPlan && props.loggedIn && props.mode === "view" ?
            <Col className="offset-md-10 col-md-1">
               <Button type='submit' className="edit-button" onClick={() => handleModeSubmit("edit")} variant='success'>Edit</Button>
            </Col> : ""}

            {props.hasStudyPlan && props.loggedIn && props.mode === "edit" ? <Col className="offset-md-8 col-md-1 save-button-col">
               <Button type='submit' className="edit-button" onClick={() => handleModeSubmit("save")} variant='success'>Save</Button>
            </Col> : ""}

            <Col className="col-md-1">
              {props.hasStudyPlan && props.loggedIn && props.mode === "edit" ? <Button type='submit' className="cancel-button" onClick={() => handleModeSubmit("cancel")} variant='danger'>Cancel</Button> : ""}
            </Col>

            {props.hasStudyPlan && props.loggedIn && props.mode === "edit" ? <Col className="col-md-2">
               <Button type='submit' className="delete-button" onClick={() => handleModeSubmit("delete")} variant='danger'>Delete Study Plan</Button>
            </Col> : ""}

            {!props.hasStudyPlan && props.loggedIn ? <Col className="offset-md-8 col-md-4">
               <CreateStudyPlan addStudyPlan={props.addStudyPlan}></CreateStudyPlan>
            </Col> : ""}
          </Row>
          {minCreditsConstraint ? <Row className="mt-3 mb-3">
            <Alert dismissible className="col-md-8 offset-md-2 course-error" onClose={() => setMinCreditsConstraint(false)} variant="danger">Total credits are below minimum amount of credits</Alert>
          </Row> : ""}
          <Row>
            {/* Same table component for the courses and the study plan */}
            {props.hasStudyPlan && props.loggedIn ? <Col className="offset-md-2 col-md-8">
              <CoursesTable listType={"studyplan"} removeCourseFromTemporaryStudyPlan={props.removeCourseFromTemporaryStudyPlan} studyPlan={props.mode === "edit" ? props.temporaryStudyPlan : props.studyPlan} creditsBoundaries={props.creditsBoundaries} mode={props.mode} courses={props.mode === "edit" ? props.temporaryStudyPlan : props.studyPlan}></CoursesTable>
            </Col> : ""}
          </Row>
          <Row>
            <Col className="offset-md-2 col-md-8">
              <CoursesTable listType={"courses"} addCourseToTemporaryStudyPlan={props.addCourseToTemporaryStudyPlan} creditsBoundaries={props.creditsBoundaries}  mode={props.mode} studyPlan={props.mode === "edit" ? props.temporaryStudyPlan : props.studyPlan} courses={props.mode === "edit" ? props.tempCourses : props.courses}></CoursesTable>
            </Col>
          </Row>
        </>
      );
}

function LoginRoute(props) {
  return(
    <>
      <TopNavbar user={props.user} setMessage={props.setMessage} message={props.message}></TopNavbar>
      <Row>
        <Col className="pageTitleCol offset-md-4">
          <h1 className="pageTitle">Login</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <LoginForm login={props.handleLogin} setMessage={props.setMessage} />
        </Col>
      </Row>
    </>
  );
}



export { MainRoute, DefaultRoute, LoginRoute };