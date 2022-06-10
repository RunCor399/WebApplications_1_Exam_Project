import {Button, Row, Col, Alert} from 'react-bootstrap';
import { TopNavbar } from './TopNavbar';
import { LoginForm } from './AuthComponents';
import { CoursesTable } from './CoursesTable';
import { CreateStudyPlan } from './CreateStudyPlanAccordion';

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
    return (
        <>
          <TopNavbar message={props.message} setMessage={props.setMessage} loggedIn={props.loggedIn} logout={props.handleLogout}></TopNavbar>
          <Row className="col-md-12 mt-5">
            {/* <Col className="offset-md-1 col-md-6">
              <h2>Page title</h2>
            </Col> */}
            <Col className="offset-md-8 col-md-4">
              <CreateStudyPlan></CreateStudyPlan>
            </Col>
          </Row>
          <Row>
            {props.loggedIn && <Col className="offset-md-2 col-md-8">
              <CoursesTable listType={"studyplan"} courses={props.studyPlan}></CoursesTable>
            </Col>}
          </Row>
          <Row>
            <Col className="offset-md-2 col-md-8">
              <CoursesTable listType={"courses"} courses={props.courses}></CoursesTable>
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