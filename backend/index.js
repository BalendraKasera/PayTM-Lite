const express = require("express");
const cors = require("cors");

//import all router from routes
const rootRouter = require("./Routes/index.js");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", rootRouter);
app.listen(3000);
