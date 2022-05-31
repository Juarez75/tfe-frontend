import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { withRouter } from "../../withRouter";
import { NavigationBar } from "../View/NavUser";

class Box_Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: parseInt(props.router.params.id),
      name: "",
      id_box: "",
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    axios
      .get(`http://localhost:3001/object/information/${this.state.id}`, {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({ name: res.data.name, id_box: res.data.id_box });
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
        `http://localhost:3001/object/update`,
        {
          id: this.state.id,
          name: this.state.name,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.props.router.navigate("/box/" + this.state.id_box);
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

          <Button variant="secondary" onClick={this.onSubmit}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}
export default withRouter(Box_Create);
