const express = require("express");
const router = express.Router();

const users = require("../api/users_schema");
const passport = require("passport");
const passportConfig = require("../config_setup/passport_config");
passportConfig(passport);

const nodemailer = require("nodemailer"); // استيراد مكتبة البريد

const app = express();
// 1. إنشاء ناقل البريد (ساعي البريد)
const transporter = nodemailer.createTransport({
  service: "gmail", // نوع البريد الذي تستخدمه (جيميل في هذه الحالة)
  auth: {
    user: " jooelfiki23@gmail.com", // بريدك الإلكتروني
    pass: "mjem ivpe khbk mqkd", // كلمة مرور التطبيق (App Password)
  },
});

const min = 1;
const max = 9;
const count = 4; // عدد الأرقام اللي عايزها
const randomNumbers = Array.from({ length: count }, () =>
  Math.floor(Math.random() * (max - min + 1))
);

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

router.get("/login", (req, res) => {
  res.render("../views/login.ejs", { active: "login" });
});

router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true, // إذا كنت تستخدم الرسائل الفورية
  })
);

router.get("/signup", (req, res) => {
  res.render("../views/signup.ejs", { active: "signup" });
});

router.post("/signup", (req, res) => {
  const userss = new users({
    username: req.body.username, // البيانات التي تأتي من الفورم
    email: req.body.email,
    password: req.body.password,
  });

  userss
    .save()
    .then((result) => {
      currentUser = result;
      res.render("../views/verifycode.ejs");

      // 2. إعداد الرسالة التي سنرسلها
      const mailOptions = {
        from: " jooelfiki23@gmail.com", // البريد الذي يرسل الرسالة
        to: currentUser.email, // البريد الذي سيستلم الرسالة
        subject: "verify email",
        html: `<p style="font-size: 24px;">Verify code: <mark>${randomNumbers}</mark></p>`, // HTML لتنسيق النص
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("حدث خطأ أثناء إرسال الرسالة:", err); // إذا حدث خطأ
        } else {
          console.log("تم إرسال الرسالة بنجاح:", info.response); // إذا نجح الإرسال
        }
      });
    })
    .catch((err) => {
      console.error("Error saving user:", err);
      res.status(500).send("Error saving user");
    });
});

let currentUser = null;

router.post("/verifycode", (req, res) => {
  const verify = req.body.verifycode;

  if (verify == randomNumbers) {
    res.render("../views/dashbord.ejs", { user: currentUser });
  } else {
    res.status(400).send("Verification code is incorrect!"); // إذا كان خطأ، أرسل رسالة خطأ
  }
});

router.get("/", isAuthenticated, (req, res) => {
  if (req.isAuthenticated()) {
    const userdata = req.user;

    res.render("../views/dashbord.ejs", { user: userdata });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = router;
