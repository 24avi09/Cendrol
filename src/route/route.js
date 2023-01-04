const express = require('express');
const router = express.Router();
const { createUser, loginUser, getUser, updateUser, deleteUser } = require('../controller/userController')
const { authentication } = require('../middleware/auth')


router.post("/createUser", createUser)

router.post("/login", loginUser)

router.get("/user/:userId",authentication, getUser);

router.put("/user/:userId",authentication, updateUser);

router.delete("/user/:userId",authentication, deleteUser);


module.exports = router; 