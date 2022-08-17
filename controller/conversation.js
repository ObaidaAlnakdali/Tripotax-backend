const Model = require("../model/conversation");

class Controller {

    get(req, res, next) {
        Model.find((err, response) => {
            if (err) return next(err);
            res.status(200).send({ success: true, response });
        });
    }

    getByUser(req, res, next) {
        Model.find({user: req.params.id}, (err, response) => {
            if (err) return next(err);
            res.status(200).send({ success: true, response });
        });
    }

    getByDriver(req, res, next) {
        Model.find({driver: req.params.id}, (err, response) => {
            if (err) return next(err);
            res.status(200).send({ success: true, response });
        });
    }

    async post(req, res, next) {
        let {driver, user} = req.body
        let body = req.body;
        let response = await Model.find({driver:driver, user:user})
        if(response.length > 0){
            // res.status(200).json({ success: true, response[0] });
            res.status(200).send({ type: 'exist' ,success: true, response });
        } else {
            let doc = new Model(body);            
            // doc.save((err, response) => {
            //     if (err) return next(err);
            //     res.status(200).send({ type: 'not exist', success: true, response });
            // });

            doc.save().then(result => {
                Model
                   .populate(doc, { path: "driver" })
                   .then(response => {
                        res.status(200).send({ type: 'not exist', success: true, response });
             
                   })
             })
        }
    }

}
const controller = new Controller();
module.exports = controller;
