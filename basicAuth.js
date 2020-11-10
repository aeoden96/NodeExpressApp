/*
Checks if user is logged in,
otherwise => error
*/
function authUser(req,res,next){
    if(req.user==null){
        res.status(403);
        return res.redirect('/login')
    }

    next()//cont. to the next piece of middleware

}

function alreadyAuth(req,res,next){
    if(req.user !==null){
        res.status(403);
        return res.send("You are logged in. Redirecting....")
    }

    next()//cont. to the next piece of middleware

}

function authRole(role){
    return (req,res,next) => {
        if(req.user.role !== role){
            res.status(401)
            return res.send("Not allowed")
        }
        next()
    }
}

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

module.exports= {
    authUser,
    authRole,
    alreadyAuth,
    checkAuthenticated,
    checkNotAuthenticated
}

