import { Avatar } from '@material-ui/core'
import axios from './axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import "./SidebarChat.css"
import Pusher from 'pusher-js'




function SidebarChat({addNewChat}) {

    const [channels,setChannels] = useState([])
    const [seed,setSeed] = useState("")

    const getChannels = () => {
        axios.get('/get/channelList').then((res) => {
        //   console.log(res.data);
          setChannels(res.data)
        })
      }  
      
    
    
    const createChannel = (e) => {
        e.preventDefault()
        const cName = prompt("Please enter channel name:")
        // alert(cName)
        if(cName){
            axios.post('/new/channel', {
                channelName:cName,
            })
        }
    }


    useEffect(() => {
        getChannels()

        const pusher = new Pusher('02bc53d253cec0df66c6', {
            cluster: 'eu'
        });

        const channel = pusher.subscribe('channels');
        channel.bind('newChannel', function(data) {
            getChannels()
        });

        return () =>{
            channel.unbind_all()
            channel.unsubscribe()
        }
        
    }, []);

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    },[])

    return  !addNewChat ? (
        channels.map( channel => (
            <Link to={`/channels/${channel.name}/${channel.id}`}>
                <div className="sidebarChat">
                    <Avatar src={`https://avatars.dicebear.com/api/avataaars/${channel.name}.svg?mouth[]=smile`} />
                    <div className="sidebarChat__info">
                        <h2>{channel.name}</h2>
                        <p>Public Room</p>
                    </div>
                </div>
            </Link>
        ))
    ) : (
        <div onClick={createChannel} className="sidebarChat sidebarChat__info">
            <h1>Add new Chat</h1>
        </div>

    )
}

export default SidebarChat
