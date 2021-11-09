import React from "react";
import ReactDOM, { render } from "react-dom";
import firebase from "firebase";
import styles from "./styles-app.css";

/* eslint no-undef: "off" */

export class App extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      age: null,
      ID: null,
      password: "",
      car: "",
      error_on_login: false,
      error_on_login_msg: "",
      user: {}
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

  submitSend = (evt) => {
    evt.preventDefault();

    if (evt.target.name === "Login") {
      //console.log(this.state.username, this.state.password);
      this.login_user(this.state.username, this.state.password);
    } else if (evt.target.name === "signup") {
      //console.log(this.state.username, this.state.password);
      this.register_user(this.state.username, this.state.password);
    } else if (evt.target.name === "fb-signup") {
      //console.log(this.state.username, this.state.password);
      this.fblogin_user();
    } else if (evt.target.name === "guest-signin") {
      //console.log(this.state.username, this.state.password);
      this.login_user("guest@hotmail.com", "guest@hotmail.com");
    }
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
      this.fblogin_user();
    }
  };
  fblogin_user = () => {
    var provider = new firebase.auth.FacebookAuthProvider();
    var that = this;
    provider.addScope("user_gender");
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
        that.saveUserDataOnRegister(result, "fb");
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
    var obj = that.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, pwd)
      .then(
        function (u) {
          //clear the form inputs
          var currentstate = that.state;
          currentstate.user = u;
          that.setState(currentstate);
          //console.log(that.state);
          that.gotoComp("Profile");
          //deal with errors
        },
        function (e) {
          // Handle Errors here.
          //var errorCode = error.code;
          obj.error_on_login_msg = e.message;
          obj.error_on_login = true;
          that.setState(obj);
          console.log(e);
          //alert("Error: " + errorMessage);
        }
      );
  };

  register_user = (email, pwd) => {
    // ensure password and re_password match
    // register the user with the Firebase API (NOTE: auto logs in)
    var that = this;
    var obj = that.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, pwd)
      .then(
        function (user) {
          if (user) {
            that.saveUserDataOnRegister(user, "");
          }
        },
        function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          obj.error_on_login_msg = error.message;
          obj.error_on_login = true;
          that.setState(obj);
          console.log(errorMessage);
        }
      );
  };

  saveUserDataOnRegister = (object, mode) => {
    var that = this;
    if (mode === "fb") {
      var result = object;
      var credential = result.credential;
      // The signed-in user info.
      var user = result.user;
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var accessToken = credential.accessToken;
      var URL =
        "https://graph.facebook.com/" +
        user.providerData[0].uid +
        "?fields=id,name,gender&access_token=" +
        accessToken;
      //    console.log("fb app get");
      //my work over here
      fetch(URL)
        .then((resp) => resp.json())
        .then(function (data) {
          //   console.log(data);
          var user = object;
          var gender = data.gender;
          gender = gender.replace(
            gender.charAt(0),
            gender.charAt(0).toUpperCase()
          );
          var postData = {
            email: user.user.email,
            name: data.name,
            gender: gender,
            status: ""
          };
          var key = "/users/" + user.user.uid;
          var updates = {};
          updates[key] = postData;
          //console.log(user);
          firebase.database().ref().update(updates);
          that.gotoComp("Profile");
        });
    } else {
      var user = object;
      var postData = {
        email: user.user.email,
        name: "",
        gender: "",
        status: ""
      };
      var key = "/users/" + user.user.uid;
      var updates = {};
      updates[key] = postData;
      //console.log(user);
      firebase.database().ref().update(updates);
      that.gotoComp("Profile");
    }
  };
  gotoComp = (comp) => {
    if (comp === "Profile") {
      this.props.parentCallback.callbackFunction({
        childstate: this.state,
        action: "login"
      });
      //console.log(this.props.parentCallback);
    }
  };

  render() {
    return (
      <div>
        <div className="container">
          <form>
            <div className="row">
              <h2 style={{ textAlign: "center" }}>
                Login with Social Media or Manually
              </h2>
              <div className="vl">
                <span className="vl-innertext">or</span>
              </div>

              <div className="col">
                <a
                  href="_blank"
                  name="fb-signup"
                  className="fb btn"
                  onClick={this.submitSend}
                >
                  <i className="fa fa-facebook fa-fw"></i> Login with Facebook
                </a>
                <a
                  href="_blank"
                  name="guest-signin"
                  className="twitter btn"
                  onClick={this.submitSend}
                >
                  <i className="google"></i>Proceed as a guest
                </a>
              </div>

              <div className="col">
                <div className="hide-md-lg">
                  <p>Or sign in manually:</p>
                </div>

                <input
                  type="text"
                  name="username"
                  onChange={this.changeHandler}
                  placeholder="Username"
                  required
                />
                <input
                  type="password"
                  name="password"
                  onChange={this.changeHandler}
                  placeholder="Password"
                  required
                />
                <input type="submit" name="Login" onClick={this.submitSend} />
              </div>
            </div>
          </form>
        </div>

        <h2
          show={this.state.error_on_login}
          style={{ textAlign: "center", background: "red" }}
        >
          {this.state.error_on_login_msg}
        </h2>

        <div className="bottom-container">
          <div className="row">
            <div className="col">
              <a
                href="_blank"
                className="btn"
                style={{ color: "white" }}
                name="signup"
                onClick={this.submitSend}
              >
                Sign up
              </a>
            </div>
            <div className="col">
              <a href="#" className="btn" style={{ color: "white" }}>
                Forgot password?
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
