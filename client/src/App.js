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
    const courses = await API.getAllCourses().catch((err) => {
      console.log("Get Courses error", err);
    });
    setCourses(courses);
  }
  
  async function getStudyPlan() {
    if(user.id !== undefined){
      const hasStudyPlan = await API.hasStudyPlan(user.id);
      setHasStudyPlan(hasStudyPlan);

      if(hasStudyPlan){
        const studyPlanCourses = await API.getStudyPlan(user.id).catch((err) => {
          console.log("get study plan", err);
        });

        setStudyPlan(studyPlanCourses);
      }
    }
  }


  useEffect(() => {
    async function checkAuth(){
      const user = await API.getUserInfo();
  
      setUser(user);
      setLoggedIn(true);
    };

    checkAuth();
    getStudyPlan();
    
  }, []);

  useEffect(() => {  
    
    getCourses(); 

    if(loggedIn){
      getStudyPlan();
    }

    

  }, [loggedIn, user, hasStudyPlan]);


  const handleLogin = async (credentials) => {
    try {
      const user = await API.login(credentials);
      setUser(user)
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

    setStudyPlan([]);
    setMessage('');
    setUser([]);
  };


  const addStudyPlan = async (type) => {
    const result = await API.addStudyPlan(user.id, type);
    //check result
    if(result){
      setHasStudyPlan(true);
    }  
  }

  const deleteStudyPlan = async () => {
    const result = await API.deleteStudyPlan(user.id);
    //check result
    if(result){
      setHasStudyPlan(false);
    }  
  }


    
  return (
      <>
        <Container fluid id='main-container'>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={
                <MainRoute setMessage={setMessage} message={message} loggedIn={loggedIn} mode={mode} setMode={setMode} addStudyPlan={addStudyPlan} deleteStudyPlan={deleteStudyPlan} hasStudyPlan={hasStudyPlan} handleLogout={handleLogout} courses={courses} studyPlan={studyPlan}/>
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
