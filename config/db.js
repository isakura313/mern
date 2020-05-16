const mongoose = require("mongoose");
const config = require("config");

//просто файл конфига, который у нас есть для того, чтобы настроить коннект с
//mongodb это наша база данных
const db = config.get("mongoURI");

const connectDB = async () => { 
    //здесь у  нас асинхронная функция используется
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      // что это значит
      useCreateIndex: true,
    });
    console.log("Произошло соединение с сервером");

  } catch (err) {
    console.log(err.message);
    // наш процесс покидает здание
    process.exit(1);
  }
};
module.exports = connectDB;
//  и у нас происходит импорт
