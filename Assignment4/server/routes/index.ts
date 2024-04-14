import express from 'express';
import User from '../models/user'
import ChatMessage from '../models/chatMessage';
import Event from '../models/event'
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

  Event.find().sort({eventDate: -1 }).then(function(data) {
    console.log(data)
    res.render('index', {
      title: `${titlePrefix} Events`,
      page: "events",
      events: data,
      messages: req.flash('eventsMessage'),
      displayName: UserDisplayName(req)
    });
  }).catch(function(err: string){
    console.error("Error reading events from Database - " + err);
    res.end();
  })
});

router.get('/like_event/:id', function(req, res) {

  let id = req.params.id;

  Event.updateOne({ _id: id }, { $inc: { eventLikeCount: 1 } }).then(function() {
    res.redirect('/events');
  }).catch(function(err) {
    req.flash("eventsMessage", '<div class="alert alert-danger">Failed to update likes. Please try again later.</div>');
    res.redirect('/events');
  });
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
      { title: `${titlePrefix} Dashboard`, page: "dashboard", user: req.user, messages: req.flash('dashboardMessage'), displayName: UserDisplayName(req) });
});

router.get('/edit_profile', AuthGuard, function(req, res, next): void {
  res.render('index',
      { title: `${titlePrefix} Edit Profile`, page: "edit_profile", user: req.user, messages: req.flash('editProfileMessage'), displayName: UserDisplayName(req) });
});

router.post('/edit_profile', AuthGuard, async function(req, res, next) {

  try {
    // Check if a user with the same email address or username already exists in the system
    const existingUser: any= await User.findOne({
      $or: [
        { username: req.body.username, _id: { $ne: req.body.id } },
        { emailAddress: req.body.emailAddress, _id: { $ne: req.body.id } }
      ]
    });

    // if the username/email address already exists, then return to dashboard and inform the user that their update failed
    if (existingUser) {
      if (existingUser.username === req.body.username) {
        req.flash('dashboardMessage', '<div class="alert alert-danger">Username already taken.</div>');
      } else {
        req.flash('dashboardMessage', '<div class="alert alert-danger">Email address already taken.</div>');
      }
      return res.redirect('/dashboard');
    }

    // Find and update the user
    const user: any = await User.findById(req.body.id);
    if (!user) {
      req.flash('dashboardMessage', '<div class="alert alert-danger">No user found with the given ID.</div>');
      return res.redirect('/dashboard');
    }

    // Update user information
    user.username = req.body.username || user.username;
    user.displayName = req.body.displayName || user.displayName;
    user.emailAddress = req.body.emailAddress || user.emailAddress;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.birthday = req.body.birthday || user.birthday;
    user.updated = new Date();

    // Update password if provided
    if (req.body.password && req.body.password.trim() !== '') {
      await user.setPassword(req.body.password);
    }

    // Save the user
    await user.save();

    // Re-login the user
    req.login(user, function(err): void {
      if (err) {
        console.log('Error re-logging in user:', err);
        req.flash('loginMessage', '<div class="alert alert-danger">Profile updated but failed to re-login.</div>');
        return res.redirect('/login');
      }
      req.flash('dashboardMessage', '<div class="alert alert-success">Profile updated successfully!</div>');
      return res.redirect('/dashboard');
    });

    // Catch any errors and inform the user of update failure
  } catch (err) {
    req.flash('dashboardMessage', '<div class="alert alert-danger">Sorry, we are unable to process your request at this time.</div>');
    return res.redirect('/dashboard');
  }
});

router.post('/delete_profile', AuthGuard, function(req, res, next) {

  // Delete the user based on the given id passed through
  User.deleteOne({ _id: req.body.id }).then(function(): void {
    req.flash("loginMessage", '<div class="alert alert-success">Account deletion successful!</div>');
    res.redirect("/login");

    // Inform the user if the deletion fails
  }).catch(function(): void {
    req.flash("dashboardMessage", '<div class="alert alert-danger">Account deletion failed. Please try again.</div>');
    res.redirect("/dashboard");
  });
});

