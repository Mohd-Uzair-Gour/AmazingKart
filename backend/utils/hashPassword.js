const bcrypt = require("bcryptjs"); // for hashing password
const salt = bcrypt.genSaltSync(10);

const hashPassword = (password) => bcrypt.hashSync(password, salt);
const comparePasswords = (inputPassword,hashedPassword) => bcrypt.compareSync(inputPassword, hashedPassword)


module.exports = { hashPassword ,comparePasswords } ;