import React from "react";
import ReactDOM, { render } from "react-dom";
import firebase from "firebase";
export class Auth extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      age: null,
      ID: null,
      password: "",
      car: "",
      longtext: ""
    };
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    var firebaseConfig = {
      apiKey: "AIzaSyCpsac9VVt5uE0AF2MVk8kSVMAWFcewFfM",
      authDomain: "auth-practice-4b9a7.firebaseapp.com",
      projectId: "auth-practice-4b9a7",
      storageBucket: "auth-practice-4b9a7.appspot.com",
      messagingSenderId: "677785265170",
      appId: "1:677785265170:web:a3a6f44134e47c836fa4cb",
      measurementId: "G-PYBLC4DJX2"
    };
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      firebase.analytics();
    } else {
      firebase.app(); // if already initialized, use that one
    }
  }
  changeHandler = (ev) => {
    var currentstate = this.state;
    let nam = ev.target.name;
    let val = ev.target.value;
    currentstate[nam] = val;
    this.setState(currentstate);
  };
  submitHandler = (evt) => {
    evt.preventDefault();
    //console.log(evt.target.name);
    if (evt.target.name === "login") {
      this.login_user(this.state.name, this.state.password);
    } else if (evt.target.name === "signup") {
      //this.logout_user();
      this.register_user(this.state.name, this.state.password);
    } else {
      this.fblogin_user(this.state.name, this.state.password);
    }
  };
  fblogin_user = (email, pwd) => {
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope("user_birthday");
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // The signed-in user info.
        var user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var accessToken = credential.accessToken;
        console.log(user);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.log(errorMessage);
        // ...
      });
  };
  logout_user = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        console.log("sign out successful");
      })
      .catch((error) => {
        // An error happened.
        console.log("sign out un-successful");
      });
  };
  login_user = (email, pwd) => {
    console.log("attempting to login user " + email);
    // use the Firebase API to sign in the user
    var that = this;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, pwd)
      .then(
        function (user) {
          //clear the form inputs
          var currentstate = that.state;
          currentstate.name = "";
          currentstate.password = "";
          that.setState(currentstate);
          console.log(user);
          //deal with errors
        },
        function (error) {
          // Handle Errors here.
          //var errorCode = error.code;
          var errorMessage = error.message;
          alert("Error: " + errorMessage);
        }
      );
  };

  register_user = (email, pwd) => {
    // ensure password and re_password match
    // register the user with the Firebase API (NOTE: auto logs in)
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, pwd)
      .then(
        function (user) {
          if (user) {
          }
        },
        function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
        }
      );
  };

  render() {
    return (
      <div>
        <div className="container">
          <form>
            <input
              type="text"
              placeholder="Enter Username"
              name="name"
              onChange={this.changeHandler}
              required
            />
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              onChange={this.changeHandler}
              required
            />
            Password
            <button name="login" onClick={this.submitHandler} type="submit">
              Login
            </button>
            <button
              name="signup"
              onClick={this.submitHandler}
              style={{ backgroundColor: "orange" }}
              type="submit"
            >
              Signup
            </button>
            <button
              name="fb-login"
              onClick={this.submitHandler}
              style={{ backgroundColor: "blue" }}
              type="submit"
            >
              Facebook Login
            </button>
          </form>
        </div>

        <div class="container"></div>
      </div>
    );
  }
}

export default Auth;
