import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Form,
  Button,
  Row,
  Col,
  InputGroup,
  CloseButton,
  FormControl,
  Card,
} from "react-bootstrap";
import { withRouter } from "../../withRouter";
import { NavigationBar } from "../View/NavUser";
import { isUndefined } from "lodash";

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
      tags: [],
      tagRoom: null,
      selectedTag: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.loadRoom = this.loadRoom.bind(this);
    this.addTag = this.addTag.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
    this.loadRoom();
    axios
      .get("http://localhost:3001/tag/society", { withCredentials: true })
      .then((res) => {
        this.setState({ tags: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  deleteTag(id_room, id_tag) {
    axios
      .post(
        "http://localhost:3001/tag/deletelinkroom",
        {
          id_room: id_room,
          id_tag: id_tag,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.setState({ tagRoom: null, selectedTag: "" });
        this.loadRoom();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  loadRoom() {
    axios
      .get(`http://localhost:3001/room/information/${this.state.id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (isUndefined(res.data.TagOnRoom[0])) {
          this.setState({
            name: res.data.name,
            comment: res.data.comment,
            type: res.data.type,
          });
        } else {
          this.setState({
            name: res.data.name,
            comment: res.data.comment,
            type: res.data.type,
            tagRoom: res.data.TagOnRoom[0].tag,
          });
        }
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
    this.setState({ [event.target.name]: event.target.value });
  }

  addTag() {
    if (isNaN(this.state.selectedTag)) return;
    axios
      .post(
        "http://localhost:3001/tag/linkroom",
        {
          id_room: this.state.id,
          id_tag: this.state.selectedTag,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.loadRoom();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    var tagView;
    if (this.state.tagRoom == null)
      tagView = (
        <>
          <Form.Label>Ajouter un tag</Form.Label>
          <Form.Select
            aria-label="Exemple"
            name="selectedTag"
            value={this.state.selectedTag}
            onChange={this.onSelectChange}
          >
            <option>--Sélectionne--</option>
            {this.state.tags.map((item) => (
              <option
                key={item.id}
                value={item.id}
                style={{ backgroundColor: item.color }}
              >
                {item.name}
              </option>
            ))}
          </Form.Select>
          <Button variant="secondary" onClick={this.addTag}>
            Ajouter
          </Button>
        </>
      );
    else
      tagView = (
        <>
          <Form.Label>Tag:</Form.Label>
          <InputGroup>
            <FormControl
              style={{ backgroundColor: this.state.tagRoom.color }}
              disabled
              readOnly
              value={this.state.tagRoom.name}
            />
            <Button
              variant="secondary"
              onClick={() =>
                this.deleteTag(this.state.id, this.state.tagRoom.id)
              }
            >
              X
            </Button>
          </InputGroup>
        </>
      );
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
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Type de pièce</Form.Label>
                <Form.Select
                  aria-label="Exemple"
                  name="type"
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
                <Button variant="secondary" onClick={this.onSubmit}>
                  Sauvegarder
                </Button>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>{tagView}</Form.Group>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
export default withRouter(Room_Create);
