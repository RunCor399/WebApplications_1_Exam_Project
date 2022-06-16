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
  const[studyPlanChangelog, setStudyPlanChangelog] = useState([]);
  const[temporaryStudyPlan, setTemporaryStudyPlan] = useState([]);

  //Merge in studyPlan info
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
          console.log("get study plan", err);
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
    //getStudyPlan();
    
  }, []);

  useEffect(() => {
    // console.log("called");  
    getCourses(); 

    if(loggedIn){
      loadStudyPlanInfo()
      getStudyPlan();
    }

    

  }, [loggedIn, user, hasStudyPlan, mode]); /*update of temp study plan*/

//creditsBoundaries not passed to studyplan (add to useEffect?)

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
      const studyPlanInfo = await API.hasStudyPlan(user.id);

      setCreditsBoundaries(typeToCredits[studyPlanInfo.studyPlanType]);
      setHasStudyPlan(true);
    }  
  }

  const deleteStudyPlan = async () => {
    const result = await API.deleteStudyPlan(user.id);
    //check result
    if(result){
      setHasStudyPlan(false);
      setStudyPlan([]);
      setCreditsBoundaries({});
    }  
  }

  const initTemporaryStudyPlan = async () => {
    setTemporaryStudyPlan(studyPlan);
  }

  const addCourseToStudyPlanChangelog = async (course) => {
    const updatedChangelog = studyPlanChangelog.filter((entry) => (entry["add"] !== course.code) && (entry["remove"] !== course.code));

    // console.log([...updatedChangelog, {"add" : course.code}]);
    setStudyPlanChangelog([...updatedChangelog, {"add" : course.code}]);
    setTemporaryStudyPlan([...temporaryStudyPlan, course]);
    //console.log(temporaryStudyPlan, studyPlanChangelog);
  }

  const removeCourseFromStudyPlanChangelog = async (course) => {
    const updatedChangelog = studyPlanChangelog.filter((entry) => (entry["remove"] !== course.code) && (entry["add"] !== course.code));
    const updatedTempStudyPlan = temporaryStudyPlan.filter((entry) => entry.code !== course.code);

    setStudyPlanChangelog([...updatedChangelog, {"remove" : course.code}]);
    setTemporaryStudyPlan(updatedTempStudyPlan);
  }

  const saveTemporaryStudyPlan = async () => {
    let updatedChangeLog = checkGhostEdit();

    updatedChangeLog.forEach(async (course) => {
      console.log("nm", course);
      if(course["add"] !== undefined){
        await API.addCourseToStudyPlan(user.id, course["add"]).catch((err) => {
          console.log(err);
        });
      }

      if(course["remove"] !== undefined){
        await API.removeCourseFromStudyPlan(user.id, course["remove"]).catch((err) => {
          console.log(err);
        });
      }
    });


    setTemporaryStudyPlan([]);
    setStudyPlanChangelog([]);
   }

  const cancelStudyPlanChangelog = async () => {
    setStudyPlanChangelog([]);
    setTemporaryStudyPlan([]);
  }

  const checkGhostEdit = () => {
    let updatedChangelog = [], tempChangelog, index = 0;
    let modified;
    
    
    // tempChangelog = studyPlanChangelog;
    // updatedChangelog = studyPlanChangelog;

    // tempChangelog.filter((clCourseRemove) => clCourseRemove["remove"] !== undefined)
    //              .map((clCourseRemove, index) => {
    //                console.log("exec rem");
    //                let resultRemove = studyPlan.filter((spCourse) => spCourse.code === clCourseRemove["remove"]);

    //                if(!resultRemove.length){
    //                  updatedChangelog.splice(index, 1);
    //                  modified = true;
    //                }
    //              });




    // tempChangelog = studyPlanChangelog;

    // tempChangelog.filter((clCourseAdd) => clCourseAdd["add"] !== undefined)
    //             //  .map((clCourseAdd, index) => {
    //             //   console.log("exec add");
    //             //     let resultAdd = studyPlan.filter((spCourse) => spCourse.code === clCourseAdd["add"]);

    //             //     if(resultAdd.length === 1){
    //             //       updatedChangelog.splice(index, 1);
    //             //       modified = true;
    //             //     }
    //             //   });
    
    //updatedChangelog = studyPlanChangelog.slice();
    //tempChangelog = updatedChangelog.slice();
    let remFlag;

    for(let clCourse in studyPlanChangelog){
      modified = false;
      remFlag = false;

      if(studyPlanChangelog[clCourse].add !== undefined){
        console.log("a");
        for(let spCourse in studyPlan){
          if(studyPlan[spCourse].code === studyPlanChangelog[clCourse].add){
            modified = true;
          }
        }

        if(!modified){
          console.log("not modified");
          updatedChangelog.push({"add" : studyPlanChangelog[clCourse].add})
        }
      }
      else {
        console.log("r");
        for(let spCourse in studyPlan){
          if(studyPlan[spCourse].code === studyPlanChangelog[clCourse].remove){
            remFlag = true;
          }
        }

        if(!remFlag){
          modified = true;
        }

        if(!modified){
          updatedChangelog.push({"remove" : studyPlanChangelog[clCourse].remove})
        }
      }

    }

    //console.log(updatedChangelog);
    setStudyPlanChangelog(updatedChangelog);
    return updatedChangelog;
  }


  const typeToCredits = {"fulltime" : {min: 60, max: 80}, "partime" : {min: 20, max: 40}};
    
  return (
      <>
        <Container fluid id='main-container'>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={
                <MainRoute setMessage={setMessage} message={message} loggedIn={loggedIn} mode={mode} setMode={setMode} creditsBoundaries={creditsBoundaries} initTemporaryStudyPlan={initTemporaryStudyPlan} addStudyPlan={addStudyPlan} deleteStudyPlan={deleteStudyPlan} saveTemporaryStudyPlan={saveTemporaryStudyPlan} addCourseToStudyPlanChangelog={addCourseToStudyPlanChangelog} removeCourseFromStudyPlanChangelog={removeCourseFromStudyPlanChangelog} cancelStudyPlanChangelog={cancelStudyPlanChangelog} hasStudyPlan={hasStudyPlan} handleLogout={handleLogout} courses={courses} studyPlanChangelog={studyPlanChangelog} studyPlan={studyPlan} temporaryStudyPlan={temporaryStudyPlan}/>
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
