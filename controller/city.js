const Model = require("../model/city");

class Controller {

  // get all city
  getAll(req, res, next) {
    Model.find((err, response) => {
      if (err) return next(err);
      res.status(200).send({ success: true, response });
    });
  }

  // callback functions used in city route
  post(req, res, next) {
    let body = req.body;
    let doc = new Model(body);
    doc.save((err, response) => {
      if (err) return next(err);
      res.status(200).send({ success: true, response });
    });
  }

}
const controller = new Controller();
module.exports = controller;
