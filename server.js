// const express = require('express');
const APP_PORT = 8000;
const io = require("socket.io").listen(APP_PORT);
console.log("listening on port ", APP_PORT);
const mongoose = require("mongoose");
const User = require("./models/user");
const Group = require("./models/group");
const JoinedGroupInfo = require("./models/groupjoinedinfo");
const Message = require("./models/message");
require("dotenv").config();

// DB ---------------------------------------------------------------------------
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true }); // test =  database name
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.on("connected", () => {
  console.log("database connected");
});
//db.dropDatabase();

login = (data, socket) => {
  //data = username }
  console.log(data);
  User.findOne({ name: data }, async function (err, users) {
    if (err) {
      console.log(err);
    }

    if (!users) {
      console.log(">>> Create New User");
      var newUser = await User.create({ name: data });
    }
    resChats(socket);
    resGroup(data, socket);
  });
};

resGroup = (username, socket) => {
  var groups = [];
  var isJoingroup = [];
  let k = 0;
  Group.find({}, function (err, data) {
    data.forEach(function (element) {
      JoinedGroupInfo.findOne(
        { username: username, groupname: element.name },
        function (err, data1) {
          groups.push(element.name);
          if (!data1) {
            isJoingroup.push(false);
          } else {
            isJoingroup.push(true);
          }
          k += 1;
          if (k == data.length) {
            console.log("emit groupList");
            socket.emit("updateIsJoined", {
              groupList: groups,
              isJoinGroupList: isJoingroup,
            });
            console.log({
              groupList: groups,
              isJoinGroupList: isJoingroup,
            });
          }
        }
      );
    });
  });
};

resChats = (socket) => {
  var allChats = {};
  var allChat = [];
  Group.find({}, function (err, allGroups) {
    allGroups.forEach(function (data) {
      allChat.push(data.name);
    });
    let j = 0;
    allChat.forEach(function (data) {
      Message.find({ groupName: data })
        .sort("timestamp")
        .exec(function (err, msg) {
          // console.log("msg")
          // console.log(msg)
          allChats[data] = msg.map(function (item, index) {
            return {
              username: item.userName,
              content: item.text,
              timeStamp:
                item.timestamp.getHours() + ":" + item.timestamp.getMinutes(),
            };
          });
          j += 1;
          if (j == allChat.length) {
            console.log(allChats);
            socket.emit("updateAllChats", allChats);
            console.log("emitAllChat");
          }
        });
    });
  });
};

BroadcastAllChats = (socket) => {
  var allChats = {};
  var allChat = [];
  let j = 0;
  Group.find({}, function (err, allGroups) {
    allGroups.forEach(function (data) {
      allChat.push(data.name);
    });
    allChat.forEach(function (data) {
      Message.find({ groupName: data })
        .sort("timestamp")
        .exec(function (err, msg) {
          allChats[data] = msg.map(function (item, index) {
            return {
              username: item.userName,
              content: item.text,
              timeStamp:
                item.timestamp.getHours() + ":" + item.timestamp.getMinutes(),
            };
          });
          j += 1;
          if (j == allChat.length) {
            console.log(allChats);
            io.emit("updateAllChats", allChats);
            console.log("BroadcastAllChat");
          }
        });
    });
  });
};

io.on("connection", function (socket) {
  console.log("a user connected");

  // After click enter button , data = username
  socket.on("login", function (data) {
    console.log("login :username");
    login(data, socket);
  });

  socket.on("sendMessage", function (data) {
    // data = {userName,GroupName,timestamp,text}
    console.log("sendMessage:");
    console.log(data);
    var newMessage = new Message(data);
    newMessage.save(function (err) {
      if (err) {
        return err;
      }
      broadcastChats(socket);
    });
  });
  socket.on("joinGroup", function (data) {
    //data = {username:'dongglue',groupname:'3L'}
    console.log("joinGroup:");
    console.log(data);
    JoinedGroupInfo.find(
      { groupname: data.groupname, username: data.username },
      function (err, groups) {
        if (err) {
          console.log(err);
        }
        // TODO [DB] : Create user if not existed
        if (!groups.length) {
          // user == [] อันนี้เขียนๆไปก่อน ไม่รู้ js เช๊คไง
          console.log("have group\n");
          var joinNewGroup = new JoinedGroupInfo({
            username: data.username,
            groupname: data.groupname,
          });
          joinNewGroup.save(function (err) {
            if (err) {
              return err;
            }
            resGroup(data.username, socket);
          });
        }
      }
    );
  });

  socket.on("leaveGroup", function (data) {
    //data = {username:'dongglue',groupname:'3L'}
    console.log("leaveGroup:");
    console.log(data);
    JoinedGroupInfo.deleteMany(data, function (err) {
      if (err) {
        return err;
      }
      resGroup(data.username, socket);
    });
  });

  socket.on("createGroup", function (data) {
    //data = {username:'dongglue',groupname:'3L'}
    console.log("createGroup:");
    console.log(data);
    Group.find({ name: data.groupname }, function (err, groups) {
      if (err) {
        console.log(err);
      }
      // TODO [DB] : Create user if not existed
      if (!groups.length) {
        new Group({ name: data.groupname }).save(function (err) {
          if (err) {
            return err;
          }
          console.log("New Group");
          resGroup(data.username, socket);
        });
        var newGroupJoin = new JoinedGroupInfo({
          username: data.username,
          groupname: data.groupname,
        });
        newGroupJoin.save();
      }
    });
  });
  socket.on("disconnect", function () {
    io.emit("a user disconnected");
    console.log("a user diconnected //socket");
  });
});

//-------------------------
