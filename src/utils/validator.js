const validator = require("validator");

const validate = (data) => {
    const mandatoryField = ["firstName", "emailId", "password"];
    const isAllowed = mandatoryField.every((k) => Object.keys(data).includes(k));

    if (!isAllowed) {
        throw new Error("some field missing");
    }

    data.emailId = data.emailId.toLowerCase();

    if (!validator.isEmail(data.emailId)) {
        throw new Error("Invalid email");
    }

    if (!validator.isStrongPassword(data.password)) {
        throw new Error("week Password");
    }
}

module.exports = validate;