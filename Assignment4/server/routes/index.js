"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../models/user"));
const utils_1 = require("../utils");
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
const titlePrefix = "Harmony Hub -";
router.get('/', function (req, res, next) {
    res.render('index', { title: `${titlePrefix} Home`, page: "home", displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/home', function (req, res, next) {
    res.render('index', { title: `${titlePrefix} Home`, page: "home", displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/careers', function (req, res, next) {
    res.render('index', { title: `${titlePrefix} Careers`, page: "careers", displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/contact', function (req, res, next) {
    res.render('index', { title: `${titlePrefix} Contact Us`, page: "contact", displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/gallery', function (req, res, next) {
    res.render('index', { title: `${titlePrefix} Gallery`, page: "gallery", displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/events', function (req, res, next) {
    res.render('index', { title: `${titlePrefix} Events`, page: "events", displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/news', function (req, res, next) {
    res.render('index', { title: `${titlePrefix} News`, page: "news", displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/portfolio', function (req, res, next) {
    res.render('index', { title: `${titlePrefix} Portfolio`, page: "portfolio", displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/privacy_policy', function (req, res, next) {
    res.render('index', { title: `${titlePrefix} Privacy Policy`, page: "privacy_policy", displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/services', function (req, res, next) {
    res.render('index', { title: `${titlePrefix} Services`, page: "services", displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/team', function (req, res, next) {
    res.render('index', { title: `${titlePrefix} Team`, page: "team", displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/terms_of_service', function (req, res, next) {
    res.render('index', { title: `${titlePrefix} Terms of Service`, page: "terms_of_service", displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/dashboard', utils_1.AuthGuard, function (req, res, next) {
    res.render('index', { title: `${titlePrefix} Dashboard`, page: "dashboard", messages: req.flash('dashboardMessage'), displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/event_planning', utils_1.AuthGuard, function (req, res, next) {
    res.render('index', { title: `${titlePrefix} Plan an Event`, page: "event_planning", displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/statistics', utils_1.AuthGuard, function (req, res, next) {
    res.render('index', { title: `${titlePrefix} Statistics`, page: "statistics", displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/login', function (req, res, next) {
    if (!req.user) {
        return res.render('index', { title: `${titlePrefix} Login`, page: "login", messages: req.flash('loginMessage'), displayName: (0, utils_1.UserDisplayName)(req) });
    }
    return res.redirect("/dashboard");
});
router.post('/login', function (req, res, next) {
    passport_1.default.authenticate('local', function (err, user, info) {
        if (err) {
            console.error(err);
            res.end();
        }
        if (!user) {
            req.flash('loginMessage', "Invalid credentials. Please try again.");
            return res.redirect('/login');
        }
        req.login(user, function (err) {
            if (err) {
                console.error(err);
                res.end();
            }
            res.redirect('/dashboard');
        });
    })(req, res, next);
});
router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            console.error(err);
            res.end();
        }
        res.redirect('/login');
    });
});
router.get('/register', function (req, res, next) {
    if (!req.user) {
        return res.render('index', { title: 'Register', page: "register", messages: req.flash('registerMessage'), displayName: (0, utils_1.UserDisplayName)(req) });
    }
    return res.redirect("/dashboard");
});
router.post('/register', function (req, res, next) {
    let newUser = new user_1.default({
        username: req.body.username,
        emailAddress: req.body.emailAddress,
        displayName: req.body.firstName + ' ' + req.body.lastName,
        phone: req.body.phone,
        address: req.body.address,
        birthday: new Date(req.body.birthday)
    });
    user_1.default.register(newUser, req.body.password, function (err) {
        if (err) {
            let errorMessage = "Sorry, we are unable to process your request at this time.";
            if (err.errors) {
                for (let field in err.errors) {
                    if (err.errors[field].kind === 'required') {
                        errorMessage = 'Please fill out all the fields.';
                        break;
                    }
                }
            }
            if (err.name == "UserExistsError") {
                errorMessage = "A user with this username or email already exists in the system.";
            }
            req.flash('registerMessage', errorMessage);
            res.redirect('/register');
        }
        return passport_1.default.authenticate('local')(req, res, function () {
            return res.redirect('/dashboard');
        });
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map