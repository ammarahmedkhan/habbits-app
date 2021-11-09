import React from "react";
import ReactDOM, { render } from "react-dom";
import styles from "./styles-app.css";

export class Loading extends React.Component {
  constructor() {
    super();
  }

  render() {
    return <div class="loading">Loading&#8230;</div>;
  }
}

export default Loading;
