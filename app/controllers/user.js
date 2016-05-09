var mongoose = require('mongoose');
var User = mongoose.model('User');
var Account = mongoose.model('accounts');
var passport = require('passport');

// signup
exports.showSignup = function(req, res) {
  res.render('signup', {
    title: '注册页面'
  });
}

exports.showSignin = function(req, res) {
  res.render('signin', {
    title: '登录页面'
  });
}

exports.signup = function(req, res, next) {
  Account.register(new Account({ username : req.body.username }),
    req.body.password, function(err, account) {
      if (err) {
        return res.render('register', { error : err.message });
      }
      console.log(account);
      passport.authenticate('local')(req, res, function () {
        req.session.user = {
          username: req.body.username,
        }
        return res.redirect('/');
        req.session.save(function (err) {
          if (err) {
            return next(err);
          }
          res.redirect('/');
        });
      });
    }
  );

  // User.findOne({name: _user.name},  function(err, user) {
  //   if (err) {
  //     console.log(err);
  //   }
  //
  //   if (user) {
  //     return res.redirect('/signin');
  //   }
  //   else {
  //     user = new User(_user);
  //     user.save(function(err, user) {
  //       if (err) {
  //         console.log(err);
  //       }
  //
  //       res.redirect('/');
  //     })
  //   }
  // });
}

// signin
exports.signin = function(req, res, next) {
  req.session.user = {
    username: req.body.username,
  }
  console.log(req.session);
  //res.redirect('/');
  req.session.save(function (err) {
    if (err) {
      return next(err);
    }
    return res.redirect('/');
  });
  // var _user = req.body.user;
  // req.session.user = _user;
  // console.log(req.session);
  // return res.redirect('/');
  // User.findOne({name: name}, function(err, user) {
  //   if (err) {
  //     console.log(err);
  //   }

  //   if (!user) {
  //     return res.redirect('/signup');
  //   }

  //   user.comparePassword(password, function(err, isMatch) {
  //     if (err) {
  //       console.log(err);
  //     }

  //     if (isMatch) {
  //       req.session.user = user;
  //       return res.redirect('/');
  //     }
  //     else {
  //       return res.redirect('/signin');
  //     }
  //   })
  // })
}

// logout
exports.logout =  function(req, res) {
  delete req.session.user;
  //delete app.locals.user

  res.redirect('/');
}

// userlist page
exports.list = function(req, res) {
  User.fetch(function(err, users) {
    if (err) {
      console.log(err)
    }

    res.render('userlist', {
      title: 'imooc 用户列表页',
      users: users
    });
  })
}

// midware for user
exports.signinRequired = function(req, res, next) {
  var user = req.session.user;
  if (!user) {
    return res.redirect('/signin');
  }

  next();
}

exports.adminRequired = function(req, res, next) {
  var user = req.session.user;

  if (user.role <= 10) {
    return res.redirect('/signin');
  }

  next();
}
