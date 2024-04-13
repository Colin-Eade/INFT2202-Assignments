import express from 'express';
import User from '../models/user'
import {UserDisplayName, AuthGuard} from '../utils';
import passport from 'passport';

const router = express.Router();
const titlePrefix: string = "Harmony Hub -"

//region Unprotected Routes
router.get('/', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Home`, page: "home", displayName: UserDisplayName(req) });
});
router.get('/home', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Home`, page: "home", displayName: UserDisplayName(req) });
});
router.get('/careers', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Careers`, page: "careers", displayName: UserDisplayName(req) });
});
router.get('/contact', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Contact Us`, page: "contact", displayName: UserDisplayName(req) });
});
router.get('/gallery', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Gallery`, page: "gallery", displayName: UserDisplayName(req) });
});
router.get('/events', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Events`, page: "events", displayName: UserDisplayName(req) });
});
router.get('/news', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} News`, page: "news", displayName: UserDisplayName(req) });
});
router.get('/portfolio', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Portfolio`, page: "portfolio", displayName: UserDisplayName(req) });
});
router.get('/privacy_policy', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Privacy Policy`, page: "privacy_policy", displayName: UserDisplayName(req) });
});
router.get('/services', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Services`, page: "services", displayName: UserDisplayName(req) });
});
router.get('/team', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Team`, page: "team", displayName: UserDisplayName(req) });
});
router.get('/terms_of_service', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Terms of Service`, page: "terms_of_service", displayName: UserDisplayName(req) });
});
//endregion

//region Protected Routes
router.get('/dashboard', AuthGuard, function(req, res, next): void {
  res.render('index',
      { title: `${titlePrefix} Dashboard`, page: "dashboard", messages: req.flash('dashboardMessage'), displayName: UserDisplayName(req) });
});
router.get('/event_planning', AuthGuard, function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Plan an Event`, page: "event_planning", displayName: UserDisplayName(req) });
});
router.get('/statistics', AuthGuard, function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Statistics`, page: "statistics", displayName: UserDisplayName(req) });
});
//endregion

//region Authentication Routes
router.get('/login', function(req, res, next): void {

  if (!req.user) {
    return res.render('index',
        { title: `${titlePrefix} Login`, page: "login", messages: req.flash('loginMessage'),  displayName: UserDisplayName(req) });
  }
  return res.redirect("/dashboard");
});

router.post('/login', function(req, res, next) {

  passport.authenticate('local', function (err: Error, user: Express.User, info: string) {

    if (err) {
      console.error(err);
      res.end();
    }
    if (!user) {
      req.flash('loginMessage', "Invalid credentials. Please try again.");
      return res.redirect('/login');
    }
    req.login(user, function(err): void {

      if (err) {
        console.error(err);
        res.end();
      }
      res.redirect('/dashboard');
    });
  })(req, res, next);
});

router.get('/logout', function(req, res, next) {

  req.logout(function (err): void {
    if (err) {
      console.error(err);
      res.end();
    }
    res.redirect('/login');
  });
});

router.get('/register', function(req, res, next) {

  if(!req.user) {
    return res.render('index',
        { title: 'Register', page: "register", messages: req.flash('registerMessage'), displayName: UserDisplayName(req) });
  }
  return res.redirect("/dashboard");
});

router.post('/register', function(req, res, next) {

  let newUser = new User({
    username: req.body.username,
    emailAddress: req.body.emailAddress,
    displayName: req.body.firstName + ' ' + req.body.lastName,
    phone: req.body.phone,
    address: req.body.address,
    birthday: new Date(req.body.birthday)
  });

  User.register(newUser, req.body.password, function(err) {

    if (err) {
      let errorMessage = "Sorry, we are unable to process your request at this time."

      if (err.errors) {
        for (let field in err.errors) {
          if (err.errors[field].kind === 'required') {
            errorMessage = 'Please fill out all the fields.';
            break;
          }
        }
      }

      if (err.name == "UserExistsError") {
        errorMessage = "A user with this username or email already exists in the system."
      }

      req.flash('registerMessage', errorMessage);
      res.redirect('/register');
    }

    return passport.authenticate('local')(req, res, function(){
      return res.redirect('/dashboard');
    });
  });
});
//endregion

export default router;
