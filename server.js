if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  
  const express = require('express')
  const app = express()
  const mongoose = require('mongoose');
  //from auth-tut
  const bcrypt = require('bcrypt')
  const passport = require('passport')
  const flash = require('express-flash')
  const session = require('express-session')
  const methodOverride = require('method-override')
  //from role-tut
  const {authUser,alreadyAuth,authRole,checkAuthenticated,checkNotAuthenticated }= require("./basicAuth")
  const {ROLE,ACTION,users,bon,log}= require("./data")
  const initializePassport = require('./passport-config')

  initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
  )
  
  app.use(express.json())
  app.use(setUser)
  app.set('view-engine', 'ejs')
  app.use(express.urlencoded({ extended: false }))
  app.use(flash())
  app.use(session({
    secret: "dafaffjkfag1seg5sgs5g1sg51",//process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(methodOverride('_method'))
  

  



  //AKO ULOG =>  OK
  app.get('/', (req, res) => {
    res.redirect('/login');
  })
  
  app.post('/generate',authUser,authRole(ROLE.BASIC) ,(req, res) => {
    const i= pronadiIndexUsera(req.user.id)
    if(users[i].genCount==0) return res.redirect('/dashboard?error');
    users[i].genCount--;

    bon.push({
      id: Math.floor(Math.random()*10000000000),
      genDate: new Date(),
      active:false,
      ownerId:req.user.id,
      value:30,   
      duration:30
    })
    addToLog(req.user.id,new Date(),ACTION.GENERATION,req.user.role)
    return res.redirect('/dashboard');
  })


  app.post('/activate/:id',authUser,authRole(ROLE.BASIC) ,(req, res) => {
    var info= vratiAktivnost(req.user.id)
    var userInd= pronadiIndexUsera(req.user.id)
   
    if(info[1] == true){
      return res.redirect('/dashboard?activ=alreadyActive');
    }
    const ind= pronadiIndexOdBona(req.params.id )

    if (bon[ind].ownerId != req.user.id){
      return res.redirect('/dashboard?activ=notAllowedToActivate');
    }

    bon[ind].actDate= new Date()
    users[userInd].balance += bon[ind].value;

    addToLog(req.user.id,new Date(),ACTION.ACTIVATON,req.user.role)
    return res.redirect('/dashboard?activ=success');
  })



  app.get('/dashboard',authUser,authRole(ROLE.BASIC) ,(req, res) => {
    //res.send('Dashboard Page')
    var info= vratiAktivnost(req.user.id)

    var bonoviZaIspis= info[0].map(temp=> {
       
      return{
        id:temp.id,
        genDate:temp.genDate.toLocaleDateString('hr-HR') ,
        actDate:temp.actDate?temp.actDate.toLocaleDateString('hr-HR'):'not activated' ,
        ownerId:temp.ownerId,
        value:temp.value,   
        duration:temp.duration,
        
      }
    
    }
      )


    var datetime=new Date()
 
    temp= {
      currentUser: req.user ,
      isActive:info[1],
      bonovi:bonoviZaIspis,
      aktTime:info[3],
      aktExp:new Date(new Date().setDate(new Date().getDate() +info[3])).toLocaleDateString('hr-HR') ,
      todayDate:datetime,
      activeIndex:info[2]

    }


    res.render('dashboard.ejs',temp )
    //res.send(temp)
    
  })


  app.get('/log',authUser,authRole(ROLE.ADMIN), (req, res) => {
    res.send(log)
  })

  app.get('/admin',authUser,authRole(ROLE.ADMIN), (req, res) => {
    //res.send('Admin Page')
    res.render('adminPage.ejs', {currentUser: req.user,users: users})
  })


  app.post('/admin/search',authUser,authRole(ROLE.ADMIN), (req, res) => {

    if(req.body['input'] == ''){
      return res.redirect('/admin/')
    } 

    res.redirect('./search/'+ req.body['selection'] + '/' + req.body['input'])
  })

  app.get('/admin/search/id/:id',authUser,authRole(ROLE.ADMIN), (req, res) => {
    var filUsers=users.filter(user => user.id == req.params.id)
    res.render('adminPage.ejs', {currentUser: req.user,users: filUsers})
  })
  app.get('/admin/search/email/:email',authUser,authRole(ROLE.ADMIN), (req, res) => {
    var filUsers=users.filter(user => user.email == req.params.email)
    res.render('adminPage.ejs', {currentUser: req.user,users: filUsers})
  })
  app.get('/admin/search/name/:name',authUser,authRole(ROLE.ADMIN), (req, res) => {
    var filUsers=users.filter(user => user.name == req.params.name)
    res.render('adminPage.ejs', {currentUser: req.user,users: filUsers})
  })

  app.get('/users', (req, res) => {
    res.send(users)
  })

  app.get('/users/:id', (req, res) => {
    var info= vratiAktivnost(req.params.id)

    var bonoviZaIspis= info[0].map(temp=> {
       
      return{
        id:temp.id,
        genDate:temp.genDate.toLocaleDateString('hr-HR') ,
        actDate:temp.actDate?temp.actDate.toLocaleDateString('hr-HR'):'not activated' ,
        ownerId:temp.ownerId,
        value:temp.value,   
        duration:temp.duration,
        
      }
    })

    const i= pronadiIndexUsera(req.params.id)
    res.render('user.ejs',{isActive:info[1],activeIndex:info[2], user:users[i],bonovi:bonoviZaIspis})
    
  })
 
  app.get('/login' , (req, res) => {
    res.render('login.ejs')
  })


  function vratiAktivnost(userId){
    const bonovi= pronadiBonovePoId(userId)
    var datetime=new Date()
    isActiveVar=null
    isActive=false
    diff=0
    var i=0;

    for( i=0; i< bonovi.length ;i++)
    {
      if(bonovi[i].actDate ==null){
        //i nije aktiviran jos
        continue;
      }

      diffDays = Math.ceil((bonovi[i].actDate- datetime ) / (1000 * 60 * 60 * 24));

      if(diffDays < 0){
        //greska ,aktDate je prije datetime
        
      }

      if(diffDays <= bonovi[i].duration )
      {
        isActive=true
        diff=bonovi[i].duration - diffDays
        break;

      }
      else{
        //diff=bonovi[i].duration - diffDays
        
      
      }

    }
    
    if(isActive)
      return [bonovi,isActive,i,diff]
    else
      return [bonovi,isActive,-1,diff]
  }



  function pronadiIndexOdBona(bonId){
    const indexLogic = (element) => element.id == bonId;
    const i= bon.findIndex(indexLogic)
    return i
  }
  function pronadiIndexUsera(userId) {
    const indexLogic = (element) => element.id == userId;
    const i= users.findIndex(indexLogic)
    return i
  }

  function pronadiBonovePoId(userId){
    return bon.filter(bon => bon.ownerId == userId)
  }

  app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login?'); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        addToLog(user.id,new Date(),ACTION.LOGIN,user.role)
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

      var filUsers=users.filter(user => user.email == req.params.email)
      if(filUsers.length==0)
      {
        res.redirect('/register?error=emailMatch')
      }
      
    
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
    var i= pronadiIndexUsera(req.body.oldId)
    users[i].name=req.body.name;
    users[i].email=req.body.email;
    //res.send(i.toString())
    res.redirect('/admin')
    
  })
  
  app.delete('/logout', (req, res) => {

    addToLog(req.user.id, new Date(), ACTION.LOGOUT ,req.user.role)
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

  function addToLog(userId,date, action, role ){
    log.push({
      id: userId, date: date,action:action,role: role
    })
  }

 
const port = process.env.PORT || 3000;

  app.listen(port,function (){
    console.log("Server started!")
  })