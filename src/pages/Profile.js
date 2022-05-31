import React from "react";
import axios from "axios";
import { withRouter } from "../withRouter";
import { Button, Form } from "react-bootstrap";
import { NavigationBar } from "./View/NavUser";
import { NavigationBarSociety } from "./View/NavSociety";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mail: "",
      firstname: "",
      lastname: "",
      lastPwd: "",
      newPwd: "",
      type: localStorage.getItem("type"),
      society_code: "",
      color: localStorage.getItem("color"),
    };
    this.handleChange = this.handleChange.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onUpdatePwd = this.onUpdatePwd.bind(this);
    this.onChange = this.onChange.bind(this);
    axios
      .get(`http://localhost:3001/user/information`, {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({
          mail: res.data.mail,
          firstname: res.data.firstname,
          lastname: res.data.lastname,
          society_code: res.data.society_code,
          color: res.data.color,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  onUpdate() {
    axios
      .post(
        `http://localhost:3001/user/update`,
        {
          mail: this.state.mail,
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          color: this.state.color,
        },
        { withCredentials: true }
      )
      .then((res) => {
        window.location.reload(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  onUpdatePwd() {
    axios
      .post(
        `http://localhost:3001/user/updatePwd`,
        {
          lastPwd: this.state.lastPwd,
          newPwd: this.state.newPwd,
        },
        { withCredentials: true }
      )
      .then((res) => {
        window.location.reload(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  onChange(event) {
    this.setState({ color: event.target.value });
  }

  render() {
    let view;
    let society_view = (
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Code société</Form.Label>
        <Form.Control
          name="society_code"
          value={this.state.society_code}
          type="number"
          onChange={this.handleChange}
          placeholder=""
          disabled
          readOnly
        />
      </Form.Group>
    );
    if (this.state.society_code == 0) {
      society_view = null;
    }
    if (this.state.type == 2 || this.state.type == 0) {
      view = (
        <div>
          <NavigationBar color={this.state.color} />

          <Form.Group className="mb-3" controlId="formBasicFirstname">
            <Form.Label>Firstname</Form.Label>
            <Form.Control
              name="firstname"
              value={this.state.firstname}
              type="text"
              onChange={this.handleChange}
              placeholder="Enter firstname"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicLastname">
            <Form.Label>Lastname</Form.Label>
            <Form.Control
              name="lastname"
              value={this.state.lastname}
              type="lastname"
              onChange={this.handleChange}
              placeholder="Enter lastname"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              name="mail"
              value={this.state.mail}
              type="mail"
              onChange={this.handleChange}
              placeholder="Enter email"
            />
          </Form.Group>
        </div>
      );
    } else if (this.state.type == 1) {
      view = (
        <div>
          <NavigationBarSociety color={this.state.color} />
          <Form.Group className="mb-3" controlId="formBasicFirstname">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="firstname"
              value={this.state.firstname}
              type="text"
              onChange={this.handleChange}
              placeholder="Enter firstname"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              name="mail"
              value={this.state.mail}
              type="mail"
              onChange={this.handleChange}
              placeholder="Enter email"
            />
          </Form.Group>
          <Form.Label htmlFor="exampleColorInput">Color picker</Form.Label>
          <Form.Control
            type="color"
            id="exampleColorInput"
            title="Choose your color"
            value={this.state.color}
            onChange={this.onChange}
          />
        </div>
      );
    }
    return (
      <div>
        {view}
        {society_view}
        <Button variant="secondary" type="button" onClick={this.onUpdate}>
          Submit
        </Button>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Actual password</Form.Label>
          <Form.Control
            name="lastPwd"
            value={this.state.lastPwd}
            type="password"
            onChange={this.handleChange}
            placeholder=""
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>New password</Form.Label>
          <Form.Control
            name="newPwd"
            value={this.state.newPwd}
            type="password"
            onChange={this.handleChange}
            placeholder=""
          />
        </Form.Group>
        <Button variant="secondary" type="button" onClick={this.onUpdatePwd}>
          Submit
        </Button>
      </div>
    );
  }
}
export default withRouter(Profile);
