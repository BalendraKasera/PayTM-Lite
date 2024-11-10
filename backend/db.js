const mongoose = require("mongoose");

//connect to mongoDB
mongoose.connect(
  "mongodb+srv://balendra77:balendramongodb@cluster0.yv6gc.mongodb.net/"
);

// Create Mongoose schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 30,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  lastName: {
    type: String, // Corrected the type to String
    required: true,
    trim: true,
    maxlength: 50,
  },
});
//create bank  schema
const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, //reference of user model
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

//create mongoose model
const Account = mongoose.model("Account", accountSchema);
const User = mongoose.model("User", UserSchema);

//export
module.exports = {
  User,
  Account,
};