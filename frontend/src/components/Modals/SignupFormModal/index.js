import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import * as sessionActions from "../../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const disable = !email || 
  !username || 
  !firstName || 
  !lastName || 
  !password || 
  !confirmPassword ||
  username.length < 4 ||
  password.length < 6 ||
  password !== confirmPassword

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
            console.log("Errors==========>", data.errors)
          }
        });
    }
    console.log("errors========>", errors)
    console.log("Disable button=====>", disable)
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <>
    <div className="sign-up-wrapper">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
      <div className="form-field">
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        </div>

        {errors.firstName && <p className="error-message">{errors.firstName}</p>}
        <div className="form-field">

        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        </div>
        {errors.lastName && <p className="error-message">{errors.lastName}</p>}
        <div className="form-field">

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        </div>

        {errors.email && <p className="error-message">{errors.email}</p>}
        <div className="form-field">

        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        </div>

        {errors.username && <p className="error-message">{errors.username}</p>}
        <div className="form-field">

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        </div>

        {errors.password && <p className="error-message">{errors.password}</p>}
        <div className="form-field">

        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        </div>

        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button className="sign-up-button" type="submit">Sign Up</button>
      </form>
      </div>
    </>
  );
}

export default SignupFormModal;
