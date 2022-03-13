
var User = require('./user');

module.exports = {
  createUser: createUser,
  authenticateUser:authenticateUser,
  fetchAllUsers:fetchAllUsers,
  fetchAllUsersByType:fetchAllUsersByType,
  fetchUser:fetchUser,
  deleteUser:deleteUser,
  updateUser:updateUser,
  checkUserPhoneExists:checkUserPhoneExists,
}

function createUser(data,callback){
  User.findOne({phoneNumber: data.phoneNumber},function(err, res) {
    if (err) {
      callback(err,null)
    } else if(res==null) {
      User.create(data,function(err,res){
        if(err){
          console.log("ERROR",err)
          callback(err,null)
        }else{
          callback(null,'user created successfully')
        }
      })
    } else {
      callback('phoneNumber is taken', null)
    }
  })
}

function authenticateUser(data, callback){
  const username = data.username;
  const password = data.password;
  User.findOne({username}, function(err, res) {
    if (err) {
      callback(err,null)
    } else if (res){
      if(password==res.password){
        callback(null,{"success":true,res})
      } else {
        callback(null,{"success":false,"msg":"Incorrect password"})
      }
    } else {
      callback(null,{"success":false,"msg":"Incorrect username"})
    }
  })
}

function fetchAllUsers(callback){
  User.find(function(err, res) {
    if (err) {
      callback(err,null)
    } else {
      callback(null,res)
    }
  })
}

function fetchAllUsersByType(type, callback){
  User.find({type}, function(err, res) {
    if (err) {
      callback(err,null)
    } else {
      callback(null,res)
    }
  })
}

function fetchUser(data, callback){
  User.findOne({username:data.username}, function(err, res) {
    if (err) {
      callback(err,null)
    } else if(res==null) {
      callback(null, {userExists:false,res})
    } else {
      callback(null, {userExists:true,res})
    }
  })
}

function deleteUser(_id, callback){
  User.findOneAndDelete({_id:_id}, function(err, res) {
    if (err) {
      callback(err,null)
    } else {
      callback(null,res)
    }
  })
}

function updateUser(_id, data, callback){
  User.findOneAndUpdate({_id:_id}, {$set:data}, {new: true}, function(err, res) {
    if (err) {
      callback(err,null)
    } else {
      callback(null,res)
    }
  })
}

//newly added
function checkUserPhoneExists(phoneNumber){
  return new Promise(function(resolve, reject){
    User.findOne({phoneNumber:phoneNumber}, function(err, result){
      if(err){
        reject(err)
      }else {
        if(result == null){
          var obj = {};
          obj.success = false;
          obj.userExists = false;
          obj.message = "Phone Number not found";
          resolve(obj)
        }else {
          var obj = {};
          obj.success = true;
          obj.userExists = true;
          obj.message = "Phone number is taken";
          obj.userDetails = result
          resolve(obj)
        }
      }
    })
  })
}
