import axios from "axios";
import React from "react";
import { Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { withRouter } from "../../withRouter";
import { NavigationBarSociety } from "../Component/NavSociety";

class Personalize extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: localStorage.getItem("color"),
      society_code: localStorage.getItem("society_code"),
      type: localStorage.getItem("type"),
      tags: [],
      selectedTag: "",
      nameTag: "",
      tagColor: "#707070",
    };

    this.loadData = this.loadData.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
    this.addTag = this.addTag.bind(this);
    this.updateColor = this.updateColor.bind(this);

    this.loadData();
  }

  loadData() {
    axios
      .get("http://localhost:3001/tag/user", { withCredentials: true })
      .then((res) => {
        this.setState({ tags: res.data });
      })
      .catch((error) => console.log(error));
  }

  deleteTag() {
    axios
      .post(
        "http://localhost:3001/tag/delete",
        {
          id: this.state.selectedTag,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.loadData();
      })
      .catch((error) => console.log(error));
  }

  addTag() {
    axios
      .post(
        "http://localhost:3001/tag/create",
        {
          name: this.state.nameTag,
          color: this.state.tagColor,
        },
        { withCredentials: true }
      )
      .then((res) => this.loadData())
      .catch((error) => console.log(error));
  }

  updateColor() {
    axios
      .post(
        "http://localhost:3001/society/updateColor",
        {
          color: this.state.color,
        },
        { withCredentials: true }
      )
      .then(() => {
        localStorage.setItem("color", this.state.color);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    if (this.state.type == 2 || 0)
      return <div>Nous n'êtes pas autorisé sur cette page</div>;
    return (
      <>
        <NavigationBarSociety color={this.state.color} />
        <h4>Personalisation</h4>
        <Col md={5} className="my-2">
          <Form.Group as={Row}>
            <Form.Label column className="my-auto">
              Couleur du site:
            </Form.Label>
            <Col md={2}>
              <Form.Control
                type="color"
                value={this.state.color}
                onChange={(event) =>
                  this.setState({ color: event.target.value })
                }
              />
            </Col>
            <Col>
              <Button variant="secondary" onClick={this.updateColor}>
                Sauvegarder
              </Button>
            </Col>
          </Form.Group>
        </Col>
        <Col md={8} className="my-2">
          <Form.Group as={Row}>
            <Col md={3}>
              <Form.Label className="my-auto">Couleur du site:</Form.Label>
            </Col>
            <Col md={5}>
              <Form.Control
                type="text"
                name="nameTag"
                value={this.state.nameTag}
                onChange={(event) =>
                  this.setState({ nameTag: event.target.value })
                }
                placeholder="Ajouter tag"
              />
            </Col>
            <Col md={1}>
              <Form.Control
                type="color"
                value={this.state.tagColor}
                onChange={(event) =>
                  this.setState({ tagColor: event.target.value })
                }
              />
            </Col>
            <Col className="mx-1">
              <Button variant="secondary" onClick={this.addTag}>
                Ajouter
              </Button>
            </Col>
          </Form.Group>
        </Col>
        <Col md={6}>
          <InputGroup className="my-2">
            <Form.Label>Supprimer un tag :</Form.Label>
            <Form.Select
              aria-label="Exemple"
              className="mx-1 "
              name="selectedTag"
              onChange={(event) =>
                this.setState({ selectedTag: event.target.value })
              }
            >
              <option>--Sélectionne--</option>
              {this.state.tags.map((item) => (
                <option
                  style={{ backgroundColor: item.color }}
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </Form.Select>
            <Button variant="secondary" onClick={this.deleteTag}>
              Supprimer
            </Button>
          </InputGroup>
        </Col>
      </>
    );
  }
}
export default withRouter(Personalize);
