import React, { useEffect, useState } from "react";
import "./Register.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onIdTokenChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { useNavigate } from "react-router-dom";
// import { Firestore } from "firebase/firestore";
import ridematePhone from "../images/ridematePhone.png";
import Navbar from "../Navbar/Navbar";
import { db } from "../firebase";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [user, setUser] = useState(null);
  const [validEmail, setValidEmail] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onIdTokenChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email.endsWith(".edu")) {
      setValidEmail(false);
      return;
    }
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User registered successfully, perform any additional actions here
        const user = userCredential.user;
        console.log("Registered user:", user);
        navigate("/dashboard");


        // Save user details to Firestore
        const userDocRef = db.collection("users").doc(user.uid);
        userDocRef
          .set({
            firstName: firstName,
            lastName: lastName,
            email: email,
          })
          .then(() => {
            console.log("User details saved to Firestore");
          })
          .catch((error) => {
            console.error("Error saving user details to Firestore:", error);
          });

        // Redirect the user to the dashboard or another appropriate route
        navigate("/dashboard");
      })
      .catch((error) => {
        // Handle registration error
        console.error("Error registering user:", error.message);
      });
  };

  return (
    <div className="page">
      <div class="row">
        <div className="container">
          <div>
            <img class="column-left" src={ridematePhone} alt="phone" />
          </div>

          <div class="column-right">
            <div className="form-container">
              <h1 id="title">Register</h1>
              <form className="register-form" onSubmit={handleRegister}>
                <p className="register-info">
                  Please fill this form to create an account.
                </p>
                <div className="label-container">
                  <label for="First Name" className="register-label">
                    <b>First Name</b>
                  </label>
                  <input
                    type="text"
                    className="input-field-name"
                    placeholder="Type your first name"
                    name="first name"
                    required
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                  />

                  <label for="First Name" className="register-label">
                    <b>Last Name</b>
                  </label>
                  <input
                    type="text"
                    className="input-field-name"
                    placeholder="Type your last name"
                    name="last name"
                    required
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                  />
                </div>

                <div className="label-container">
                  <label for="Email" className="register-label">
                    <b>Email</b>
                  </label>
                  <input
                    type="text"
                    className={`input-field-register ${
                      !validEmail ? "invalid-email" : ""
                    }`}
                    placeholder="Type your email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setValidEmail(true);
                    }}
                  />
                  {!validEmail && (
                    <p className="error-message">School email only (.edu)</p>
                  )}
                </div>
                <div className="label-container">
                  <label for="First Name" className="register-label">
                    <b>Password</b>
                  </label>
                  <input
                    type="password"
                    className="input-field-register"
                    placeholder="Type your password"
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="label-container">
                  <label for="First Name" className="register-label">
                    <b>Re-Enter Password</b>
                  </label>
                  <input
                    type="password"
                    className="input-field-register"
                    placeholder="Type your password"
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </form>
              <button className="submit-button" onClick={handleRegister}>
                Create Account
              </button>
              <div className="link-to-register">
                <p className="register-info">
                  If you have an account, click{" "}
                  <a href="/login" className="here">
                    {" "}
                    here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
