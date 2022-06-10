const express = require('express');
const morgan = require('morgan'); // logging middleware

 const passport = require('passport');
 const LocalStrategy = require('passport-local');
 const session = require('express-session');

const PORT = 3001;

const app = new express();

const Controller = require('./controller');
const Exceptions = require('./exceptions');
const cors = require('cors');

app.use(morgan('dev'));
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };

app.use(cors(corsOptions));

const controller = new Controller();
app.set('controller', controller);

app.use(express.json());
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));


// // Passport: set up local strategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
    const user = await controller.getUser(username, password)
    if(!user)
      return cb(null, false, 'Incorrect username or password.');
      
    return cb(null, user);
  }));
  
  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function (user, cb) { // this user is id + email + name
    return cb(null, user);
    // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
  });


  const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({error: 'Not auth'});
  }
  
  app.use(session({
    secret: "webapp exam",
    resave: false,
    saveUninitialized: false,
  }));
  app.use(passport.authenticate('session'));


//LOGIN APIs
//POST /api/sessions -> MOVE TOGETHER WITH passport vars IN ANOTHER ROUTER
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).send(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});

// app.post('/api/sessions', passport.authenticate('local'), (req, res) => {
//     res.status(201).json(req.user);
//   });

// GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});




//APIs

//Get all courses
app.get('/courses', isLoggedIn, async (req,res)=>{
  const controller = req.app.get('controller');
  let courses = await controller.getAllCourses();
  const fullCourses = [];


  for(course of courses){
    let preparatoryCourse;
    let incompatibleCourses;

    if(course.preparatoryCourse !== ""){
      let result;
      await controller.getCourseByCode(course.preparatoryCourse).then((res) => {
        preparatoryCourse = res[0];
      }).catch((err) => {
        return res.status(error.getCode()).send(error.getMessage());
      });
    } 


    await controller.getIncompatibleCourses(course.code).then((res) => {
      incompatibleCourses = res;
    }).catch((err) => {
      return res.status(error.getCode()).send(error.getMessage());
    })

    fullCourses.push({course: course, preparatoryCourseDetails : preparatoryCourse, incompatibleCourses : incompatibleCourses});

    
  }

  return res.status(200).json(fullCourses);
});