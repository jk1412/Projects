let express = require('express');
const passport = require('passport');
let router = express.Router();
let User = require('../models/aadharUsers')
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/register',function(req,res,next){
  addToDb(req,res)
})

router.post('/login',function(req,res,next){
  passport.authenticate('LocalStrat',function(err,user,info){
    if(err) 
    {return res.status(501).json(err);}

    if(!user)
    {
      return res.status(501).json(info) 
    }

    req.login(user, function(err) {
      if (err) { return next(err); }
      else
      return res.status(201).json({message:'User Sucessfully logged in'});
    });
  }) (req,res,next);
})


async function addToDb(req,res)
{
  let user = new User({
  fname:req.body.fname,
  lname:req.body.lname,
  phonenumber:req.body.phonenumber,
  email:req.body.email,
  username:req.body.username,
  password:User.hashPassword(req.body.password),
  address:req.body.address,
  creationDT:Date.now()
})
try{
  document=user.save()
  return res.status(201).send(document)
}
catch(err)
{
  return res.status(500).send(err) 
}

}

router.get('/home',isValidUser,function(req,res,next){
  return res.status(200).json(req.user)
}); 

router.get('/logout',isValidUser,function(req,res){
  console.log("Logout running.......")
  req.session.destroy()
  console.log("After logout")
  return res.status(200).json({message:'Logout sucessfully'})
})

function isValidUser(req,res,next){
  if(req.isAuthenticated()){
  console.log("Is authenticated")
  next();
  }
  else
  {
  return res.status(401).json({message:'Unauthorized request'})
  }
}


module.exports = router;
