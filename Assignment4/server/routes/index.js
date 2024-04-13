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
    res.render('index', { title: `${titlePrefix} Dashboard`, page: "dashboard", user: req.user, messages: req.flash('dashboardMessage'), displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/edit_profile', utils_1.AuthGuard, function (req, res, next) {
    res.render('index', { title: `${titlePrefix} Edit Profile`, page: "edit_profile", user: req.user, messages: req.flash('editProfileMessage'), displayName: (0, utils_1.UserDisplayName)(req) });
});
router.post('/edit_profile', utils_1.AuthGuard, async function (req, res, next) {
    try {
        const existingUser = await user_1.default.findOne({
            $or: [
                { username: req.body.username, _id: { $ne: req.body.id } },
                { emailAddress: req.body.emailAddress, _id: { $ne: req.body.id } }
            ]
        });
        if (existingUser) {
            if (existingUser.username === req.body.username) {
                req.flash('dashboardMessage', '<div class="alert alert-danger">Username already taken.</div>');
            }
            else {
                req.flash('dashboardMessage', '<div class="alert alert-danger">Email address already taken.</div>');
            }
            return res.redirect('/dashboard');
        }
        const user = await user_1.default.findById(req.body.id);
        if (!user) {
            req.flash('dashboardMessage', '<div class="alert alert-danger">No user found with the given ID.</div>');
            return res.redirect('/dashboard');
        }
        user.username = req.body.username || user.username;
        user.displayName = req.body.displayName || user.displayName;
        user.emailAddress = req.body.emailAddress || user.emailAddress;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;
        user.birthday = req.body.birthday || user.birthday;
        user.updated = new Date();
        if (req.body.password && req.body.password.trim() !== '') {
            await user.setPassword(req.body.password);
        }
        await user.save();
        req.login(user, function (err) {
            if (err) {
                console.log('Error re-logging in user:', err);
                req.flash('loginMessage', '<div class="alert alert-danger">Profile updated but failed to re-login.</div>');
                return res.redirect('/login');
            }
            req.flash('dashboardMessage', '<div class="alert alert-success">Profile updated successfully!</div>');
            return res.redirect('/dashboard');
        });
    }
    catch (err) {
        req.flash('dashboardMessage', '<div class="alert alert-danger">Sorry, we are unable to process your request at this time.</div>');
        return res.redirect('/dashboard');
    }
});
router.post('/delete_profile', utils_1.AuthGuard, function (req, res, next) {
    user_1.default.deleteOne({ _id: req.body.id }).then(function () {
        req.flash("loginMessage", '<div class="alert alert-success">Account deletion successful!</div>');
        res.redirect("/login");
    }).catch(function (err) {
        req.flash("dashboardMessage", '<div class="alert alert-danger">Account deletion failed. Please try again.</div>');
        res.redirect("/dashboard");
    });
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
            req.flash('loginMessage', '<div class="alert alert-danger">Invalid credentials. Please try again.</div>');
            return res.redirect('/login');
        }
        req.login(user, function (err) {
            if (err) {
                console.error(err);
                res.end();
            }
            req.flash('dashboardMessage', '<div class="alert alert-success">Login successful!</div>');
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
            let errorMessage = '<div class="alert alert-danger">Sorry, we are unable to process your request at this time.</div>';
            if (err.errors) {
                for (let field in err.errors) {
                    if (err.errors[field].kind === 'required') {
                        errorMessage = '<div class="alert alert-danger">Please fill out all the fields.</div>';
                        break;
                    }
                }
            }
            if (err.name == "UserExistsError") {
                errorMessage = '<div class="alert alert-danger">A user with this username or email already exists in the system.</div>';
            }
            req.flash('registerMessage', errorMessage);
            res.redirect('/register');
        }
        return passport_1.default.authenticate('local')(req, res, function () {
            req.flash('dashboardMessage', '<div class="alert alert-success">Registration successful! Welcome to the dashboard.</div>');
            return res.redirect('/dashboard');
        });
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map