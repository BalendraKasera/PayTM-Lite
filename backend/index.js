const express = require("express");
const cors = require("cors");

const jwt=require('jsonwebtoken');

//import all router from routes
const rootRouter = require("./Routes/index.js");
app.use(express.json())
app.use(cors());
const app = express();

app.use("/api/v1", rootRouter);
app.listen(3000);

