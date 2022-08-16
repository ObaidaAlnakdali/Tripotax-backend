const Model = require('../model/driver');
const ModelUser = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');

const schemaSignup = Joi.object({
    firstName: Joi.string().required(),
    middleName: Joi.string().required(),
    lastName: Joi.string().required(),
    //birthdate: Joi.date().required(),
    email: Joi.string().email({ tlds: { allow: true } }).required(),
    password: Joi.string().min(8).required(),
});

const schemaSignin = Joi.object({
    email: Joi.string().email({ tlds: { allow: true } }),
    password: Joi.string().min(8).required(),
});

class Controller {

    // get all driver
    getAll(req, res, next) {
        Model.find((err, response) => {
            if (err) return next(err);
            res.status(200).send({ success: true, response });
        });
    }

    // get available driver
    getAvailableDriver(req, res, next) {
        Model.find({ status: 'avilable' }, (err, response) => {
            if (err) return next(err);
            res.status(200).send({ success: true, response });
        })
    }

    // get one driver
    getbyID(req, res, next) {
        Model.findById(req.params.id ,(err, response) => {
            if (err) return next(err);
            res.status(200).send({ success: true, response });
        })
    }

    // Update
    // async put(req, res, next) {
    //     let { id } = req.params;
    //     const {firstName, middleName, lastName, email, password, personalImage}= req.body;
    //     const oldUser = await Model.findById(id);
    //     if(firstName) oldUser.firstName= firstName ;
    //     if(middleName) oldUser.middleName= middleName ;
    //     if(lastName) oldUser.lastName= lastName ;
    //     if(email) oldUser.email= email.toLowerCase() ;
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

    // Add Raiting
    async addRaiting(req, res, next) {
        let driverId = req.params.id;
        let userId = req.body.userId;
        let rate = req.body.rate;
        let oldDriver = await Model.findById(driverId);
        oldDriver.rate.push({userId: userId, Rate: rate})
        oldDriver.save((err, response) => {
            if (err) return next(err);
            res.status(200).send({ success: true, response });
        })
    }

    // Update passeord
    async UpdatePassword(req, res, next) {
        let { oldPassword, newPassword } = req.body;
        const driver = await Model.findById(req.params.id)
        const validPassword = await bcrypt.compare(oldPassword, driver.password)
        if (!validPassword) return res.status(400).send({ status: 400, message: 'the old password is wrong' })
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        driver.password = hashedPassword
        driver.save((err, response) => {
            if (err) return next(err);
            res.status(200).send({ success: true, response });
        })
    }

    //delete a driver
    delete(req, res, next) {
        Model.findOneAndDelete({ _id: req.params.id }, (err, response) => {
            if (err) return next(err);
            res.status(200).send({ success: true, response });
        })
    }

    // Signup driver
    async signup(req, res) {
        //validate data entry to new user
        const { error } = schemaSignup.validate(req.body)
        if (error) return res.status(400).send(error.details[0].message);
        //validate if the driver is exist or not
        const emailExist = await Model.findOne({ email: req.body.email })
        if (emailExist) return res.status(400).send("the email is exists");
        //validate if the user is exist or not
        const emailUserExist = await ModelUser.findOne({ email: req.body.email })
        if (emailUserExist) return res.status(400).send("the email is exists");
        //Hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        //create a new driver
        const Driver = new Model({
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            email: req.body.email.toLowerCase(),
            password: hashedPassword,
            // status: req.body.status,
            // personalImage: req.body.personalImage,
            // city: req.body.city,
            // rate: req.body.rate,
            // phoneNumber: req.body.phoneNumber,
        })
        //add to driver to database
        try {
            await Driver.save().then(driver => {
                jwt.sign(
                    { id: driver._id },
                    process.env.TOKEN_SECRET,
                    { expiresIn: 3600 },
                    (err, token) => {
                        if (err) throw err;
                        res.json({
                            token,
                            type: 'driver',
                            driver: {
                                id: driver._id,
                                email: driver.email,
                                fullname: driver.fullname
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

    // Signin driver
    async signin(req, res) {
        const driver = await Model.findOne({ email: req.body.email.toLowerCase() })
        //validate data entry to new driver
        const { error } = schemaSignin.validate(req.body)
        if (error) return res.status(400).send({status:400, message: error.details[0].message})
        //Check if email is exsist
        if (!driver) return res.status(400).send({status:400, message: 'the email or password is wrong' });
        //Check if password is correct
        const validPassword = await bcrypt.compare(req.body.password, driver.password)
        if (!validPassword) return res.status(400).send({status:400, message: 'the email or password is wrong' })
        // if all information is true
        // Create a token and assign it to the driver
        const token = jwt.sign({ _id: driver._id }, process.env.TOKEN_SECRET)
        res.header('auth-token', token).status(200).send({type: 'driver', id: driver._id, message: 'success', token: token })
    }
}

const controller = new Controller();
module.exports = controller;