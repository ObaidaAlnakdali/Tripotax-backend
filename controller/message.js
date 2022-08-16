const Model = require("../model/message");

class Controller {

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
