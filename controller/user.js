const Model = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');
const moment =  require('moment');

const schemaSignup = Joi.object({
    firstName: Joi.string().required(),
    middleName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: true } }).required(),
    password: Joi.string().min(8).required(),
});

const schemaSignin = Joi.object({
    email: Joi.string().email({ tlds: { allow: true } }),
    password: Joi.string().min(8).required(),
});

class Controller {

     // get all user
     getAll(req, res, next) {
        Model.find((err, response) => {
            if (err) return next(err);
            res.status(200).send({ success: true, response });
        });
    }

    // get one user
    getbyID(req, res, next) {
        Model.findById(req.params.id ,(err, response) => {
            if (err) return next(err);
            res.status(200).send({ success: true, response });
        })
    }

    // get Order Active By User
    async getOrderActiveByUser(req, res, next) {
        let today = moment().add('days').format('YYYY-MM-DD');
        let ActiveOrder = [];
        Model.findById(req.params.id, (err, response) => {
            if (err) return next(err);
            ActiveOrder = response.orders
        })
        let orders = [];
        await ActiveOrder.map(item => {
            item.date >= new Date(today) ? orders.push(item) && console.log(item) : null 
        })
        console.log(orders)
        res.status(200).send({ success: true, orders });
    }

    // Update
    // async put(req, res, next) {
    //     let { id } = req.params;
    //     const {firstName, middleName, lastName, email, password, personalImage}= req.body;
    //     const oldUser = await Model.findById(id);
    //     if(firstName) oldUser.firstName= firstName;
    //     if(middleName) oldUser.middleName= middleName;
    //     if(lastName) oldUser.lastName= lastName;
    //     if(email) oldUser.email= email.toLowerCase();
    //     if(password) oldUser.password= await bcrypt.hash(req.body.password, 10);
    //     if(personalImage) oldUser.personalImage= personalImage;
    //     await oldUser.save((err, response) => {
    //         if (err) return next(err);
    //         res.status(200).send({ success: true, response });
    //     })
    // }

    // Update info without passeord
    put(req, res, next) {
        let body = req.body;
        let id = req.params.id;
        Model.findByIdAndUpdate(id, body, (err, response) => {
            if (err) return next(err);
            res.status(200).send({ success: true, response });
        });
    }

    // Update passeord
    async UpdatePassword(req, res, next) {
        let { oldPassword, newPassword } = req.body;
        const user = await Model.findById(req.params.id)
        const validPassword = await bcrypt.compare(oldPassword, user.password)
        if (!validPassword) return res.status(400).send({ status: 400, message: 'the old password is wrong' })
        user.password = newPassword
        user.save((err, response) => {
            if (err) return next(err);
            res.status(200).send({ success: true, response });
        })
    }

    //delete a user
    delete(req, res, next) {
        Model.findOneAndDelete({ _id: req.params.id }, (err, response) => {
            if (err) return next(err);
            res.status(200).send({ success: true, response });
        })
    }

    // Signup User
    async signup(req, res) {
        //validate data entry to new user
        const { error } = schemaSignup.validate(req.body)
        if (error) return res.status(400).send(error.details[0].message);
        //validate if the user is exist or not
        const emailExist = await Model.findOne({ email: req.body.email })
        if (emailExist) return res.status(400).send("the email is exists");
        //Hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        //create a new user
        const User = new Model({
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            email: req.body.email.toLowerCase(),
            password: hashedPassword,
        })
       //add to user to database
       try {
        await User.save().then(user => {
            jwt.sign(
                { id: user._id },
                process.env.TOKEN_SECRET,
                { expiresIn: 3600 },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token,
                        type: 'user',
                        user: {
                            id: user._id,
                            email: user.email,
                            fullname: user.fullname
                        }
                    });
                }
            )
        });
    }
    catch (error) {
        res.status(404).send({ message: error.message })
    }
    }

    // Signin User
    async signin(req, res) {
        const user = await Model.findOne({ email: req.body.email.toLowerCase() })
        //validate data entry to new user
        const { error } = schemaSignin.validate(req.body)
        if (error) return res.status(400).send({status:400, message: error.details[0].message})
        //Check if email is exsist
        if (!user) return res.status(400).send({status:400, message: 'the email or password is wrong' });
        // Check if password is correct
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) return res.status(400).send({status:400, message: 'the email or password is wrong' })
        // if all information is true
        // Create a token and assign it to the user
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
        res.header('auth-token', token).status(200).send({type: 'user', id: user._id, message: 'success', token: token })
    }
}

const controller = new Controller();
module.exports = controller;