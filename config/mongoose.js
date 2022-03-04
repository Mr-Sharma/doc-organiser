//Mongoose Config
const mongoose = require('mongoose')

mongoose.connect('mongodb://'+'localhost'+':'+'27017'+'/'+'new-test',{ 
  maxPoolSize: 50, 
  socketTimeoutMS: 0,
  keepAlive: true,
  useNewUrlParser: true ,
}, function(err){
  if(err) console.log(err);
  mongoose.Promise = global.Promise;
  console.log('DB Connection Established');
})

module.exports = mongoose.connection;