const isValidName = function (body) {
    const nameRegex = /^[a-zA-Z_ ]*$/;
    return nameRegex.test(body);
};


const isValidPhone = function (body) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(body);
};

const isValidEmail = function (body) {
    const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    return emailRegex.test(body);
};

const isValidPassword = function (body) {
    const passwordRegex =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;
    return passwordRegex.test(body);
};

const isValidImage = function (image) {
    return /(\.jpg|\.jpeg|\.bmp|\.gif|\.png)$/.test(image)
}


module.exports = { isValidName, isValidPhone, isValidEmail, isValidPassword, isValidImage, };