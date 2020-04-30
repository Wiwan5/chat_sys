import React, { Component } from "react";
import "../css/App.css";
import "../css/ChatRoom.css";

class ChatRoom extends Component {
  checkJoinStatus(value) {
    var groupList = this.props.groupList;
    var isJoin = this.props.isJoinGroupList;
    return isJoin[groupList.indexOf(value)] ? true : false;
  }

  render() {
    return this.props.currentPage === "Chat" ? (
      <div class="p-4 mb-2 text-white">
        <div
          class="row "
          style={{ backgroundColor: "royalblue", paddingLeft: "325px" }}
        >
          <h5>{this.props.currentGroup}</h5>
        </div>
        
        <div className="chat-container" id="scrollc">
          <div className="chatbox-container">
            <ul className="chats" id="chatInput">
              {this.props.allChats[this.props.currentGroup] &&
              this.checkJoinStatus(this.props.currentGroup)
                ? this.props.allChats[this.props.currentGroup].map((chat) => (
                    <div>
                      <p className="chat">
                        {chat.username}: {chat.content}
                      </p>
                      <p className="time">{chat.timeStamp}</p>
                    </div>
                  ))
                : null}
            </ul>
            <form
              className="input"
              onSubmit={(e) => {
                if (document.getElementById("msg").value.trim().length > 0) {
                  e.preventDefault();
                  if (this.checkJoinStatus(this.props.currentGroup)) {
                    this.props.submitMessage(
                      document.getElementById("msg").value
                    );
                    document.getElementById("msg").value = "";
                  }
                }
              }}
            >
              <input type="text" id="msg" />
              <button
                type="submit"
                className="btn btn-success"
                id="submitButton"
              >
                submit
              </button>
            </form>
          </div>
        </div>
      </div>
    ) : null;
  }
}
export default ChatRoom;
