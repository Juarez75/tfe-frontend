import React from "react";
import axios from "axios";
import * as d3 from "d3";
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
  ModalBody,
  Breadcrumb,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { withRouter } from "../../withRouter";
import { NavigationBar } from "../Component/NavUser";
import _, { isUndefined } from "lodash";
import ErrorHappened from "../Component/ErrorHappened";

class Room_List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: [],
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
      id_society: localStorage.getItem("id_society"),
      show: false,
      selectedTag: "",
      typeRoom: "",
      stage: "0",
      name: "",
      tags: [],
      EMPTY_NAME: false,
      ERROR_HAPPENED: false,
      isLoading: true,
    };
    this.onCreate = this.onCreate.bind(this);
    this.loadTag = this.loadTag.bind(this);
    this.loadRoom = this.loadRoom.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

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
        console.log(res);
        this.loadTag();
        this.setState({ room: res.data, isLoading: false });
      })
      .catch((error) => {
        if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
  }

  loadTag() {
    if (this.state.id_society != "null") {
      axios
        .get("http://localhost:3001/tag/society", { withCredentials: true })
        .then((res) => {
          this.setState({ tags: res.data });
        })
        .catch((error) => {
          if (error.response.data == "ERROR") {
            this.setState({ ERROR_HAPPENED: true });
            setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
          }
        });
    }
  }

  onSubmit() {
    if (this.state.name != "") {
      axios
        .post(
          `http://localhost:3001/room/create`,
          {
            name: this.state.name,
            type: this.state.typeRoom,
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
          if (error.response.data == "ERROR") {
            this.setState({ ERROR_HAPPENED: true });
            setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
          }
        });
    } else this.setState({ EMPTY_NAME: true });
  }

  onCreate() {
    this.setState({ show: true });
  }

  onClick(id) {
    this.props.router.navigate(`/room/${id}`);
  }

  render() {
    if (this.state.isLoading) {
      return <div></div>;
    }
    const defaultPiece = [
      { id: 1, name: "Chambre" },
      { id: 2, name: "Cuisine" },
      { id: 3, name: "Salon" },
      { id: 4, name: "Bureau" },
      { id: 5, name: "Salle de bain" },
    ];
    var tagView = "";
    var color;
    if (this.state.id_society != "null") {
      tagView = (
        <Row className>
          <Form.Group>
            <Form.Label>Ajouter un tag</Form.Label>
            <Form.Select
              aria-label="Exemple"
              name="selectedTag"
              value={this.state.selectedTag}
              onChange={this.handleChange}
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
    for (var i = -10; i < 164; i++) {
      stages.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    if (this.state.type == 1) return <div>Vous n'avez pas accès à ça</div>;
    return (
      <div>
        <Modal
          show={this.state.ERROR_HAPPENED}
          onHide={() => this.setState({ ERROR_HAPPENED: false })}
        >
          <ErrorHappened></ErrorHappened>
        </Modal>
        <NavigationBar color={this.state.color} />
        <div id="center_list">
          <h4>Liste des pièces</h4>
          <Button variant="outline-secondary" onClick={this.onCreate}>
            Ajouter une pièce
          </Button>
          <Modal
            show={this.state.show}
            onHide={() => this.setState({ show: false })}
          >
            <ModalTitle>Créer une pièce</ModalTitle>
            <ModalBody>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    style={{
                      backgroundColor: this.state.EMPTY_NAME ? "#f7786f" : " ",
                    }}
                    name="name"
                    value={this.state.name}
                    type="text"
                    onChange={this.handleChange}
                    placeholder="Exemple"
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
                          onChange={this.handleChange}
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
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Etage</Form.Label>
                      <Form.Select
                        aria-label="Exemple"
                        name="stage"
                        onChange={this.handleChange}
                        defaultValue={this.state.stage}
                      >
                        {stages}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                <Button variant="secondary" onClick={this.onSubmit}>
                  Ajouter
                </Button>
              </Form>
            </ModalBody>
          </Modal>
          {rooms.map((row, i) => (
            <Row key={i}>
              {row.map((item) => (
                <Col key={item.id} md={4}>
                  <div className="d-grip">
                    <ButtonGroup className=" my-2 mx-auto d-grid">
                      <Button
                        style={{
                          backgroundColor:
                            item.id_TagSociety == null
                              ? (color = "#707070")
                              : (color = item.TagSociety.color),
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                          padding: "1rem",
                        }}
                        variant="secondary"
                        onClick={() => this.onClick(item.id)}
                      >
                        <h5 className="h5Room">{item.name}</h5>
                        <small>Nombre de caisses: {item._count.box}</small>
                      </Button>
                    </ButtonGroup>
                  </div>
                </Col>
              ))}
            </Row>
          ))}
        </div>
      </div>
    );
  }
}
export default withRouter(Room_List);
