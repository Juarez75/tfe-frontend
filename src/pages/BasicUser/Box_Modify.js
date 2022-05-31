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
      id_room: "",
      name: "",
      comment: "",
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    axios
      .get(`http://localhost:3001/box/information/${this.state.id}`, {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({
          name: res.data.name,
          comment: res.data.comment,
          id_room: res.data.id_room,
        });
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
        `http://localhost:3001/box/update`,
        {
          id: this.state.id,
          name: this.state.name,
          comment: this.state.comment,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.props.router.navigate(`/room/${this.state.id_room}`);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    if (this.state.type == 1) return <div>Vous n'avez pas accès à ça</div>;
    return (
      <div>
        <NavigationBar color={this.state.color} />
        <h4>Modification d'une box</h4>
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
          <Button variant="secondary" onClick={this.onSubmit}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}
export default withRouter(Room_Create);
