import React from "react";
import axios from "axios";
import {
  Button,
  ListGroup,
  DropdownButton,
  Dropdown,
  ButtonGroup,
  Row,
  Col,
  Form,
  Modal,
  ModalTitle,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { withRouter } from "../../withRouter";
import { NavigationBar } from "../Component/NavUser";
import _, { isUndefined } from "lodash";

class Room_List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: [],
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
      society_code: localStorage.getItem("society_code"),
      show: false,
      selectedTag: "",
      typeRoom: "",
      stage: "0",
      name: "",
      comment: "",
      tags: [],
    };
    this.onCreate = this.onCreate.bind(this);
    this.loadTag = this.loadTag.bind(this);
    this.loadRoom = this.loadRoom.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.loadRoom();
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  loadRoom() {
    axios
      .get(`http://localhost:3001/room/list`, { withCredentials: true })
      .then((res) => {
        this.setState({ room: res.data });
      })
      .catch(function (error) {
        console.log(error.response.data);
      });
  }

  loadTag() {
    axios
      .get("http://localhost:3001/tag/society", { withCredentials: true })
      .then((res) => {
        this.setState({ tags: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onSubmit() {
    axios
      .post(
        `http://localhost:3001/room/create`,
        {
          name: this.state.name,
          comment: this.state.comment,
          type: this.state.type,
          stage: this.state.stage,
          tag: this.state.selectedTag,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.loadRoom();
        this.setState({ show: false });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onCreate() {
    this.setState({ show: true });
  }

  onClick(id) {
    this.props.router.navigate(`/room/${id}`);
  }

  onSelectChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const defaultPiece = [
      { id: 1, name: "Chambre" },
      { id: 2, name: "Cuisine" },
      { id: 3, name: "Salon" },
      { id: 4, name: "Bureau" },
      { id: 5, name: "Salle de bain" },
    ];
    var tagView = "";
    var color;
    if (this.state.society_code != 0) {
      this.loadTag();
      tagView = (
        <Row className>
          <Form.Group>
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
          </Form.Group>
        </Row>
      );
    }
    const rooms = _.chunk(this.state.room, 3);
    var stages = [];
    for (var i = 0; i < 164; i++) {
      stages.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    if (this.state.type == 1) return <div>Vous n'avez pas accès à ça</div>;
    return (
      <div>
        <NavigationBar color={this.state.color} />
        <h4>Liste des pièces</h4>
        <Button variant="outline-secondary" onClick={this.onCreate}>
          Add new room
        </Button>
        <Modal
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
        >
          <ModalTitle>Créer une pièce</ModalTitle>
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
                <Row>
                  <Form.Group>
                    <Form.Label>Type de pièce</Form.Label>
                    <Form.Select
                      aria-label="Exemple"
                      name="typeRoom"
                      onChange={this.onSelectChange}
                      defaultValue={this.state.typeRoom}
                    >
                      <option>--Sélectionne--</option>
                      {defaultPiece.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Row>
                {tagView}
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Etage</Form.Label>
                  <Form.Select
                    aria-label="Exemple"
                    name="stage"
                    onChange={this.onSelectChange}
                    defaultValue={this.state.stage}
                    htmlSize={4}
                  >
                    {stages}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Button variant="secondary" onClick={this.onSubmit}>
              Submit
            </Button>
          </Form>
        </Modal>
        {rooms.map((row, i) => (
          <Row key={i}>
            {row.map((item) => (
              <Col key={item.id} md={4}>
                <div className="d-grip">
                  <ButtonGroup className=" my-2 mx-auto d-grid">
                    <Button
                      style={{
                        backgroundColor: isUndefined(item.TagOnRoom[0])
                          ? (color = "#707070")
                          : (color = item.TagOnRoom[0].tag.color),
                      }}
                      variant="secondary"
                      onClick={() => this.onClick(item.id)}
                    >
                      <h5>{item.name}</h5>
                    </Button>
                  </ButtonGroup>
                </div>
              </Col>
            ))}
          </Row>
        ))}
      </div>
    );
  }
}
export default withRouter(Room_List);
