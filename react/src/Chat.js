import React, { useEffect, useState } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import { SearchOutlined, AttachFile, MoreVert, Send } from "@material-ui/icons";
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import axios from './axios'
import { useStateValue } from "./StateProvider";
import { useParams } from "react-router-dom";
import Pusher from "pusher-js"
import CryptoJS from 'crypto-js'

function Chat() {       //* destructuring props

  const [input, setInput] = useState("")
  const [{user} , dispatch] = useStateValue()
  const {channelId,channelName} = useParams();
  const [messages,setMessages] = useState([])
  const secret_code=process.env.REACT_APP_SECRET_CHAT_KEY
  // const bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');

  const getConversation = (channelId) => {
    if (channelId) {
      axios.get(`/get/conversation?id=${channelId}`).then((res) => {
        setMessages(res.data[0].conversation)
      })
    }
  }

  useEffect( () => {
    getConversation(channelId)

    const pusher = new Pusher('02bc53d253cec0df66c6', {
      cluster: 'eu'
    });

    const channel = pusher.subscribe('conversation');
      channel.bind('newMessage', function(data) {
        getConversation(channelId)
      });

      return () =>{
            channel.unbind_all()
            channel.unsubscribe()
      }
        
  }, [channelId])

  // const sendMessage = async (e) => {
  //   e.preventDefault()

  //   await axios.post('/messages/new' , {
  //     message: input,
  //     name: user.displayName ,
  //     timestamp: "demo time",
  //     received: false                    
  //   })

  //   setInput("")
  // }
  const sendMessage = (e) => {
    e.preventDefault()
    // Encrypting Messages
    let ciphertext = CryptoJS.AES.encrypt(input, secret_code).toString();
    axios.post(`/new/message?id=${channelId}` , {
      message: ciphertext,
      timestamp: Date.now(),
      user:{
        displayName : user.displayName,
        email: user.email,
        photo: user.photoURL,
        uid:user.uid,
      }                  
    })

    setInput("")
  }

// console.log(messages);


  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/avataaars/${channelName}.svg?mouth[]=smile`}/>

        <div className="chat_headerInfo">
          <h3>{channelName}</h3>
          {messages.map((message) => {
            <p>{message}</p>
          })}
          
        </div>

        <div className="chat_headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">

      {/* Explaination starts from 3:39 */}
      {/* {messages.map((message) => {
          console.log(message)
      })} */}
      {messages.map((message) => (
        <p className={`chat__message ${message.user.displayName === user.displayName && "chat__receiver"} `}>
          <span className="chat__name">{message.user.displayName}</span>
          {/* Decrypting Messages */}
          {CryptoJS.AES.decrypt(message.message, secret_code).toString(CryptoJS.enc.Utf8)}
          <span className="chat__timestamp">{new Date(parseInt(message.timestamp)).toDateString()}</span>
        </p>
      ))}

        {/* <p className="chat__message chat__receiver">
          <span className="chat__name">Dipesh</span>
          This is a message
          <span className="chat__timestamp">{new Date().toUTCString()}</span>
        </p>

        <p className="chat__message ">
          <span className="chat__name">Dipesh</span>
          This is a message
          <span className="chat__timestamp">{new Date().toUTCString()}</span>
        </p> */}
        
        
      </div>

      <div className="chat__footer">
        <IconButton>
          <InsertEmoticonIcon />
        </IconButton>
        <form action="" required>
          <input value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Type a message" required/>

          <button className="button" onClick={sendMessage} type="submit" ></button>
         
        </form>
        <IconButton><Send className="send" onClick={sendMessage} /></IconButton>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
