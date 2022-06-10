import './App.css';
import { Col, Container, Row, Alert} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import {MainRoute, DefaultRoute, LoginRoute} from './components/AppViews';
import { useEffect, useState } from 'react';
import API from './controller/API'



function App() {

  //states
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const[courses, setCourses] = useState([]);
  const[mode, setMode] = useState("view");

  const getCourses = async () => {
    const courses = await API.getAllCourses();
    setCourses(courses);
  }

  useEffect(() => {
    async function checkAuth(){
      await API.getUserInfo();
      setLoggedIn(true);
    };

    checkAuth();
    
  }, []);

  useEffect(() => {
    getCourses();
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

  //DOESN'T LOG OUT !!!
  const handleLogout = async () => {
    await API.logout();
    setLoggedIn(false);

    setCourses([]);
    setMessage('');
  };


    
  return (
      <>
        <Container fluid id='main-container'>
          {message && <Row>
          <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
          </Row> }
          <BrowserRouter>
            <Routes>
              <Route path='/' element={
                loggedIn ? <MainRoute loggedIn={loggedIn} handleLogout={handleLogout} courses={courses}/> : <Navigate replace to='/login'/>
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
