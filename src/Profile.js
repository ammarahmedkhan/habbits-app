import React from "react";
import ReactDOM, { render } from "react-dom";
import styles from "./styles-css-profile.css";
import firebase from "firebase";
import sassstyles from "./profile.scss";
import { data } from "./Calendar.js";

export class Profile extends React.Component {
  constructor(props) {
    super(props);
    //    console.log(props);
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      firebase.analytics();
    } else {
      firebase.app(); // if already initialized, use that one
    }
    const user = firebase.auth().currentUser;
    if (user) {
      //console.log("User object: ", user.uid);
    }
    this.state = {
      message: "",
      name: "John Doel",
      twitter: "Twitter",
      instagram: "Instagram",
      facebook: "Facebook",
      email: user.email,
      gender: "Male",
      image: "",
      edit: "none",
      disp: "block",
      habbit: "none",
      status: "earth to me",
      rem_title: "Finish '10X' in 10 days",
      rem_desc: "write more here",
      rem_place: "Home",
      rem_evt_start: "",
      rem_evt_end: "",
      rem_evt_repeat: "DAILY",
      rem_evt_days: [],
      user: user,
      icsFormatterObj: {},
      show_days: "block",
      icsFormatterObjShow: false,
      checked_male: false,
      checked_female: false,
      checked_other: false
    };
    var firebaseConfig = {
      apiKey: "AIzaSyCpsac9VVt5uE0AF2MVk8kSVMAWFcewFfM",
      authDomain: "auth-practice-4b9a7.firebaseapp.com",
      projectId: "auth-practice-4b9a7",
      storageBucket: "auth-practice-4b9a7.appspot.com",
      messagingSenderId: "677785265170",
      appId: "1:677785265170:web:a3a6f44134e47c836fa4cb",
      measurementId: "G-PYBLC4DJX2",
      databaseURL: "https://auth-practice-4b9a7-default-rtdb.firebaseio.com/"
    };

    this.setUserData(user);
    //console.log(user);

