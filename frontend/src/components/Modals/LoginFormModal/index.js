import React, { useState } from "react";
import * as sessionActions from "../../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { useHistory } from 'react-router-dom';
import { useEffect } from "react";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
//   console.log("Initial credential:", credential);
// console.log("Initial password:", password);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const history = useHistory()

  const handleSubmit = (e) => {
    if(e) {
      e.preventDefault();
    }
    setErrors({});
    // console.log("Logging in with credentials: ======>", credential, password);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        // console.log('This is the data we want to see', data)
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  let disable = true;
  if(credential.length > 3 && password.length > 5) {
    disable = false
  }

  const handleDemoLogin = async () => {
    setCredential('FakeUser1');
    setPassword("password2");
    console.log("Attempting demo login");
    await handleSubmit()
  }

  useEffect(() => {
    if(credential === "FakeUser1" && password === "password2") {
      handleSubmit()
    }
  }, [credential, password])

  return (
    <>
    <div className="loginButton">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label className="user-input">
          {/* Username or Email */}
          <input
            type="text"
            value={credential}
            placeholder="Username or Email"
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label className="password-input">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p className="errors">{errors.credential}</p>}
        <button className="login-btn" type="submit" onClick={() => history.push('/')} disabled={disable}>Log In</button>
      </form>
        <button className="demo-user" onClick={handleDemoLogin}>Demo User</button>
        </div>
    </>
  );
}

export default LoginFormModal;