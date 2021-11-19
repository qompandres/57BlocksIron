const serverless = require('serverless-http');
const express = require('express');
const passport = require('passport');
const pool = require('./database');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const expressMySQLSession = require('express-mysql-session');

const { isLoggedIn, isNotLoggedIn } = require('./lib/auth');

const { database } = require('./keys');
// initializations
const MySQLStore = expressMySQLSession(session);

const app = express();
require('./lib/passport');

// settings
//app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(session({
    secret: 'gallo57Blocksnodesession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
//console.log(session);
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    //console.log(req.user);
    next();
});
// Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));
// Public
app.use(express.static(path.join(__dirname, 'public')));
console.log(__dirname);
// Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});

app.get('/prueba1', function (req, res) {
    res.send('Hello Word')
  
  })

module.exports.handler = serverless(app);