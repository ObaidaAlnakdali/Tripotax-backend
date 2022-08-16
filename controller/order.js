const Model = require('../model/order');
const ModelUser = require('../model/user');
const Joi = require('@hapi/joi');

class Controller {

    // Update order
    put(req, res, next) {
        let id = req.params._id
        Model.findByIdAndUpdate(id, body, (err, response) => {
            if (err) return next(err);
            res.status(200).send({ success: true, response });
        }); 
    }

    // add status
    async post(req, res, next) {
        let UserId = req.params.id
        let body = req.body;
        let doc = new Model(body);
        let newOrder;
        await doc.save((err, response) => {
            if (err) return next(err);
            newOrder = response;
            console.log('newOrder', newOrder)
            //res.status(200).send({massage:'Add new order is success',  response});
        });
        let user = await ModelUser.findById(UserId);
        user.orders.push(newOrder._id)
        await user.save((err, response) => {
            if (err) return next(err);
            res.status(200).send({massage: 'Success Assign New Order to User', NewOrders: newOrder});
        })
    }

    //delete a user
    delete(req, res, next) {
        Model.findOneAndDelete({ _id: req.params.id }, (err, response) => {
            if (err) return next(err);
            res.status(200).send({ success: true, response });
        })
    }

}

const controller = new Controller();
module.exports = controller;