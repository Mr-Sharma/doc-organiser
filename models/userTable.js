
var User = require('./user');

module.exports = {
  createUser: createUser,
  authenticateUser:authenticateUser,
  fetchAllUsers:fetchAllUsers,
  fetchUser:fetchUser,
  deleteUser:deleteUser,
  updateUser:updateUser
}

function createUser(data,callback){
  User.findOne({username:data.username},function(err, res) {
    if (err) {
      callback(err,null)
    } else if(res==null) {
      User.create(data,function(err,res){
        if(err){
          console.log("ERROR", err)
          callback(err,null)
        }else{
          callback(null,'user created successfully')
        }
      })
    } else {
      callback(null,'username is taken')
    }
  })
}

function authenticateUser(data,callback){
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

function fetchUser(data,callback){
  User.findOne({username:data.username},function(err, res) {
    if (err) {
      callback(err,null)
    } else if(res==null) {
      callback(null,{userExists:false,res})
    } else {
      callback(null,{userExists:true,res})
    }
  })
}

function deleteUser(data,callback){
  User.findOneAndDelete({_id:data.user_id},function(err, res) {
    if (err) {
      callback(err,null)
    } else {
      callback(null,res)
    }
  })
}

function updateUser(data,callback){
  User.findOneAndUpdate({_id:data.user_id},{username:data.username,password:data.password,email:data.email,contactNumber:data.contactNumber,type:data.type},function(err, res) {
    if (err) {
      callback(err,null)
    } else {
      callback(null,res)
    }
  })
}