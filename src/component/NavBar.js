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
                  
                }}
              >
                Logout
              </button>
          </div>
        ):(
          <div className="navbar">
            <h4 className ="font_header">
              Stay Home #อยู่บ้าน หยุดเชื่อ เพื่อชาติ
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
              this.props.SocketEmit('enter',enteredName);
            }
            }}
          />
          </div>
    );
  }
}

export default NavBar;