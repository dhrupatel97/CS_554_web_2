const showRoutes = require('./shows');

const route = app => {
  app.use('/', showRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({
      error: "Page Not found"
    });
  });
};

module.exports = route;