router.get('/discussions', AuthGuard, function(req, res, next) {

  // Find and sort the chatMessages collection with newest first
  ChatMessage.find().sort({ creationDate: -1 })
      .then(function(data) {
        res.render('index', {
          title: `${titlePrefix} Discussions`,
          page: "discussions",
          user: req.user,
          chatMessages: data,
          messages: req.flash('discussionsMessage'),
          displayName: UserDisplayName(req),
        });
      })

      // Inform the user if the chat messages failed to load and return to dashboard
      .catch(function(err) {
        req.flash('dashboardMessage', '<div class="alert alert-danger">Failed to load discussions. Please try again later.</div>');
        res.redirect('/dashboard');
      });
});

router.get('/delete_message/:id', AuthGuard, function(req, res) {

  // ID of message to be deleted
  let id = req.params.id;

  // Delete the message and inform the user of successful deletion
  ChatMessage.deleteOne({_id: id}).then(function() {
    req.flash("discussionsMessage", '<div class="alert alert-success">Message deletion successful.</div>');
    res.redirect("/discussions");

    // Inform the user if the message deletion failed
  }).catch(function(err) {
    req.flash("discussionsMessage", '<div class="alert alert-danger">Failed to delete message. Please try again later.</div>');
    res.redirect('/discussions');
  })
});

router.get('/like_message/:id', AuthGuard, function(req, res) {

  // ID of message being liked
  let id = req.params.id;

  // Add 1 to the likes field of the message
  ChatMessage.updateOne({ _id: id }, { $inc: { likes: 1 } }).then(function() {
      res.redirect('/discussions');

      // Inform the user if liking the message failed
    }).catch(function(err) {
      req.flash("discussionsMessage", '<div class="alert alert-danger">Failed to update likes. Please try again later.</div>');
      res.redirect('/discussions');
    });
});

router.post('/submit_message', AuthGuard, function(req, res, next) {

  // Check if the user submitted an empty message and inform them if they did
  if (!req.body.content || req.body.content.trim() === '') {
    req.flash("discussionsMessage", '<div class="alert alert-danger">Message content cannot be empty.</div>');
    return res.redirect("/discussions");
  }

  // Create a new message
  let newMessage = new ChatMessage({
    username: req.body.username,
    content: req.body.content,
    creationDate: new Date()
  });

  // Add the message to the chatMessages collection and return to the discussions page
  ChatMessage.create(newMessage).then(function(): void {
    res.redirect("/discussions")

    // Inform the user if the message submission failed
  }).catch(function(err) {
    req.flash("discussionsMessage", '<div class="alert alert-danger">Failed to submit message. Please try again.</div>');
    res.redirect("/discussions");
  });
});

router.post('/edit_message', AuthGuard, function(req, res, next) {

  // Check if the editted message is empty
  if (!req.body.content || req.body.content.trim() === '') {
    req.flash("discussionsMessage", '<div class="alert alert-danger">Message content cannot be empty.</div>');
    return res.redirect("/discussions");
  }

  // Set the new message content and update the last edit date
  let updatedMessage = {
    $set: {
      content: req.body.content,
      editDate: new Date()
    }
  };

  // Insert the new content and edit date into the message of the given request body ID
  ChatMessage.updateOne({_id: req.body.id}, updatedMessage).then(function(): void {
      req.flash("discussionsMessage", '<div class="alert alert-success">Message update successful.</div>');
      res.redirect("/discussions");

      // Inform the user if the message update failed
    }).catch(function(err): void {
      req.flash("discussionsMessage", '<div class="alert alert-danger">Failed to update message. Please try again.</div>');
      res.redirect("/discussions");
    });
});

router.get('/event_planning', AuthGuard, function(req, res, next): void {

  Event.find().sort({ eventDate: -1 }).then(function(data) {
    console.log(data)
    res.render('index', {
      title: `${titlePrefix} Event Planning`,
      page: "event_planning",
      events: data,
      messages: req.flash('eventsMessage'),
      displayName: UserDisplayName(req)
    });
  }).catch(function(err: string){
    console.error("Error reading events from Database - " + err);
    res.end();
  })

});

