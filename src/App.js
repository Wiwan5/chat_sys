import React, { Component } from "react";
import "./css/App.css";
//import component
import NavBar from "./component/NavBar";
import ChatGroupList from "./component/ChatGroupList";
import ChatRoom from "./component/ChatRoom";
import openSocket from "socket.io-client";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "Login",
      username: "",
      currentGroup: "Not in group",
      isJoinGroupList: [],
      groupList: [],
      allChats: {},
    };

    this.socket = openSocket("http://localhost:8000");
    console.log("A socket created [App.js]");
    const me = this;

    this.socket.on("updateAllChats", function (data) {
      // Have setstate
      console.log("Received [updateAllChats] event!");
      console.log(data);
      me.setState({ ...me.state, allChats: data });
      console.log(me.state);
    });
    this.socket.on("updateIsJoined", function (data) {
      // Have setState
      console.log("Received [updateIsJoin] event");
      console.log(data);
      me.setState({
        ...me.state,
        groupList: data.groupList,
        isJoinGroupList: data.isJoinGroupList,
      });
      console.log(me.state);
    });

    this.SocketEmit = this.SocketEmit.bind(this);

    this.updateUsername = this.updateUsername.bind(this);
    this.updateCurrentPage = this.updateCurrentPage.bind(this);
    this.updateCurrentGroup = this.updateCurrentGroup.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
    this.updateIsJoinGroupList = this.updateIsJoinGroupList.bind(this);
  }

  SocketEmit(event, value) {
    this.socket.emit(event, value);
  }
  //--------------------Login-----------------------
  updateUsername(value) {
    this.setState({
      username: value,
    });
  }
  updateCurrentPage(status) {
    this.setState({
      currentPage: status,
    });
  }

  //------------------GroupList---------------------
  updateCurrentGroup(value) {
    this.setState({
      currentGroup: value,
    });
  }

  updateIsJoinGroupList(newList) {
    this.setState({ isJoinGroupList: newList });
  }

  submitMessage(message) {
    var mess = {
      userName: this.state.username,
      groupName: this.state.currentGroup,
      text: message,
      timestamp: Date(),
    };
    console.log("message");
    console.log(mess);
    this.socket.emit("sendMessage", mess);
  }

  render() {
    let page =
      this.state.currentPage == "Chat" ? (
        <div class="row">
          <div class="col-sm-5 border" style={{ backgroundColor: "peachpuff" }}>
            <ChatGroupList
              currentPage={this.state.currentPage}
              currentGroup={this.state.currentGroup}
              username={this.state.username}
              isJoinGroupList={this.state.isJoinGroupList}
              groupList={this.state.groupList}
              updateIsJoinGroupList={this.updateIsJoinGroupList}
              updateCurrentGroup={this.updateCurrentGroup}
              SocketEmit={this.SocketEmit}
              allChats={this.state.allChats}
            />
          </div>
          <div class="col-sm-7 border" style={{ backgroundColor: "khaki" }}>
            <ChatRoom
              currentPage={this.state.currentPage}
              currentGroup={this.state.currentGroup}
              username={this.state.username}
              isJoinGroupList={this.state.isJoinGroupList}
              groupList={this.state.groupList}
              allChats={this.state.allChats}
              submitMessage={this.submitMessage}
            />
          </div>
        </div>
      ) : (
        <div class="app">
          <div class="text">Let's Chat</div>
        </div>
      );
    return (
      <div>
        <div class="row">
          <div class="col-sm-12" align="center">
            <NavBar
              updateUsername={this.updateUsername}
              username={this.state.username}
              updateCurrentGroup={this.updateCurrentGroup}
              currentPage={this.state.currentPage}
              updateCurrentPage={this.updateCurrentPage}
              SocketEmit={this.SocketEmit}
            />
          </div>
        </div>
        {page}
      </div>
    );
  }
}

export default App;
