// const express = require('express');
const APP_PORT = 8000;
const io = require('socket.io').listen(APP_PORT);
console.log('listening on port ', APP_PORT);
const mongoose = require('mongoose');
const User = require('./models/user');
const Group = require('./models/group');
const JoinedGroupInfo = require('./models/groupjoinedinfo');
const Message = require('./models/message');

// DB ---------------------------------------------------------------------------
mongoose.connect('mongodb://localhost/test',{ useNewUrlParser: true }); // test =  database name
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => { console.log('DB connected!')});
//db.dropDatabase();

function userEnter(data,socket) { //data = username "Dongglue"}
  console.log(data);
  User.find({name:data},function(err,users){
    if(err) {console.log(err);}
    // TODO [DB] : Create user if not existed
    if(!users.length) { // user == [] อันนี้เขียนๆไปก่อน ไม่รู้ js เช๊คไง
      console.log('>>> Create New User')
      var newUser = new User({name:data});
      newUser.save();
    }
    EmitAllChats(socket);
    EmitGroupInfo(data,socket);
  })
}

function EmitGroupInfo(username,socket){

  var groupListInfo = [] ;
  Group.find({},function(err,data){
    data.forEach(function(element) { 
      groupListInfo.push(element.name);
    })
    var isJoingroupListInfo = [];
    let k = 0;      
    groupListInfo.forEach(function(element){
      JoinedGroupInfo.find({username:username,groupname:element},function(err,data){
        if (data.length == 0) {
          isJoingroupListInfo.push(false);
        } else {
          isJoingroupListInfo.push(true);
        }
        k += 1; 
        if(k==groupListInfo.length){
          socket.emit("updateIsJoined",{groupList:groupListInfo, isJoinGroupList:isJoingroupListInfo});
          console.log({groupList:groupListInfo, isJoinGroupList:isJoingroupListInfo})
          console.log('emit groupList')
        }
      })
    })
  })

}

function EmitAllChats(socket){
  var allChats = {};
  var allChat = [];
  Group.find({},function(err,allGroups) {
    allGroups.forEach(function(data){
      allChat.push(data.name);
    })
    let j = 0;
    allChat.forEach(function(data){
      Message.find({groupName:data}).sort('timestamp').exec(function(err,msg){
        // console.log("msg")
        // console.log(msg)
        allChats[data] = msg.map(function(item,index){
          return {username:item.userName, content:item.text, timeStamp:item.timestamp.getHours()+":"+item.timestamp.getMinutes() }
        });
        j+=1
        if(j==allChat.length){
          console.log(allChats)
          socket.emit('updateAllChats',allChats);
          console.log('emitAllChat')
        }
      })
    })
  })
}

function BroadcastAllChats(socket){
  var allChats = {};
  var allChat = [];
  Group.find({},function(err,allGroups) {
    allGroups.forEach(function(data){
      allChat.push(data.name);
    })
    let j = 0;
    allChat.forEach(function(data){
      Message.find({groupName:data}).sort('timestamp').exec(function(err,msg){
        allChats[data] = msg.map(function(item,index){
          return {username:item.userName, content:item.text, timeStamp:item.timestamp.getHours()+":"+item.timestamp.getMinutes() }
        });
        j+=1
        if(j==allChat.length){
          console.log(allChats)
          io.emit('updateAllChats',allChats);
          console.log('BroadcastAllChat')
        }
      })
    })
  })
}

io.on('connection', function (socket) {
  console.log('a user connected');

  // After click enter button , data = username 
  socket.on('enter', function (data) {
    console.log('>>Received [login] event!>>username');  
    userEnter(data,socket);
  });
  
  socket.on('sendMessage', function(data){ // data = {userName,GroupName,timestamp,text}
    console.log('>>Received [sendMessage] event!');
    console.log(data);
    var newMessage = new Message(data)
    newMessage.save(function(err){
      if (err) {return err;}
      BroadcastAllChats(socket);
    });
  })
  socket.on('joinGroup', function(data){ //data = {username:'dongglue',groupname:'3L'}
      console.log('>>Received [joinGroup] event!');
      console.log(data);
      var joinNewGroup = new JoinedGroupInfo({username:data.username,groupname:data.groupname})
      joinNewGroup.save(function(err){
        if (err) {return err;}
        EmitGroupInfo(data.username,socket);
      });
      
    })
    
  socket.on('leaveGroup', function(data){//data = {username:'dongglue',groupname:'3L'}
      console.log('>>Received [leaveGroup] event!');
      console.log(data);
      JoinedGroupInfo.deleteMany(data,function(err){
        if (err) {return err;}
        EmitGroupInfo(data.username,socket);
      });
      
    })
  
  socket.on('createGroup', function(data){ //data = {username:'dongglue',groupname:'3L'}
      console.log('>>Received [createGroup] event!');
      console.log(data);
      Group.find({name:data.groupname},function(err,groups){
        if(err) {console.log(err);}
        // TODO [DB] : Create user if not existed
        if(!groups.length) { // user == [] อันนี้เขียนๆไปก่อน ไม่รู้ js เช๊คไง
          new Group({name:data.groupname}).save(function(err){
            if (err) {return err;} 
            console.log('New Group')       
            io.emit('notifyNewGroup',"eiei")
          });
          var newGroupJoin = new JoinedGroupInfo({username:data.username,groupname:data.groupname});
          newGroupJoin.save();
        }
      })
     
      
  })
  socket.on('getUpdateIsjoin',function(data){ // data = username
      EmitGroupInfo(data,socket);
  })
  socket.on('disconnect', function () {
    io.emit('a user disconnected');
    console.log('a user diconnected //socket')
  });

});

//-------------------------