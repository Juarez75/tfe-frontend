import React from "react";
import axios from "axios";
import { withRouter } from "../withRouter";
import { Button, Form } from "react-bootstrap";
import { NavigationBar } from "./View/Nav";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mail: "",
      firstname: "",
      lastname: "",
      lastPwd: "",
      newPwd: "",
      type: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onUpdatePwd = this.onUpdatePwd.bind(this);
    axios
      .get(`http://localhost:3001/user/information`, {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({
          mail: res.data.mail,
          firstname: res.data.firstname,
          lastname: res.data.lastname,
          type: res.data.type,
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

  render() {
    let view;
    if (this.state.type == 2 || this.state.type == 0) {
      view = (
        <Form>
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
        </Form>
      );
    } else if (this.state.type == 1) {
      view = (
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
      );
    }
    return (
      <div>
        <NavigationBar />
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
        {view}
        <Button variant="primary" type="button" onClick={this.onUpdate}>
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
        <Button variant="primary" type="button" onClick={this.onUpdatePwd}>
          Submit
        </Button>
      </div>
    );
  }
}
export default withRouter(Profile);
