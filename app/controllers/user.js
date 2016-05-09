var mongoose = require('mongoose');
var User = mongoose.model('User');
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

exports.signup = function(req, res) {
  console.log('exec signup');
  User.register(new User({username: req.body.username}), req.body.password,
    function(err, user) {
      if(err) {
        console.log(err);
        //return res.render('signup', { error : err.message });
        res.redirect('/signup');
      }
      console.log(user);
      req.session.user = req.body.user;
      res.redirect('/');
      // passport.authenticate('local')(req, res, function () {
      //   console.log('exec authenticate');
      //   req.session.user = req.body.user;
      //   res.redirect('/');
      //   // req.session.save(function (err) {
      //   //     if (err) {
      //   //         return next(err);
      //   //     }
      //   //     res.redirect('/');
      //   // });
      // });
    });


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
  console.log('exec signin');
  var _user = req.body.user;
  passport.authenticate('local', function(err, user) {
    if (err) {
      res.status(500).send({
        error: 500,
        message: err.message
      });
    } else if (!user) {
      res.status(403).send({
        error: 403,
        message: 'Invalid username and password combination'
      });
    } else {
      req.logIn(user, (error) => {
        if (error) {
          res.status(500).send({
            error: 500,
            message: error.message
          });
        } else {
          req.session.user = _user;
          //res.status(200).end();
          return res.redirect('/');
        }
      });
    }
  })(req, res, next);
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
