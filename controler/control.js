const express = require('express');
const router = express.Router();

const users = require("../api/users_schema")
const passport = require('passport');
const passportConfig = require("../config_setup/passport_config");
passportConfig(passport);

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }
  


router.get('/login' , (req ,res)=>{
    res.render('../views/login.ejs', {active: "login"})
})

router.post("/login", passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true // إذا كنت تستخدم الرسائل الفورية
  }));


router.get('/signup' , (req ,res)=>{
    res.render('../views/signup.ejs', {active: "signup"})
})

router.post('/signup' , (req ,res)=>{
    const userss = new users({
        username: req.body.username, // البيانات التي تأتي من الفورم
        email: req.body.email,
        password: req.body.password
    });
    
    userss.save()
        .then((result) => {
            console.log(result);
            res.render('../views/dashbord.ejs'); // عرض صفحة الـ dashboard بعد التسجيل
        })
        .catch((err) => {
            console.error('Error saving user:', err);
            res.status(500).send('Error saving user');
        });
    
})



router.get("/", isAuthenticated, (req, res) => {
    res.render("../views/dashbord.ejs");
  });





module.exports = router