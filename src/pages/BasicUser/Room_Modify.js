import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { withRouter } from "../../withRouter";
import { NavigationBar } from "../View/NavUser";

class Room_Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: parseInt(props.router.params.id),
      name: "",
      comment: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    axios
      .get(`http://localhost:3001/room/information/${this.state.id}`, {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({ name: res.data.name, comment: res.data.comment });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  onSubmit() {
    axios
      .post(
        `http://localhost:3001/room/update`,
        {
          id: this.state.id,
          name: this.state.name,
          comment: this.state.comment,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.props.router.navigate(`/room/list`);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <NavigationBar />
        <h4>Modification d'une pièce</h4>
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
export default withRouter(Room_Create);
