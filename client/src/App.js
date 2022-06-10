import './App.css';
import { Col, Container, Row, Alert} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import {MainRoute, DefaultRoute, LoginRoute} from './components/AppViews';
import { useEffect, useState } from 'react';
import API from './controller/API'



function App() {

  //states
  const [user, setUser] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const[courses, setCourses] = useState([]);
  const[studyPlan, setStudyPlan] = useState([])
  const[hasStudyPlan, setHasStudyPlan] = useState(false);
  const[mode, setMode] = useState("view");

  const getCourses = async () => {
    const courses = await API.getAllCourses();
    setCourses(courses);
  }

  //Not triggering after login
  //Still need to implement get of fullCourses
  /*In controller create a method that given a list of course
    returns the list of fullCourses (with prep and incompatible)
    as done in the method to get all courses (in server too)
  */
  /*
  this method will be called both from get courses and get studyplan.
  they will be able to pass the list of courses already retrieved
  */
  const getStudyPlan = async () => {
    if(user.id !== undefined){
      const studyPlan = await API.getStudyPlan(user.id).catch((err) => {
        console.log(err);
      });
    }
  }

  useEffect(() => {
    async function checkAuth(){
      const user = await API.getUserInfo();
      setUser(user);
      setLoggedIn(true);

      getCourses();
      getStudyPlan();
    };

    checkAuth();
    
  }, []);

  useEffect(() => {
    getCourses();
    getStudyPlan();
  }, [loggedIn]);


  const handleLogin = async (credentials) => {
    try {
      const user = await API.login(credentials);
      setLoggedIn(true);
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
    }catch(err) {
      console.log(err);
      setMessage({msg: err, type: 'danger'});
    }
  };


  const handleLogout = async (event) => {
    event.preventDefault();

    await API.logout().catch((err) => {
      console.log(err);
    });
    setLoggedIn(false);

    setCourses([]);
    setMessage('');
  };


    
  return (
      <>
        <Container fluid id='main-container'>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={
                loggedIn ? <MainRoute setMessage={setMessage} message={message} loggedIn={loggedIn} handleLogout={handleLogout} courses={courses}/> : <Navigate replace to='/login'/>
              } />

              <Route path='/login' element={
                loggedIn ? <Navigate replace to='/'/> : <LoginRoute handleLogin={handleLogin}/>
              } />
              
              <Route path='*' element={ <DefaultRoute/> } />
            </Routes>
          </BrowserRouter>
      </Container>
      </>
  );
}





export default App;