router.post('/addEvent', AuthGuard,function(req, res, next){

  const datePart = req.body.eventDate; // e.g., "2024-04-26"
  const timePart = req.body.eventTime; // e.g., "13:42"

  // Format to a full ISO string (assuming time is in 24-hour format without seconds)
  const dateTimeISO = `${datePart}T${timePart}:00`;

  let newEvent = new Event (
      {
        "eventName": req.body.eventName,
        "eventLocation": '',
        "eventDate": new Date(dateTimeISO),
        "eventImage": '',
        "eventDescription": req.body.eventDescription,
        "eventLikeCount": 0,
        "coordinatorFullName": req.body.coordinatorFullName,
        "coordinatorEmail": req.body.coordinatorEmail,
        "coordinatorPhone": req.body.coordinatorPhone
      }
  );
  Event.create(newEvent).then(function(){
    res.redirect('/event_planning');
  }).catch(function(err){
    console.error(err);
    res.end();
  });
});

router.get('/eventDelete/:id', AuthGuard, function(req, res, next){

  let id = req.params.id;

  Event.deleteOne({_id: id}).then(function() {
    res.redirect('/event_planning');
  }).catch(function(err){
    console.error(err);
    res.end();
  });
});

router.get('/statistics', AuthGuard, function(req, res, next): void {
  res.render('index', { title: `${titlePrefix} Statistics`, page: "statistics", displayName: UserDisplayName(req) });
});
//endregion

//region Authentication Routes
router.get('/login', function(req, res, next): void {

  // Stay on the login page if the user is not logged in
  if (!req.user) {
    return res.render('index',
        { title: `${titlePrefix} Login`, page: "login", messages: req.flash('loginMessage'),  displayName: UserDisplayName(req) });
  }

  // Redirect to dashboard if the user is logged in
  return res.redirect("/dashboard");
});

router.post('/login', function(req, res, next) {

  // Try to authenticate the user
  passport.authenticate('local', function (err: Error, user: Express.User, info: string) {
    if (err) {
      console.error(err);
      res.end();
    }
    // Inform the user if their credentials are invalid
    if (!user) {
      req.flash('loginMessage', '<div class="alert alert-danger">Invalid credentials. Please try again.</div>');
      return res.redirect('/login');
    }

    // Try to login
    req.login(user, function(err) {
      if (err) {
        console.error(err);
        res.end();
      }

      // Inform the user upon successful login
      req.flash('dashboardMessage', '<div class="alert alert-success">Login successful!</div>');
      res.redirect('/dashboard');
    });
  })(req, res, next);
});

router.get('/logout', function(req, res, next) {

  // Try to logout the user
  req.logout(function (err): void {
    if (err) {
      console.error(err);
      res.end();
    }
    // inform the user upon successful logout
    req.flash('loginMessage', '<div class="alert alert-success">Logout successful!</div>');
    res.redirect('/login');
  });
});

router.get('/register', function(req, res, next) {

  // Stay on register page if user is not logged in
  if(!req.user) {
    return res.render('index',
        { title: 'Register', page: "register", messages: req.flash('registerMessage'), displayName: UserDisplayName(req) });
  }

  // Redirect to dashboard if user is logged in
  return res.redirect("/dashboard");
});

router.post('/register', function(req, res, next) {

  // Create a new user from the request body submission
  let newUser = new User({
    username: req.body.username,
    emailAddress: req.body.emailAddress,
    displayName: req.body.firstName + ' ' + req.body.lastName,
    phone: req.body.phone,
    address: req.body.address,
    birthday: new Date(req.body.birthday)
  });

  // Try to register the user
  User.register(newUser, req.body.password, function(err) {

    // Inform the user upon an error registering
    if (err) {
      let errorMessage = '<div class="alert alert-danger">Sorry, we are unable to process your request at this time.</div>';

      // Inform the user if the register form was submitted with empty fields
      if (err.errors) {
        for (let field in err.errors) {
          if (err.errors[field].kind === 'required') {
            errorMessage = '<div class="alert alert-danger">Please fill out all the fields.</div>';
            break;
          }
        }
      }

      // Inform the user if the email/username they submitted is already taken
      if (err.name == "UserExistsError") {
        errorMessage = '<div class="alert alert-danger">A user with this username or email already exists in the system.</div>';
      }

      // Redirect and flash upon error
      req.flash('registerMessage', errorMessage);
      res.redirect('/register');
    }

    // Log the user in if registration was successful
    return passport.authenticate('local')(req, res, function(){
      req.flash('dashboardMessage', '<div class="alert alert-success">Registration successful! Welcome to the dashboard.</div>');
      return res.redirect('/dashboard');
    });
  });
});
//endregion

export default router;
