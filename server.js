if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  
  const express = require('express')
  const app = express()
  const bcrypt = require('bcrypt')
  const passport = require('passport')
  const flash = require('express-flash')
  const session = require('express-session')
  const methodOverride = require('method-override')
  
  const initializePassport = require('./passport-config')
  initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
  )
  
  const users = [{"name": "u", "email": "m","password":""}]
  
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
  app.get('/', checkAuthenticated, (req, res) => {
    if(req.user.level > 0)
        res.render('index2.ejs', { name: req.user.name, level: req.user.level, password: req.user.password})
    else
    res.render('index.ejs', { name: req.user.name, level: req.user.level})
  })
  

  //AKO ULOG =>  X
  app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
  })

   //AKO ULOG =>  X
  app.post('/login',checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))
  
  //AKO ULOG =>  OK
  app.get('/register', (req, res) => {
    res.render('register.ejs')
  })
  //AKO ULOG =>  OK
  app.post('/register',async (req, res) => {
    try {
    
      const hashedPassword = await bcrypt.hash(req.body.password,10)
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        level: 1
      })
      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
  })
  
  app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }

    
  function checkNotAdmin(req, res, next) {
    if (req.user.level < 1 ) {
      return res.redirect('/')
    }
    next()
  }
  
  app.listen(3000)