import {Button, Row, Col, Alert} from 'react-bootstrap';
import { TopNavbar } from './TopNavbar';
import { LoginForm } from './AuthComponents';
import { CoursesTable } from './CoursesTable';
import { CreateStudyPlan } from './CreateStudyPlanAccordion';
import { useNavigate } from 'react-router-dom';

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

    //console.log(props.creditsBoundaries);

    const handleModeSubmit = (value) => { 

      if(props.mode === "view" && value === "delete"){
        props.deleteStudyPlan();
      }
      else if(props.mode === "view" && value === "edit"){
        //Change from view to edit mode
        props.setMode("edit");
      }
      else if(props.mode === "edit"){
        // Save or Cancel (from edit to view)
        props.setMode("view");
      }
    }


    return (
        <>
          <TopNavbar message={props.message} setMessage={props.setMessage} loggedIn={props.loggedIn} logout={props.handleLogout}></TopNavbar>
          <Row className="col-md-12 mt-5">
            {/* <Col className="offset-md-1 col-md-6">
              <h2>Page title</h2>
            </Col> */}

            {props.hasStudyPlan && props.loggedIn && <Col className="offset-md-9 col-md-1">
               <Button type='submit' className="edit-button" onClick={(event) => handleModeSubmit("edit")} variant='success'>{modeDict[props.mode]}</Button>
            </Col>}

            {props.hasStudyPlan && props.mode === "view" &&<Col className="col-md-2">
               <Button type='submit' className="delete-button" onClick={() => handleModeSubmit("delete")} variant='danger'>Delete Study Plan</Button>
            </Col>}

            <Col className="col-md-1">
              {props.mode === "edit" && <Button type='submit' className="cancel-button" onClick={() => handleModeSubmit("cancel")} variant='danger'>Cancel</Button>}
            </Col>

            {!props.hasStudyPlan && props.loggedIn && <Col className="offset-md-8 col-md-4">
               <CreateStudyPlan addStudyPlan={props.addStudyPlan}></CreateStudyPlan>
            </Col>}
          </Row>
          <Row>
            {props.hasStudyPlan && props.loggedIn && <Col className="offset-md-2 col-md-8">
              <CoursesTable listType={"studyplan"} creditsBoundaries={props.creditsBoundaries} courses={props.studyPlan}></CoursesTable>
            </Col>}
          </Row>
          <Row>
            <Col className="offset-md-2 col-md-8">
              <CoursesTable listType={"courses"} creditsBoundaries={props.creditsBoundaries}  mode={props.mode} studyPlan={props.studyPlan} courses={props.courses}></CoursesTable>
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