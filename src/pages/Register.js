import React, { useRef, useState } from "react";
import axios from "axios";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mail: "null",
      password: "null",
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
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
        <label>
          Login :
          <input
            name="mail"
            value={this.state.mail}
            type="text"
            onChange={this.handleChange}
          />
        </label>
        <input type="button" value="Envoyer" onClick={this.onSubmit} />
      </div>
    );
  }
}
export default Register;
