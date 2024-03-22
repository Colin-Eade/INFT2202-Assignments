import express from 'express';
const router = express.Router();
const titlePrefix: string = "Harmony Hub -"
/* GET home page. */
router.get('/', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Home`, page: "home", displayName: '' });
});
router.get('/home', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Home`, page: "home", displayName: '' });
});
router.get('/careers', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Careers`, page: "careers", displayName: '' });
});
router.get('/contact', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Contact Us`, page: "contact", displayName: '' });
});
router.get('/events', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Events`, page: "events", displayName: '' });
});
router.get('/gallery', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Gallery`, page: "gallery", displayName: '' });
});
router.get('/login', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Login`, page: "login", displayName: '' });
});
router.get('/news', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} News`, page: "news", displayName: '' });
});
router.get('/portfolio', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Portfolio`, page: "portfolio", displayName: '' });
});
router.get('/privacy_policy', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Privacy Policy`, page: "privacy_policy", displayName: '' });
});
router.get('/register', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Register`, page: "register", displayName: '' });
});
router.get('/services', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Services`, page: "services", displayName: '' });
});
router.get('/team', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Team`, page: "team", displayName: '' });
});
router.get('/terms_of_service', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Terms of Service`, page: "terms_of_service", displayName: '' });
});
router.get('/event_planning', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Plan an Event`, page: "event_planning", displayName: '' });
});
router.get('/statistics', function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Statistics`, page: "statistics", displayName: '' });
});

export default router;
