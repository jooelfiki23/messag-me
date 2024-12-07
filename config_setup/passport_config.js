const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const users = require("../api/users_schema");

module.exports = (passport) => {
  passport.use(
    "login",
    new LocalStrategy((username, password, done) => {
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
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((userId, done) => {
    users.findById(userId)
      .then((user) => {
        if (user) {
          done(null, { id: user.id, email: user.email, username: user.username, password: user.password }); 
          // بترجع البيانات المهمة فقط
        } else {
          done(null, false);
        }
      })
      .catch((err) => {
        done(err, null);
      });
  });
};
