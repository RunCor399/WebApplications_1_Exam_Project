import {Button, Row, Col, Alert} from 'react-bootstrap';
import { TopNavbar } from './TopNavbar';
import { LoginForm } from './AuthComponents';
import { CoursesTable } from './CoursesTable';
import { CreateStudyPlan } from './CreateStudyPlanAccordion';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const modeDict = {"view" : "Edit", "edit" : "Save"};
    const [minCreditsConstraint, setMinCreditsConstraint] = useState(false);

    //console.log(props.creditsBoundaries);
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
        props.deleteStudyPlan();
      }
      else if(value === "edit"){
        props.initTemporaryStudyPlan();
        props.setMode("edit");
        setMinCreditsConstraint(false);
      }
      else if(value === "cancel"){
        if(props.creditsBoundaries.min <= computeTotalCredits()){
          props.cancelStudyPlanChangelog();
          props.setMode("view");
          setMinCreditsConstraint(false);
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
        }
        else {
          setMinCreditsConstraint(true);
        }
      }
    }


    return (
        <>
          <TopNavbar message={props.message} setMessage={props.setMessage} loggedIn={props.loggedIn} logout={props.handleLogout}></TopNavbar>
          <Row className="col-md-12 mt-5">
            {/* <Col className="offset-md-1 col-md-6">
              <h2>Page title</h2>
            </Col> */}

            {props.hasStudyPlan && props.loggedIn && props.mode === "view" ?
            <Col className="offset-md-10 col-md-1">
               <Button type='submit' className="edit-button" onClick={() => handleModeSubmit("edit")} variant='success'>Edit</Button>
            </Col> : ""}

            {props.hasStudyPlan && props.loggedIn && props.mode === "edit" ? <Col className="offset-md-8 col-md-1">
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
            <Alert className="col-md-8 offset-md-2 course-error" variant="danger">Total credits are below minimum amount of credits</Alert>
          </Row> : ""}
          <Row>
            {props.hasStudyPlan && props.loggedIn ? <Col className="offset-md-2 col-md-8">
              <CoursesTable listType={"studyplan"} removeCourseFromStudyPlanChangelog={props.removeCourseFromStudyPlanChangelog} studyPlan={props.mode === "edit" ? props.temporaryStudyPlan : props.studyPlan} creditsBoundaries={props.creditsBoundaries} mode={props.mode} courses={props.mode === "edit" ? props.temporaryStudyPlan : props.studyPlan}></CoursesTable>
            </Col> : ""}
          </Row>
          <Row>
            <Col className="offset-md-2 col-md-8">
              <CoursesTable listType={"courses"} addCourseToStudyPlanChangelog={props.addCourseToStudyPlanChangelog} creditsBoundaries={props.creditsBoundaries}  mode={props.mode} studyPlanChangelog={props.studyPlanChangelog} studyPlan={props.mode === "edit" ? props.temporaryStudyPlan : props.studyPlan} courses={props.courses}></CoursesTable>
            </Col>
          </Row>
        </>
      );
}

function LoginRoute(props) {
  return(
    <>
      <TopNavbar></TopNavbar>
      <Row>
        <Col className="pageTitleCol offset-md-4">
          <h1 className="pageTitle">Login</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <LoginForm login={props.handleLogin}/>
        </Col>
      </Row>
    </>
  );
}



export { MainRoute, DefaultRoute, LoginRoute };