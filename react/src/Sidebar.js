import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import { Avatar, IconButton } from "@material-ui/core";
import SidebarChat from "./SidebarChat";
import { useStateValue } from "./StateProvider";
import axios from "./axios.js"
import Pusher from 'pusher-js'

function Sidebar() {

  const [{user},dispatch] = useStateValue()  //* ->For User Avatar img
  const [channels,setChannels] = useState([])

  const getChannels = () => {
    axios.get('/get/channelList').then((res) => {
      // console.log(res.data);
      setChannels(res.data)
    })
  }  
  
  useEffect(() => {
    getChannels()

  }, [])
  
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search or Start New Chat" />
        </div>
      </div>

      <div className="sidebar__chats">
        <SidebarChat addNewChat />
        
        <SidebarChat />
      </div>
    </div>
  );
}
export default Sidebar;
