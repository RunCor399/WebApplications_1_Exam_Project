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
  const[temporaryStudyPlan, setTemporaryStudyPlan] = useState([]);
  const[hasStudyPlan, setHasStudyPlan] = useState(false);
  const[creditsBoundaries, setCreditsBoundaries] = useState({});
  const[mode, setMode] = useState("view");

  const getCourses = async () => {
    const courses = await API.getAllCourses().catch((err) => {
      console.log("Get Courses error", err);
    });
    setCourses(courses);
  }
  
  async function getStudyPlan() {
    if(user.id !== undefined){
      const studyPlanInfo = await API.hasStudyPlan(user.id);

      setHasStudyPlan(studyPlanInfo.hasStudyPlan);

      if(hasStudyPlan){
        const studyPlanCourses = await API.getStudyPlan(user.id).catch((err) => {
          console.log(err);
        });

        setStudyPlan(studyPlanCourses);
      }
    }
  }

  async function loadStudyPlanInfo() {
    const studyPlanInfo = await API.hasStudyPlan(user.id);

    if(studyPlanInfo.hasStudyPlan){
      setCreditsBoundaries(typeToCredits[studyPlanInfo.studyPlanType]);
      setHasStudyPlan(studyPlanInfo.hasStudyPlan);
    }
  }


  useEffect(() => {
    async function checkAuth(){
      const user = await API.getUserInfo();
  
      setUser(user);
      setLoggedIn(true);
    };

    checkAuth(); 
  }, []);

  useEffect(() => {
    getCourses(); 

    if(loggedIn){
      loadStudyPlanInfo()
      getStudyPlan();
    }

  }, [loggedIn, user, hasStudyPlan, mode]);


  const handleLogin = async (credentials) => {
    try {
      const user = await API.login(credentials);
      setUser(user)
      setLoggedIn(true);
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
    }catch(err) {
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

    if(result){
      const studyPlanInfo = await API.hasStudyPlan(user.id);

      setCreditsBoundaries(typeToCredits[studyPlanInfo.studyPlanType]);
      setHasStudyPlan(true);
      setMode("view");
    }  
  }

  const deleteStudyPlan = async () => {
    const result = await API.deleteStudyPlan(user.id);

    if(result){
      setHasStudyPlan(false);
      setStudyPlan([]);
      setCreditsBoundaries({});
      setTemporaryStudyPlan([]);
    }  
  }

  const initTemporaryStudyPlan = async () => {
    setTemporaryStudyPlan(studyPlan);
  }

  const addCourseToTemporaryStudyPlan = async (course) => {
    setTemporaryStudyPlan([...temporaryStudyPlan, course]);
  }

  const removeCourseFromTemporaryStudyPlan = async (course) => {
    const updatedTempStudyPlan = temporaryStudyPlan.filter((entry) => entry.code !== course.code);

    setTemporaryStudyPlan(updatedTempStudyPlan);
  }

  const saveTemporaryStudyPlan = async () => {
    await API.modifyCoursesInStudyPlan(user.id, temporaryStudyPlan);

    setTemporaryStudyPlan([]);
   }

  const cancelTemporaryStudyPlan = async () => {
    setTemporaryStudyPlan([]);
  }

  const typeToCredits = {"fulltime" : {min: 60, max: 80}, "partime" : {min: 20, max: 40}};
    
  return (
      <>
        <Container fluid id='main-container'>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={
                <MainRoute setMessage={setMessage} message={message} loggedIn={loggedIn} mode={mode} setMode={setMode} creditsBoundaries={creditsBoundaries} initTemporaryStudyPlan={initTemporaryStudyPlan} addStudyPlan={addStudyPlan} deleteStudyPlan={deleteStudyPlan} saveTemporaryStudyPlan={saveTemporaryStudyPlan} addCourseToTemporaryStudyPlan={addCourseToTemporaryStudyPlan} removeCourseFromTemporaryStudyPlan={removeCourseFromTemporaryStudyPlan} cancelTemporaryStudyPlan={cancelTemporaryStudyPlan} hasStudyPlan={hasStudyPlan} handleLogout={handleLogout} courses={courses} studyPlan={studyPlan} temporaryStudyPlan={temporaryStudyPlan}/>
              } />

              <Route path='/login' element={
                loggedIn ? <Navigate replace to='/'/> : <LoginRoute handleLogin={handleLogin} setMessage={setMessage} message={message}/>
              } />
              
              <Route path='*' element={ <DefaultRoute/> } />
            </Routes>
          </BrowserRouter>
      </Container>
      </>
  );
}





export default App;
