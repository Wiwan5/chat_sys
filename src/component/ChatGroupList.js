import React, { Component } from "react";
import "../css/GroupList.css";
import "../css/App.css";

class ChatGroupList extends Component {
  checkJoinStatus(value,leave,join) {
    return this.props.isJoinGroupList[this.props.groupList.indexOf(value)] ? leave : join;
  }
  isJoin(value){
    return this.props.isJoinGroupList[this.props.groupList.indexOf(value)];
  }
  setName(name){
    this.setState({
        name : name
      });
  }
  
  render() {
    return this.props.currentPage === "Chat" ? (
    
        <div className="groupList-container">
          <div class="form-inline">
            <label for="groupList">Group Name:</label>

            <input
              type="text"
              className="form-control"
              placeholder="Type New Group Name Here"
              id="nameField"
            />
            <button
                className="btn btn-secondary btn-sm"
                type="submit"
                onClick={e => {
                    if(document.getElementById('nameField').value.trim().length > 0){
                      e.preventDefault();
                      this.props.SocketEmit('createGroup',{username:this.props.username , groupname:document.getElementById('nameField').value.trim()})
                      document.getElementById('nameField').value = '';
                    }
                  }}
                  
              >
                Add
              </button>
              
          </div>
                  
        
       
        <ul className="list-group">
          {this.props.groupList.map(function(listvalue) {
            return (
              <div key={listvalue}>
                <li
                  className="list-group-item"
                  id="eachGroupItem"
                  onClick={e => {
                    if(this.isJoin(listvalue)){
                    this.props.updateCurrentGroup(listvalue);
                    }
                  }}
                >
                  {listvalue}{this.checkJoinStatus(listvalue,' (Joined)',' (Not-Join)')}
                </li>
                <button
                  type="submit"
                  className={this.checkJoinStatus(listvalue,'leave','join')}
                  value={this.checkJoinStatus(listvalue,'leave','join') +'_'+ listvalue} 
                  onClick={e => {
                    var tmp = e.target.value.split("_");
                    console.log(tmp);
                    if(tmp[0] === "leave") {
                      this.props.SocketEmit('leaveGroup',{username:this.props.username,groupname:tmp[1]});
                      if(this.props.currentGroup === tmp[1]) this.props.updateCurrentGroup("Not in group");
                      
                    } else if (tmp[0] === "join"){
                      this.props.SocketEmit('joinGroup',{username:this.props.username,groupname:tmp[1]}); 
                      this.props.updateCurrentGroup(tmp[1]);
                    }
                  }}
                >
                {this.checkJoinStatus(listvalue,'leave','join')}
                </button>
              </div>
            );
          }, this)}
        </ul>
      </div>
    ) :(<div class="app"></div>);
  
  }
}

export default ChatGroupList;
