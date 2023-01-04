const express = require('express');
const app = express();
const route = require('./route/route');
const { default: mongoose } = require('mongoose');
const multer = require('multer');

app.use(express.json());
app.use(multer().any())

// Database Connection
mongoose.connect("mongodb+srv://abhi03:UQkqPECmlouMcNjb@cluster1.kwsn7az.mongodb.net/cendrol-technologies-pvt-ltd", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is Connected."))
    .catch(error => console.log(error))


app.use('/', route)


app.use(function (req, res) {
    return res.status(400).send({ status: false, msg: "Path not Found." })
})


app.listen(process.env.PORT || 3000, function () {
    console.log('Express App Running on Port: ' + (process.env.PORT || 3000))
});