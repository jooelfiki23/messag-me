const passport = require("passport");
const localstratgey = require("passport-local").Strategy;
const users = require("../api/users_schema");


module.exports = (passport) => {
    passport.use(
        "login",
        new localstratgey((username, password, done) => {
          users
            .findOne({ username: username })
            .then((user) => {
              if (!user) {
                return done(null, false, { message: "User not found" });
              }
              if (user.password !== password) {
                return done(null, false, { message: "Incorrect password" });
              }
              return done(null, user);
            })
            .catch((err) => {
              return done(err);
            });
        })
      );
      
};


passport.serializeUser((user, done)=>{
    done(null, user.id)
})

passport.deserializeUser((userId, done) => {
    users.findById(userId)
      .then((user) => {
        done(null, user); // لو لقيت المستخدم، رجعه
      })
      .catch((err) => {
        done(err, null); // لو فيه خطأ، رجع الخطأ
      });
  });
  