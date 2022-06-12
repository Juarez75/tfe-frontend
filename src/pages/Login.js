import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Form, Button, Nav, Container, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { withRouter } from "../withRouter";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mail: "",
      password: "",
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
      .then((res) => {
        localStorage.setItem("type", res.data.type);
        localStorage.setItem("color", res.data.color);
        localStorage.setItem("society_code", res.data.society_code);
        if (res.data.type == 2 || res.data.type == 0)
          this.props.router.navigate("/room/list");
        if (res.data.type == 1) this.props.router.navigate("/society/users");
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand
              href="#"
              onClick={() => window.location.reload(false)}
            >
              Case App
            </Navbar.Brand>
          </Container>
        </Navbar>
        <Form>
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

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              value={this.state.password}
              type="password"
              onChange={this.handleChange}
              placeholder="Enter password"
            />
          </Form.Group>
          <Button variant="secondary" onClick={this.onSubmit}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}
export default withRouter(Login);
