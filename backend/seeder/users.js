const bcrypt = require("bcryptjs")
const ObjectId = require("mongodb").ObjectId;

const users = [
      {
    name: 'admin',
    lastName: 'admin',
    email: 'admin@admin.com',
    password: bcrypt.hashSync('uzair@gour.com', 10),
    isAdmin: true,
  },
  {
      _id: new ObjectId("625add3d78fb449f9d9fe2ee"),
    name: 'John',
    lastName: 'Doe',
    email: 'john@doe.com',
    password: bcrypt.hashSync('mohd@uzair.com', 10),
  },
]

module.exports = users