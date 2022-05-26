import React, { useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mail: "marcan.gallez@std.heh.be",
      password: "marcan",
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  onSubmit() {
    axios
      .post(
        `http://localhost:3001/user/login`,
        {
          mail: this.state.mail,
          password: this.state.password,
        },
        { withCredentials: true }
      )
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
        <Link to="/register">Register</Link>
        <br />
        <Link to="/">Login</Link>
        <br />
        <Link to="/room/create">CreateRoom</Link>
        <br />
      </div>
    );
  }
}
export default Login;
