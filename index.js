// You need to go to slack to get these
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const PORT = 8088;
const SlackStrategy = require('passport-slack').Strategy,
    passport = require('passport'),
    express = require('express'),
    app = express();

const session = require('express-session');
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(session({ secret: 'cats' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// As with any middleware it is quintessential to call next()
// if the user is authenticated
function isAuthenticatedFn(req, res, next) {
    console.log(`isAuthenticated: `, req.user);
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

// setup the strategy using defaults
passport.use(
    new SlackStrategy(
        {
            clientID: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            skipUserProfile: false,
            scope: ['identity.basic'],
        },
        (accessToken, refreshToken, profile, done) => {
            // optionally persist profile data
            console.log(accessToken, refreshToken, profile);
            done(null, profile);
        }
    )
);

passport.serializeUser(function (user, done) {
    console.log(`serializeUser:`);
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    console.log(`deserializeUser: ${id}`);
    done(null, { id: 'asdfasfs' });
    // User.findById(id, function (err, user) {
    //     done(err, user);
    // });
});

// path to start the OAuth flow
app.get('/auth/slack', passport.authenticate('slack'));

// OAuth callback url
app.get(
    '/auth/slack/callback',
    passport.authenticate('slack', { successRedirect: '/success', failureRedirect: '/login' }),
    (req, res) => {
        console.log(req.query);
        res.redirect('/success');
    }
);

app.get('/success', isAuthenticatedFn, (req, res) => {
    console.log(req.user);
    res.json(req.user);
});

app.get('/showmesecret', isAuthenticatedFn, (req, res) => {
    console.log(req.user);
    res.json(req.user);
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('showmesecret');
});

app.listen(PORT);

console.log(`Your server will be running at http://localhost:${PORT}`);
console.log(`  http://localhost:${PORT}/auth/slack           - start the Slack authentication`);
console.log(`  http://localhost:${PORT}/auth/slack/callback  - where Slack returns to, config this on the Slack side.`);
console.log(`  http://localhost:${PORT}/success              - Where you land after successfully logging in`);
console.log(`  http://localhost:${PORT}/showmesecret         - Only logged in users can see this`);
console.log(`  http://localhost:${PORT}/logout               - Remove the login credentials`);
