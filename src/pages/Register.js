import React from "react";
import axios from "axios";
import { Form, Button, Navbar, Container } from "react-bootstrap";
import { withRouter } from "../withRouter";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mail: "",
      password: "",
      firstname: "",
      lastname: "",
      type: "",
      society_code: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
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
        type: this.state.type,
        society_code: this.state.society_code,
      })
      .then((res) => {
        this.props.router.navigate("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  onChange(event) {
    this.setState({ type: event.target.value });
  }

  render() {
    let view;
    if (this.state.type == 2) {
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
          <Form.Group className="mb-3" controlId="formSocietyCode">
            <Form.Label>Lastname</Form.Label>
            <Form.Control
              name="society_code"
              value={this.state.society_code}
              type="number"
              onChange={this.handleChange}
              placeholder="00000"
            />
            <small>Numéro à rentrer si vous passez par une société</small>
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
      );
    } else if (this.state.type == 1) {
      view = (
        <Form>
          <Form.Group className="mb-3" controlId="formBasicFirstname">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="firstname"
              value={this.state.firstname}
              type="text"
              onChange={this.handleChange}
              placeholder="Enter the society's name"
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
      );
    }
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
        <br />
        <Form.Label>Vous êtes</Form.Label>
        <Form.Select
          aria-label="Default select example"
          onChange={this.onChange}
        >
          <option>--------------------</option>
          <option value="1">Société</option>
          <option value="2">Particulier</option>
        </Form.Select>
        {view}
      </div>
    );
  }
}

export default withRouter(Register);
