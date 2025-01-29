//imoort mongoose library to lets you connect to mongodb compass
const mongoose = require("mongoose");
const bcrypt=require('bcrypt');

//connect to mongoDB
mongoose.connect(
  "mongodb+srv://balendra77:balendramongodb@cluster0.yv6gc.mongodb.net/"
);

// Create Mongoose schema
const userSchema = new mongoose.Schema({
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

//create account schema
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

//hash password before save into the database
userSchema.pre("save" , async function(next){
  if(!this.isModified("password")){
    return next();
  }
    this.password=await bcrypt.hash(this.password, 10);
    next();
  
})


//create mongoose model
const Account = mongoose.model("Account", accountSchema);
const User = mongoose.model("User", userSchema);

//export
module.exports = {
  User,
  Account
};
