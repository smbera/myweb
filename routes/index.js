module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/signup');
  });
  app.use('/signup', require('./signup'));
  app.use('/signin', require('./signin'));
  app.use('/signout', require('./signout'));
  app.use('/main', require('./main'));
  app.use('/people', require('./people'));
  app.use('/explore', require('./explore'));
  app.use('/topic', require('./topic'));

};