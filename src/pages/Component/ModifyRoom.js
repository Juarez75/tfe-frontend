import {
  Button,
  Form,
  Row,
  ModalTitle,
  Col,
  InputGroup,
  FormControl,
  ModalBody,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import { isUndefined } from "lodash";
import React from "react";
import ErrorHappened from "./ErrorHappened";

export class ModifyRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id_society: localStorage.getItem("id_society"),
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
      id: parseInt(props.id),
      name: "",
      stage: "",
      type_room: "",
      box: [],
      show: false,
      tags: [],
      selectedTag: "",
      defaultTag: "",
      EMPTY_NAME: false,
      ERROR_HAPPENED: false,
    };
    this.loadData = this.loadData.bind(this);
    this.loadTag = this.loadTag.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);

    this.loadData();
    if (localStorage.getItem("id_society") != "null") this.loadTag();
  }
  loadData() {
    axios
      .get(`http://localhost:3001/room/${this.state.id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.id_TagSociety == 0) {
          this.setState({
            name: res.data.name,
            type_room: res.data.type,
            stage: res.data.stage,
            box: res.data.box,
          });
        } else {
          this.setState({
            name: res.data.name,
            type_room: res.data.type,
            stage: res.data.stage,
            box: res.data.box,
            defaultTag: res.data.TagSociety,
          });
        }
      })
      .catch((error) => {
        if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
  }
  loadTag() {
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
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  onSelectChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  onUpdate() {
    if (this.state.name != "") {
      axios
        .post(
          `http://localhost:3001/room/update`,
          {
            id: this.state.id,
            name: this.state.name,
            type: this.state.type_room,
            stage: this.state.stage,
            tag: this.state.selectedTag,
          },
          { withCredentials: true }
        )
        .then((res) => {
          window.location.reload(false);
        })
        .catch((error) => {
          if (error.response.data == "ERROR") {
            this.setState({ ERROR_HAPPENED: true });
            setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
          }
        });
    } else this.setState({ EMPTY_NAME: true });
  }
  deleteTag() {
    axios
      .post(
        "http://localhost:3001/tag/society/deletelink",
        {
          id_room: this.state.id,
          id_tag: this.state.selectedTag.id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.setState({ defaultTag: "" });
        this.loadData();
      })
      .catch((error) => {
        if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
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

    if (this.state.id_society != "null") {
      if (this.state.defaultTag == null)
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
      else
        tagView = (
          <>
            <Form.Label>Tag:</Form.Label>
            <InputGroup>
              <FormControl
                style={{ backgroundColor: this.state.defaultTag.color }}
                disabled
                readOnly
                value={this.state.defaultTag.name}
              />
              <Button variant="secondary" onClick={() => this.deleteTag()}>
                X
              </Button>
            </InputGroup>
          </>
        );
    }

    var stages = [];
    for (var i = -10; i < 164; i++) {
      stages.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return (
      <>
        <Modal
          show={this.state.ERROR_HAPPENED}
          onHide={() => this.setState({ ERROR_HAPPENED: false })}
        >
          <ErrorHappened></ErrorHappened>
        </Modal>
        <ModalTitle className="mx-1">Modifier la pièce</ModalTitle>
        <ModalBody>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                style={{
                  backgroundColor: this.state.EMPTY_PASSWORD ? "#f7786f" : " ",
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
                      name="type_room"
                      onChange={this.onSelectChange}
                      value={this.state.type_room}
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
                    onChange={this.onSelectChange}
                    value={this.state.stage}
                  >
                    {stages}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Button variant="secondary" onClick={this.onUpdate}>
              Sauvegarder
            </Button>
          </Form>
        </ModalBody>
      </>
    );
  }
}
