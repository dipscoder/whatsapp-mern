import React, { useEffect, useState } from "react";
import "./App.css"
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import Pusher from "pusher-js"
import axios from "./axios"
import Login from "./Login";
import { useStateValue } from "./StateProvider";
import {BrowserRouter as Router,Switch,Route} from "react-router-dom"
import {useParams} from "react-router-dom"
function App() {

  // // * It will push all the messages which are present in the database -> imp Explaination of below code at 3:29
  // const [messages,setMessages] = useState([])
  // useEffect(() => {
  //   axios.get('/messages/sync').then((response) => {
  //     setMessages(response.data)
  //   })
    
  // }, [])

  // // * It will connect pusher with the frontend and passes the message to frontend whenever a new message is posted
  // useEffect(() => {
  //   // run once
  //   const pusher = new Pusher('02bc53d253cec0df66c6', {
  //     cluster: 'eu'
  //   });

  //   const channel = pusher.subscribe('messages');
  //   channel.bind('inserted', (newMessage) => {
  //     // alert(JSON.stringify(newMessage));

  //     // * whenever a new message get pushed, it will append that message with the previous messages([[...previousMessages,newMessage]])
  //     setMessages([...messages,newMessage])   // imp Explaination at 3:32
  //   });

  //   // imp Very IMPORTANT - Explanation at 3:35
  //   return () =>{
  //     channel.unbind_all()
  //     channel.unsubscribe()
  //   }
      
  // },[messages])       //imp Because we are depending on the "messages" in the useEffect, we need add this dependency here

  // console.log(messages);

  // const {channelId} = useParams();

  const [{user}, dispatch] = useStateValue() 
  return (
    <div className="app">
      {!user ? (
        <Login />
      ): (
        <div className="app__body">

          <Router>
            <Sidebar />
            <Switch>

              <Route path="/channels/:channelName/:channelId">
                <Chat />
              </Route>
              
              <Route path="/">
                {/* <Chat /> */}
              </Route>
              
              {/* <Chat messages={messages} /> */}
            </Switch>
            
          </Router>

          
        </div>
      )}
      
    </div>
  );
}

export default App;
