const express = require('express');
const authRouter = require('./routes/auth');
const mongoose = require('mongoose')
const app = express();
const DB = "mongodb+srv://shivang2308:14538049@cluster0.bq0b0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

app.use(express.json());
app.use(authRouter);

const PORT = 3000;

mongoose.connect(DB).then(() => {
    console.log("Connection successfull")
}).catch((e) => {
    console.log(e);
})

app.listen(PORT, () => {
    console.log(`connected at port ${PORT}`);
});