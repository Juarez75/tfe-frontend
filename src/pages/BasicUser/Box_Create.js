import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { Form, Button } from "react-bootstrap";
import { withRouter } from "../../withRouter";
import { NavigationBar } from "../View/NavUser";

class Box_Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id_room: parseInt(props.router.params.id),
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
        `http://localhost:3001/box/create`,
        {
          id_room: this.state.id_room,
          name: this.state.name,
          comment: this.state.comment,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.props.router.navigate("/room/" + this.state.id_room);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <NavigationBar />
        <Form>
          <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={this.state.name}
              type="text"
              onChange={this.handleChange}
              placeholder="Enter name"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              name="comment"
              value={this.state.comment}
              type="text"
              onChange={this.handleChange}
              placeholder="Enter comment"
            />
          </Form.Group>
          <Button variant="primary" onClick={this.onSubmit}>
            Submit
          </Button>
        </Form>
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
export default withRouter(Box_Create);
