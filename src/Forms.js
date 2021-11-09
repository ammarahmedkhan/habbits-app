import React from "react";
import ReactDOM, { render } from "react-dom";
import styles from "./styles.css";

export class Forms extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      age: null,
      ID: null,
      car: "",
      longtext: ""
    };
  }
  changeHandler = (ev) => {
    var currentstate = this.state;
    let nam = ev.target.name;
    let val = ev.target.value;
    currentstate[nam] = val;
    this.setState(currentstate);
  };

  submitHandler = (ev) => {
    ev.preventDefault();

    //alert(this.state.name);

    const myPromise = new Promise(function (myResolve, myReject) {
      const xhttp = new XMLHttpRequest();
      var value = "";
      xhttp.onload = function () {
        value = this.responseText;
        myResolve(value);
      };
      xhttp.open(
        "GET",
        "https://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json"
      );
      xhttp.send();
    });
    var text = "";
    var that = this;
    var currentstate = this.state;
    myPromise.then(function (value) {
      for (let m of JSON.parse(value).value) {
        text += m.ProductName + "<br>";
      }
      currentstate.longtext = text;

      currentstate.name = JSON.parse(value).value[0].ProductName;
      that.setState(currentstate);
    });
  };

  //make sure to have arrow functions
  //so that the 'this' keyword can be used
  //
  render() {
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <p>Enter your name:</p>
          <input type="text" name="name" onChange={this.changeHandler} />
          <p>Enter your age:</p>
          <input type="number" name="age" onChange={this.changeHandler} />
          <p>Enter your ID-number:</p>
          <input type="text" name="ID" onChange={this.changeHandler} />
          <input type="submit" />
          <p>Enter your car:</p>
          <select name="car" onChange={this.changeHandler}>
            <option value="Ford">Ford</option>
            <option value="Volvo">Volvo</option>
            <option value="Fiat">Fiat</option>
          </select>
        </form>

        <br></br>

        <h1>You entered</h1>
        <p>{this.state.name}</p>
        <p>{this.state.age}</p>
        <p>{this.state.ID}</p>
        <p>{this.state.car}</p>
        <p>{this.state.longtext}</p>
      </div>
    );
  }
}

export default Forms;
