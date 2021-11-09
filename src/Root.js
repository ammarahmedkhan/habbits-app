import React from "react";
import ReactDOM, { render } from "react-dom";
import App from "./App";
import Forms from "./Forms";
import Loading from "./Loading";
import Profile from "./Profile";
//import styles from "./styles-app.css";

export class Root extends React.Component {
  constructor() {
    super();
    this.state = {
      message: "aaa",
      app: true,
      loading: false,
      profile: false
    };
  }

  callbackFunction = (childData) => {
    var obj;
    if (childData.action === "login") {
      obj = this.state;
      obj.app = false;
      obj.loading = false;
      obj.profile = true;
      //obj.profile_data = childData;
      this.setState(obj);
    } else if (childData.action === "back") {
      obj = this.state;
      obj.app = true;
      obj.loading = false;
      obj.profile = false;
      this.setState(obj);
    }
    //    console.log(childData);
  };

  render() {
    return (
      <div>
        {this.state.app && <App parentCallback={this} />}
        {this.state.loading && <Loading />}
        {this.state.profile && <Profile parentCallback={this} />}
      </div>
    );
  }
}

export default Root;
