import React, { Component } from "react";
import "../css/App.css";

class NavBar extends Component {
  render() {
    return this.props.currentPage === "Chat" ?(
          <div className="navbar">
          <h4 className ="font_fill">
          Welcome: K' {this.props.username}
          </h4>         
              <button className="btn btn-danger"
                onClick={e => {
                  this.props.updateUsername("");
                  this.props.updateCurrentPage("Login");
                  this.props.updateCurrentGroup("Not in group");
                }}
              >
                Logout
              </button>
          </div>
        ):(
          <div className="navbar">
            <h4 className ="font_header">
            มะล้องก้องแก้งมะแลงก้องก้อง #อยู่บ้าน หยุดเชื่อ เพื่อชาติ
          </h4> 
          <input
            className="btn btn-success"
            type="button"
            value="Login"
            onClick={(event) => {
              const enteredName = prompt('Please enter your name');
              if(enteredName == null || enteredName === ""){}
              else{
              this.props.updateUsername(enteredName);
              this.props.updateCurrentPage("Chat");
              this.props.SocketEmit('login',enteredName);
            }
            }}
          />
          </div>
    );
  }
}

export default NavBar;