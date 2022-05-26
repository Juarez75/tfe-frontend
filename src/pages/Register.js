import React, { useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mail: "",
      password: "",
      firstname: "",
      lastname: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  onSubmit() {
    axios
      .post(`http://localhost:3001/user/create`, {
        mail: this.state.mail,
        password: this.state.password,
        firstname: this.state.firstname,
        lastname: this.state.lastname,
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
        <label>
          Mail :
          <input
            name="mail"
            value={this.state.mail}
            type="text"
            onChange={this.handleChange}
          />
          Firstname :
          <input
            name="firstname"
            value={this.state.firstname}
            type="text"
            onChange={this.handleChange}
          />
          Lastname :
          <input
            name="lastname"
            value={this.state.lastname}
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
export default Register;
