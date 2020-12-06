import React, { useState } from "react";
import "./Login.css";
import { Button } from "@material-ui/core";
import auth, { provider } from "./Firebase";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";

function Login() {

    const [state , dispatch] = useStateValue();

  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
          dispatch({
              type: actionTypes.SET_USER,
              user: result.user,
          })
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="login">
      <div className="login__container">
        <img
          src="https://www.silicon.co.uk/wp-content/uploads/2018/03/2000px-WhatsApp.svg_.png"
          alt="whatsapp-logo"
        />
        <div className="login__text">
          <h1>Sign In to Whatsapp</h1>
        </div>

        <Button onClick={signIn}>SignIn with Google</Button>
      </div>
    </div>
  );
}

export default Login;
