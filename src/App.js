import React, { useRef, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actualisation: "Bonjour",
      mail: "null",
      password: "null",
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  onClick() {
    axios.get(`http://localhost:3001/`).then((res) => {
      console.log(res.data);
    });
  }
  onSubmit() {
    axios
      .post(`http://localhost:3001/user/login`, {
        mail: this.state.mail,
        password: this.state.password,
      })
      .catch(function (error) {
        console.log(error);
      })
      .then((res) => {
        console.log(res.data);
      });
  }

  render() {
    return (
      <div>
        <input
          name="actualisation"
          value={this.state.actualisation}
          type="text"
          onChange={this.handleChange}
        />
        <p>{this.state.actualisation}</p>
        <button onClick={this.onClick} name="actualisation">
          GET
        </button>
        <br />
        <label>
          Login :
          <input
            name="mail"
            value={this.state.mail}
            type="text"
            onChange={this.handleChange}
          />
          Password :
          <input
            name="password"
            value={this.state.password}
            type="password"
            onChange={this.handleChange}
          />
        </label>
        <input type="button" value="Envoyer" onClick={this.onSubmit} />
      </div>
    );
  }
}
export default App;
