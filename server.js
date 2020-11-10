if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  
  const express = require('express')
  const app = express()

  //from auth-tut
  const bcrypt = require('bcrypt')
  const passport = require('passport')
  const flash = require('express-flash')
  const session = require('express-session')
  const methodOverride = require('method-override')
  //const projectRouter = require('./routes/projects')


//from role-tut
const {authUser,alreadyAuth,authRole,checkAuthenticated,
  checkNotAuthenticated }= require("./basicAuth")
const {ROLE,users,bon}= require("./data")
  
//const users = [{"name": "u", "email": "m","password":""}]
  
  const initializePassport = require('./passport-config')
  initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
  )
  
  
  app.use(express.json())
  app.use(setUser)
  //app.use('/projects', projectRouter)
  app.set('view-engine', 'ejs')
  app.use(express.urlencoded({ extended: false }))
  app.use(flash())
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(methodOverride('_method'))
  

  //AKO ULOG =>  OK
  app.get('/', (req, res) => {

      
    res.redirect('/login');
    
    /*if(req.user.role === ROLE.ADMIN )
    res.render('adminPage.ejs')
    else
    res.render('dashboard.ejs')*/
  })
  

  app.get('/dashboard',authUser,authRole(ROLE.BASIC) ,(req, res) => {
    //res.send('Dashboard Page')
    const bonovi= bon.filter(bon => bon.ownerId==req.user.id ).map(bon =>{
      var tempDate = new Date(bon.genDate);
      return {
        id:bon.id ,
        genDate:tempDate.toDateString(),
        active:bon.active,
        ownerId:bon.ownerId
      };
    })
    var datetime = new Date();// generate todays date

    var razlika=new Date(datetime+ datetime - Date(bon[0].genDate));


    res.render('dashboard.ejs', {currentUser: req.user,users: users,bonovi:bonovi,todayDate:datetime,razlika:razlika})
  })

  app.get('/admin',authUser,authRole(ROLE.ADMIN), (req, res) => {
    //res.send('Admin Page')
    res.render('adminPage.ejs', {currentUser: req.user,users: users})
  })

  app.get('/users', (req, res) => {
    res.send(users)
  })

  app.get('/users/:id', (req, res) => {
    res.render('user.ejs')
  })
 
//checkNotAuthenticated
  app.get('/login' , (req, res) => {
    res.render('login.ejs')
  })

  /*app.post('/login', passport.authenticate('local', {
    successRedirect: './',
    failureRedirect: '/login',
    failureFlash: true
  }))*/

  app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login?'); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        if(user.role === ROLE.ADMIN){
          return res.redirect('/admin');  
        }else if(user.role === ROLE.BASIC){
          return res.redirect('/dashboard');  
        }
        /*else{
          return res.send(users)

        }*/

        
      });
    })(req, res, next);
  });




  
  ///////////////////////REG BRANCH
  //AKO ULOG =>  OK
  app.get('/register'/*,authUser,authRole(ROLE.ADMIN)*/, (req, res) => {
    res.render('register.ejs')
  })

  app.get('/register/:id',/*authUser,authRole(ROLE.ADMIN),*/ (req, res) => {
    //res.send(users[0])
    const tempUser= users.filter(user => user.id==req.params.id )
    res.render('register.ejs',{user:tempUser[0]})
    
  })

  //AKO ULOG =>  OK
  app.post('/register'/*,authUser,authRole(ROLE.ADMIN),*/,async (req, res) => {
    try {
      
    
      const hashedPassword = await bcrypt.hash(req.body.password,10)
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: ROLE.BASIC,
        balance:0
      })
      res.redirect('/admin' )
    } catch {
      res.redirect('/register')
    }
  })

  app.post('/register/:id',/*authUser,authRole(ROLE.ADMIN),*/ (req, res) => {
    const fIndex = (element) => element.id == req.body.oldId;
    const i= users.findIndex(fIndex)
    //res.send(tempId)
    users[i].name=req.body.name;
    users[i].email=req.body.email;
    //res.send(i.toString())
    res.redirect('/admin')
    
  })
  
  ///////////////////////OTHER FNS
  app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })
  

  function setUser(req, res, next) {
    const userId = req.body.userId
    if (userId) {
      req.user = users.find(user => user.id === userId)
    }
    next()
  }

 

  app.listen(3000)