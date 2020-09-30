const movieRoutes = require('./movie');

const route = app => {
  app.use('/', movieRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({
      error: "Page Not found"
    });
  });
};

module.exports = route;