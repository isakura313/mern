const mongoose = require("mongoose")
const config = require("config")


const db =  config.get('mongoURI')

const connectDB = async () =>{
    try{
    await mongoose.connect(db,{
        useNewUrlParser: true,
        useCreateIndex: true
    })
        console.log("Произошло соединение с сервером")
    } catch(err){
        console.log(err.message)
        // наш процесс покидает здание
        process.exit(1)
    }
}
module.exports = connectDB;