import React, { useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

class Room_Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jwtToken: Cookies.get("access_token"),
      name: "",
      comment: "",
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
        `http://localhost:3001/room/create`,
        {
          name: this.state.name,
          comment: this.state.comment,
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
          Name :
          <input
            name="name"
            value={this.state.name}
            type="text"
            onChange={this.handleChange}
          />
          Comment :
          <input
            name="comment"
            value={this.state.comment}
            type="textarea"
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
export default Room_Create;
