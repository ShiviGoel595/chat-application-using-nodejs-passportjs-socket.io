var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../model/register')
var bcrypt =require('bcrypt-nodejs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/chat', function(req, res, next) {
  res.render('chat');
});
router.get('/registration',function(req,res){
  res.render('registration')
});

router.post('/register',function(req,res){
console.log(req.body);
var encrypted_password = bcrypt.hashSync(req.body.password);
var p= new User({
  name:req.body.name,
  password:encrypted_password
});
       p.save(p,function(err){
         if(err)
         console.log(err);
       })
       res.send('you are succesfully registered');
})

router.get('/getusername',function(req,res){

    res.send(req.user.name);
});

router.get('/login',function(req,res){
  res.render('login')
});

router.get('/dash',function(req,res){
  res.render('dash')
});

router.post('/getallusers',function(req,res){
    var currentuser= req.user.name;
  User.find({"online":"online", "name":{$ne:currentuser}},function(err,docs){
      if(err)
      res.send(err)
      else
      res.send(docs);
  })
});

router.post('/login', passport.authenticate('local'),
    function(req, res) {
          User.findByIdAndUpdate({"_id":req.user._id},{$set:{"online":"online"}})
                .exec(function(err){
                   if (err)
                      res.send('error in updating')
                    
                    else 
                     res.send('successful login');
                })

    
});

            



 passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log('boooooooooooo');
        User.findOne({ name: username }, function (err, user) {
            if(user !== null) {
                var isPasswordCorrect = bcrypt.compareSync(password, user.password);
                if(isPasswordCorrect) {
                    console.log("Username and password correct!");
                    return done(null, user);
                } else {
                    console.log("Password incorrect!");
                    return done(null, false);
                }
           } else {
               console.log("Username does not exist!");
               return done(null, false);
           }
       });
    }
));


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(false, user);
});



module.exports = router;
