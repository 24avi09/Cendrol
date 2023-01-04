const { userModel } = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { isValidName, isValidPhone, isValidEmail, isValidPassword, isValidImage, } = require('../validator/validator')



const createUser = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;
        const files = req.files

        if (!name)
            return res.status(400).send({ status: false, message: "name is required" });
        if (!isValidName(name))
            return res.status(400).send({ status: false, message: "Invalid name" });

        if (!email)
            return res.status(400).send({ status: false, message: "email is required" });
        if (!isValidEmail(email))
            return res.status(400).send({ status: false, message: "Invalid email" });
        const isEmailAlreadyUsed = await userModel.findOne({ email: email });
        if (isEmailAlreadyUsed)
            return res.status(400).send({ status: false, message: "Email is already used" });

        if (!mobile)
            return res.status(400).send({ status: false, message: "mobile is required" });
        if (!isValidPhone(mobile))
            return res.status(400).send({ status: false, message: "Invalid mobile should start from 6,7,8,9 only" });

        if (files.length === 0)
            return res.status(400).send({ status: false, message: "profilePicture must be file and required" });
        if (files[0].fieldname !== "profilePicture")
            return res.status(400).send({ status: false, message: "profilePicture is required" });
        if (files && files.length > 0) {
            if (!isValidImage(files[0].originalname))
                return res.status(400).send({ status: false, message: "profilePicture must be of extention .jpg,.jpeg,.bmp,.gif,.png" });
        }

        if (!password)
            return res.status(400).send({ status: false, message: "password is required" });
        if (!isValidPassword(password))
            return res.status(400).send({
                status: false,
                message: "Password must have 8 to 15 characters with at least one lowercase, uppercase, numeric value and a special character",
            });

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        req.body.password = hash;
        req.body.profilePicture = files[0].buffer;

        const user = new userModel(req.body)

        user.save((err) => {
            if (err) {
                return res.status(400).send({ status: false, error: err.message });
            } else {
                return res.status(201).send({ success: true, message: "User Created Successfully", data: user });
            }
        })

    } catch (err) {
        return res.status(500).send({ status: "error", error: err.message });
    }
}




const loginUser = async (req, res) => {
    try {

        const { email, password, ...rest } = req.body;


        if (Object.keys(req.body).length == 0) {
            return res
                .status(400)
                .send({ status: false, data: "Login Credential required !!!" });
        }

        if (Object.keys(rest).length != 0) {
            return res.status(400).send({
                status: false,
                message: "Data must be email and password only."
            });
        }

        if (!email)
            return res.status(400).send({ status: false, message: "email is required" });
        if (!isValidEmail(email))
            return res.status(400).send({ status: false, message: "Invalid email" });

        if (!password)
            return res.status(400).send({ status: false, message: "password is required" });
        if (!isValidPassword(password))
            return res.status(400).send({
                status: false,
                message: "Password must have 8 to 15 characters with at least one lowercase, uppercase, numeric value and a special character",
            });


        let user = await userModel.findOne({ email: email });
        if (!user)
            return res.status(404).send({ status: false, data: "User Not Found" });
        const payload = {
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            _id: user._id
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).send({ status: false, data: "Invalid Password" });
        } else {
            var token = jwt.sign(payload, "UserSecreteKey", {
                expiresIn: "12hr",
            }); // will expire in 12hr
            const userId = user._id;
            const loginData = { userId, token };
            return res.status(200).send({ status: true, message: "Success", data: loginData, });
        }

    } catch (error) {
        return res.status(500).send({ status: "error", error: err.message });
    }
}



/// ======= fetch user


const getUser = async function (req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.userId))
            return res
                .status(400)
                .send({ status: false, message: "invalid user Id" });

        let user = await userModel.findById(req.params.userId);
        if (!user)
            return res
                .status(404)
                .send({ status: false, message: "user id does not exist" });

        if (req.token._id != req.params.userId)
            return res.status(403).send({ status: false, message: "unauthorized" });

        return res.status(200).send({ status: true, message: "Success", data: user, });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
};


///======== Update User

const updateUser = async function (req, res) {
    try {

        if (!mongoose.isValidObjectId(req.params.userId))
            return res
                .status(400)
                .send({ status: false, message: "invalid user Id" });

        let user = await userModel.findById(req.params.userId);
        if (!user)
            return res
                .status(404)
                .send({ status: false, message: "user id does not exist" });

        const { name, email, mobile, password } = req.body;
        const files = req.files

        if (name) {
            if (!name)
                return res.status(400).send({ status: false, message: "name is required" });
            if (!isValidName(name))
                return res.status(400).send({ status: false, message: "Invalid name" });
        }

        if (email) {
            if (!email)
                return res.status(400).send({ status: false, message: "email is required" });
            if (!isValidEmail(email))
                return res.status(400).send({ status: false, message: "Invalid email" });
            const isEmailAlreadyUsed = await userModel.findOne({ email: email });
            if (isEmailAlreadyUsed)
                return res.status(400).send({ status: false, message: "Email is already used" });
        }

        if (mobile) {
            if (!mobile)
                return res.status(400).send({ status: false, message: "mobile is required" });
            if (!isValidPhone(mobile))
                return res.status(400).send({ status: false, message: "Invalid mobile should start from 6,7,8,9 only" });
        }

        if (files) {
            if (files.length === 0)
                return res.status(400).send({ status: false, message: "profilePicture must be file and required" });
            if (files[0].fieldname !== "profilePicture")
                return res.status(400).send({ status: false, message: "profilePicture is required" });
            if ( files.length > 0) {
                if (!isValidImage(files[0].originalname))
                    return res.status(400).send({ status: false, message: "profilePicture must be of extention .jpg,.jpeg,.bmp,.gif,.png" });
            }
        }

        if (password) {
            if (!password)
                return res.status(400).send({ status: false, message: "password is required" });
            if (!isValidPassword(password))
                return res.status(400).send({
                    status: false,
                    message: "Password must have 8 to 15 characters with at least one lowercase, uppercase, numeric value and a special character",
                });
        }

        if (req.token._id != req.params.userId)
            return res.status(403).send({ status: false, message: "unauthorized" });

        let updatedUser = await userModel.findByIdAndUpdate(req.params.userId, req.body, { new: true })

        return res.status(200).send({ status: true, message: "Success", data: updatedUser, });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
};


///======== Delete User

const deleteUser = async function (req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.userId))
            return res.status(400).send({ status: false, message: "invalid user Id" });

        let user = await userModel.findById(req.params.userId);
        if (!user)
            return res.status(404).send({ status: false, message: "user id does not exist" });

        if (req.token._id != req.params.userId)
            return res.status(403).send({ status: false, message: "unauthorized" });

        await user.remove()

        return res.status(200).send({ status: true, message: "User Deleted Successfully" });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
};


module.exports = { createUser, loginUser, getUser, updateUser, deleteUser }