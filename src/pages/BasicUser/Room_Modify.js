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
      type: "",
      typeUser: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    axios
      .get(`http://localhost:3001/room/information/${this.state.id}`, {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({
          name: res.data.name,
          comment: res.data.comment,
          type: res.data.type,
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
    console.log(this.state.id);
    axios
      .post(
        `http://localhost:3001/room/update`,
        {
          id: this.state.id,
          name: this.state.name,
          comment: this.state.comment,
          type: this.state.type,
        },
        { withCredentials: true }
      )
      .then(() => {
        this.props.router.navigate(`/room/list`);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  onSelectChange(event) {
    this.setState({ type: event.target.value });
  }

  render() {
    const defaultPiece = [
      { id: 1, name: "Chambre" },
      { id: 2, name: "Cuisine" },
      { id: 3, name: "Salon" },
      { id: 4, name: "Bureau" },
      { id: 5, name: "Salle de bain" },
    ];
    if (this.state.typeUser == 1) return <div>Vous n'avez pas accès à ça</div>;
    return (
      <div>
        <NavigationBar color={this.state.color} />
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
          <Form.Group>
            <Form.Label>Type de pièce</Form.Label>
            <Form.Select
              aria-label="Exemple"
              name="selectedTag"
              onChange={this.onSelectChange}
              value={this.state.type}
            >
              <option>--Sélectionne--</option>
              {defaultPiece.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <br />
          <Button variant="secondary" onClick={this.onSubmit}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}
export default withRouter(Room_Create);
