const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(process.env.MONGO_URI);

app.get("/", (req,res)=>{
  res.send("DevOps Challenge Running");
});

app.get("/health",(req,res)=>{
  res.send("healthy");
});

app.listen(3000,()=>{
  console.log("started");
});