    //console.log(firebase.auth().currentUser);
  }

  setUserData = (user) => {
    const avatars = {
      Male: "https://bootdey.com/img/Content/avatar/avatar7.png",
      Female:
        "https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/11_avatar-1024.png",
      Other:
        "https://img.favpng.com/7/2/6/smiley-emoticon-computer-icons-drawing-clip-art-png-favpng-VFg5qjHm4DunTstcHfNzSLRwY.jpg"
    };

    const radio_buttons = {
      Male: "checked_male",
      Female: "checked_female",
      Other: "checked_other"
    };
    var that = this;
    var key = "/users/" + user.uid;
    var database = firebase.database();
    //var userdata = database.ref("users/ammar");
    var userdata = database.ref(key);
    userdata.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        //console.log("data", data);
        var current = that.state;
        current.checked_male = false;
        current.checked_female = false;
        current.checked_other = false;
        if (data.name !== undefined) {
          current.name = data.name;
        }
        if (data.status !== undefined) {
          current.status = data.status;
        }
        if (data.gender !== undefined) {
          current.gender = data.gender;
          current.image = avatars[current.gender];
          current[radio_buttons[current.gender]] = true;
        }
        that.setState(current);
      }
    });
  };
  saveUserData = () => {
    var user = this.state.user;
    //console.log(user);
    var postData = {
      email: user.email,
      name: this.state.name,
      gender: this.state.gender,
      status: this.state.status
    };
    var key = "/users/" + user.uid;
    var updates = {};
    updates[key] = postData;
    firebase.database().ref().update(updates);
    this.setUserData(user);
  };

  submitHandler = (evt) => {
    evt.preventDefault();
    var object = this.state;
    // edit-toggle
    //console.log(evt.target.id);
    if (evt.target.id === "back") {
      this.props.parentCallback.callbackFunction({
        childstate: this.state,
        action: "back"
      });
    } else if (evt.target.id === "edit-toggle") {
      if (object.disp === "none") {
        object.disp = "block";
      } else {
        object.disp = "none";
      }
      if (object.edit === "none") {
        object.edit = "block";
      } else {
        object.edit = "none";
      }

      this.setState(object);
      this.saveUserData();
    } else if (evt.target.id === "edit-toggle") {
    } else if (evt.target.id === "lets-do-this") {
      /*
      console.log(
        this.state.rem_title,
        this.state.rem_desc,
        this.state.rem_place,
        this.state.rem_evt_start,
        this.state.rem_evt_end,
        this.state.rem_evt_repeat,
        this.state.rem_evt_days
      );
      */
      data.cal(
        this.state.rem_title,
        this.state.rem_desc,
        this.state.rem_place,
        this.state.rem_evt_start,
        this.state.rem_evt_end,
        this.state.rem_evt_repeat,
        this.state.rem_evt_days
      );
      /*
      if (object.habbit === "none") {
        object.habbit = "block";
      } else {
        object.habbit = "none";
      }
      */
      //    object.icsFormatterObjShow = true;
    } else if (evt.target.id === "add-habbit" || evt.target.id === "cancel") {
      if (object.habbit === "none") {
        object.habbit = "block";
      } else {
        object.habbit = "none";
      }
    }
    this.setState(object);
  };

  changeHandler = (ev) => {
    var currentstate = this.state;
    if (ev.target.type === "radio") {
      var arr = ev.target.id.split(":");
      currentstate[arr[0]] = arr[1];

      //console.log(object.rem_evt_repeat);
      if (currentstate.rem_evt_repeat === "WEEKLY") {
        currentstate.show_days = "block";
      } else {
        currentstate.show_days = "none";
      }
      //currentstate.gender = ev.target.id;
    } else {
      let nam = ev.target.name;
      let val = ev.target.value;
      currentstate[nam] = val;

      //console.log(nam, val);
    }
    this.setState(currentstate);
  };

  callbackFunction = (childData) => {
    var obj = this.state;
    if (childData.action === "back") {
      obj.icsFormatterObjShow = false;
    }
    this.setState(obj);
    //    console.log(childData);
  };

  changeHandlerWeek = (ev) => {
    var currentstate = this.state;
    if (ev.target.type === "checkbox") {
      var arr = ev.target.id.split(":");
      if (ev.target.checked) {
        currentstate.rem_evt_days.push(arr[1]);
      } else {
        var index = currentstate.rem_evt_days.findIndex(
          (element) => element == arr[1]
        );
        var spliced = currentstate.rem_evt_days.splice(index, 1);
      }
      //currentstate[arr[0]] = arr[1];
      //currentstate.gender = ev.target.id;
    }
    //console.log(currentstate.rem_evt_days);
    this.setState(currentstate);
  };

  render() {
    return (
      <div id="snippetContent">
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css"
        />{" "}
        <div className="container">
          <div className="main-body">
            {" "}
            <nav aria-label="breadcrumb" className="main-breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="_blank" id="back" onClick={this.submitHandler}>
                    Home
                  </a>
                </li>
              </ol>{" "}
            </nav>
            <div className="row gutters-sm">
              <div className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex flex-column align-items-center text-center">
                      {" "}
                      <img
                        src={this.state.image}
                        alt="Avatar"
                        className="rounded-circle"
                        width={150}
                      />
                      <div className="mt-3">
                        <h4>{this.state.name}</h4>
                        <p className="text-secondary mb-1">
                          {this.state.status}
                        </p>
                      </div>
                      <div className="row">
                        <div className="col-sm-12">
                          {" "}
                          <a
                            className="btn btn-info "
                            id="add-habbit"
                            href="_blank"
                            onClick={this.submitHandler}
                          >
                            Add Habbit
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="card" style={{ display: this.state.habbit }}>
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Title</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        {" "}
                        <input
                          type="text"
                          name="rem_title"
                          className="form-control"
                          onChange={this.changeHandler}
                          value={this.state.rem_title}
                        ></input>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Description</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        {" "}
                        <input
                          type="text"
                          name="rem_desc"
                          className="form-control"
                          onChange={this.changeHandler}
                          value={this.state.rem_desc}
                        ></input>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Place</h6>
                      </div>
                      <div>
                        <div>
                          <form
                            className="formclass"
                            onChange={this.changeHandler}
                          >
                            <label className="labelclass">
                              <input
                                className="inputclass"
                                type="radio"
                                name="radio"
                                id="rem_place:Home"
                              />
                              <span className="spanclass">Home</span>
                            </label>
                            <label className="labelclass">
                              <input
                                type="radio"
                                className="inputclass"
                                name="radio"
                                id="rem_place:School"
                              />
                              <span className="spanclass">School</span>
                            </label>
                            <label className="labelclass">
                              <input
                                type="radio"
                                className="inputclass"
                                name="radio"
                                id="rem_place:Work"
                              />
                              <span className="spanclass">Work</span>
                            </label>
                            <label className="labelclass">
                              <input
                                type="radio"
                                className="inputclass"
                                name="radio"
                                id="rem_place:Everywhere"
                              />
                              <span className="spanclass">Everywhere</span>
                            </label>
                          </form>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Frequency</h6>
                      </div>
                      <div>
                        <div>
                          <form
                            className="formclass"
                            onChange={this.changeHandler}
                          >
                            <label className="labelclass">
                              <input
                                className="inputclass"
                                type="radio"
                                name="radio"
                                id="rem_evt_repeat:DAILY"
                              />
                              <span className="spanclass">Daily</span>
                            </label>
                            <label className="labelclass">
                              <input
                                type="radio"
                                className="inputclass"
                                name="radio"
                                id="rem_evt_repeat:WEEKLY"
                              />
                              <span className="spanclass">Weekly</span>
                            </label>
                          </form>
                        </div>
                      </div>
                    </div>

                    <div
                      className="row mb-3"
                      style={{ display: this.state.show_days }}
                    >
                      <div className="col-sm-3">
                        <h6 className="mb-0">Days</h6>
                      </div>
                      <div>
                        <div>
                          <form
                            className="formclass"
                            onChange={this.changeHandlerWeek}
                          >
                            <label className="labelclass">
                              <input
                                className="inputclass"
                                type="checkbox"
                                name="radio"
                                id="rem_evt_days:MO"
                              />
                              <span className="spanclass">MO</span>
                            </label>
                            <label className="labelclass">
                              <input
                                type="checkbox"
                                className="inputclass"
                                name="radio"
                                id="rem_evt_days:TU"
                              />
                              <span className="spanclass">TU</span>
                            </label>
                            <label className="labelclass">
                              <input
                                type="checkbox"
                                className="inputclass"
                                name="radio"
                                id="rem_evt_days:WE"
                              />
                              <span className="spanclass">WE</span>
                            </label>
                            <label className="labelclass">
                              <input
                                type="checkbox"
                                className="inputclass"
                                name="radio"
                                id="rem_evt_days:TH"
                              />
                              <span className="spanclass">TH</span>
                            </label>
                            <label className="labelclass">
                              <input
                                type="checkbox"
                                className="inputclass"
                                name="radio"
                                id="rem_evt_days:FR"
                              />
                              <span className="spanclass">FR</span>
                            </label>
                            <label className="labelclass">
                              <input
                                type="checkbox"
                                className="inputclass"
                                name="radio"
                                id="rem_evt_days:SA"
                              />
                              <span className="spanclass">SA</span>
                            </label>
                            <label className="labelclass">
                              <input
                                type="checkbox"
                                className="inputclass"
                                name="radio"
                                id="rem_evt_days:SU"
                              />
                              <span className="spanclass">SU</span>
                            </label>
                          </form>
                        </div>
                      </div>
                    </div>
                    <form onChange={this.changeHandler}>
                      <div className="row">
                        <div className="col-sm-3" />
                        <div className="col-sm-9 text-secondary">
                          <label htmlFor="rem_evt_start">
                            <span className="spanclass">
                              Start time and date
                            </span>
                          </label>
                          <input
                            type="datetime-local"
                            id="rem_evt_start"
                            name="rem_evt_start"
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-3" />
                        <div className="col-sm-9 text-secondary">
                          <label htmlFor="rem_evt_end">
                            <span className="spanclass">End time and date</span>
                          </label>
                          <input
                            type="datetime-local"
                            id="rem_evt_end"
                            name="rem_evt_end"
                          />
                        </div>
                      </div>
                    </form>

                    <div className="row">
                      <div className="col-sm-3" />
                      <div className="col-sm-9 text-secondary">
                        {" "}
                        <input
                          type="button"
                          className="btn btn-primary px-4"
                          id="lets-do-this"
                          href="_blank"
                          defaultValue="Lets Do This!"
                          onClick={this.submitHandler}
                        />
                        <input
                          type="button"
                          className="btn btn-danger px-4"
                          id="cancel"
                          href="_blank"
                          defaultValue="Close"
                          onClick={this.submitHandler}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
              </div>

              <div className="col-md-8">
                <div className="card mb-3" style={{ display: this.state.disp }}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Full Name</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        {" "}
                        {this.state.name}
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Email</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        {" "}
                        {this.state.email}
                      </div>
                    </div>

                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Gender</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        {this.state.gender}
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-12">
                        {" "}
                        <a
                          className="btn btn-info "
                          id="edit-toggle"
                          href="_blank"
                          onClick={this.submitHandler}
                        >
                          Edit
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card" style={{ display: this.state.edit }}>
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Full Name</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        {" "}
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          onChange={this.changeHandler}
                          value={this.state.name}
                        ></input>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Status</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        {" "}
                        <input
                          type="text"
                          name="status"
                          className="form-control"
                          onChange={this.changeHandler}
                          value={this.state.status}
                        ></input>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Gender</h6>
                      </div>
                      <div>
                        <div>
                          <form
                            className="formclass"
                            onChange={this.changeHandler}
                          >
                            <label className="labelclass">
                              <input
                                className="inputclass"
                                type="radio"
                                name="radio"
                                id="gender:Male"
                              />
                              <span className="spanclass">Male</span>
                            </label>
                            <label className="labelclass">
                              <input
                                type="radio"
                                className="inputclass"
                                name="radio"
                                id="gender:Female"
                              />
                              <span className="spanclass">Female</span>
                            </label>
                            <label className="labelclass">
                              <input
                                type="radio"
                                className="inputclass"
                                name="radio"
                                id="gender:Other"
                              />
                              <span className="spanclass">Other</span>
                            </label>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-3" />
                      <div className="col-sm-9 text-secondary">
                        {" "}
                        <input
                          type="button"
                          className="btn btn-primary px-4"
                          id="edit-toggle"
                          defaultValue="Save Changes"
                          onClick={this.submitHandler}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row gutters-sm" style={{ display: "none" }}>
                  <div className="col-sm-6 mb-3">
                    <div className="card h-100">
                      <div className="card-body">
                        <h6 className="d-flex align-items-center mb-3">
                          My rems
                        </h6>{" "}
                        <small>Web Design</small>
                        <div
                          className="progress mb-3"
                          style={{ height: "0px" }}
                        >
                          <div />
                        </div>{" "}
                        <small>Website Markup</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
