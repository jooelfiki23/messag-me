const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require("connect-flash");

const routers = require("./controler/control");
const passport = require('passport');
const passportConfig = require("./config_setup/passport_config");
passportConfig(passport);

// تعيين EJS كمحرك قوالب
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // تحديد مكان قوالب EJS
app.use(express.static('public'));

app.use(express.json()); // لتحليل بيانات JSON
app.use(express.urlencoded({ extended: true })); // لتحليل بيانات الفورم

// main set for passport
const MongoStore = require("connect-mongo");
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://jooelfiki23:l4dJ4W4SA2q1rgU7@cluster0.4yt3a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      ttl: 30 * 24 * 60 * 60 // وقت الصلاحية (30 يومًا)
    }),
    
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000 // وقت الصلاحية (30 يومًا)
    }
  })
);

// إعداد connect-flash
app.use(flash());



app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});


app.use(passport.initialize());
app.use(passport.session());






mongoose.connect("mongodb+srv://jooelfiki23:l4dJ4W4SA2q1rgU7@cluster0.4yt3a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  }) .then(()=>{
    app.listen(port, ()=>{
        console.log(`http://localhost:${port}`)
    })
  })


app.use(routers);