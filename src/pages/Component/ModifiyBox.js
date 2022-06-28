import {
  Button,
  ListGroup,
  DropdownButton,
  Dropdown,
  ButtonGroup,
  Form,
  Row,
  ModalTitle,
  Modal,
  Col,
  InputGroup,
  FormControl,
  ModalBody,
} from "react-bootstrap";
import axios from "axios";
import { isUndefined } from "lodash";
import React from "react";
import ErrorHappened from "./ErrorHappened";

export class ModifyBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      id_room: "",
      name: "",
      comment: "",
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
      id_society: localStorage.getItem("id_society"),
      tagBox: [],
      tags: [],
      selectedTag: "--Sélectionne--",
      id_box: "",
      room: [],
      EMPTY_NAME: false,

      ERROR_HAPPENED: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.addTag = this.addTag.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.loadTag = this.loadTag.bind(this);
    this.loadRoom = this.loadRoom.bind(this);
    axios
      .get(`http://localhost:3001/box/information/${this.state.id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.comment == null) {
          this.setState({
            name: res.data.name,
            id_room: res.data.id_room,
            tagBox: res.data.TagOnBox,
            id_box: res.data.id,
          });
        } else {
          this.setState({
            name: res.data.name,
            comment: res.data.comment,
            id_room: res.data.id_room,
            tagBox: res.data.TagOnBox,
            id_box: res.data.id,
          });
        }
      })
      .catch((error) => {
        if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
    axios
      .get("http://localhost:3001/tag/user", { withCredentials: true })
      .then((res) => {
        this.setState({ tags: res.data });
      })
      .catch((error) => {
        if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
    this.loadRoom();
  }
  loadRoom() {
    axios
      .get(`http://localhost:3001/room/list`, { withCredentials: true })
      .then((res) => {
        this.setState({ room: res.data, EMPTY_NAME: false });
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
  onSubmit() {
    if (this.state.name != "") {
      axios
        .post(
          `http://localhost:3001/box/update`,
          {
            id: this.state.id,
            name: this.state.name,
            comment: this.state.comment,
            id_room: this.state.id_room,
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
  onSelectChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  addTag() {
    if (isNaN(this.state.selectedTag)) return;
    axios
      .post(
        "http://localhost:3001/tag/linkbox",
        {
          id_box: this.state.id_box,
          id_tag: this.state.selectedTag,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        this.loadTag();
      })
      .catch((error) => {
        if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
  }
  deleteTag(id_box, id_tag) {
    axios
      .post(
        "http://localhost:3001/tag/user/deletelink",
        {
          id_box: id_box,
          id_tag: id_tag,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        this.loadTag();
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
      .get("http://localhost:3001/tag/box/" + this.state.id_box, {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({ tagBox: res.data });
      })
      .catch((error) => {
        if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
  }
  render() {
    var color;
    let tagSelection = (
      <InputGroup>
        <Form.Select
          aria-label="Exemple"
          name="selectedTag"
          onChange={this.onSelectChange}
        >
          <option>--Sélectionne--</option>
          {this.state.tags.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Form.Select>
        <Button variant="secondary" onClick={this.addTag}>
          Ajouter
        </Button>
      </InputGroup>
    );
    if (this.state.tagBox.length == 3)
      tagSelection = <small>Max 3 tags par box</small>;
    return (
      <>
        <Modal
          show={this.state.ERROR_HAPPENED}
          onHide={() => this.setState({ ERROR_HAPPENED: false })}
        >
          <ErrorHappened></ErrorHappened>
        </Modal>
        <ModalTitle>Modification d'une caisse</ModalTitle>
        <ModalBody>
          {" "}
          <Form>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    style={{
                      backgroundColor: this.state.EMPTY_PASSWORD
                        ? "#f7786f"
                        : " ",
                    }}
                    name="name"
                    value={this.state.name}
                    type="text"
                    onChange={this.handleChange}
                    placeholder="Exemple"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Pièce</Form.Label>
                  <Form.Select
                    aria-label="Exemple"
                    name="id_room"
                    onChange={this.onSelectChange}
                    value={this.state.id_room}
                  >
                    {this.state.room.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                        style={{
                          backgroundColor:
                            item.id_TagSociety == null
                              ? (color = "#FFFFFF")
                              : (color = item.TagSociety.color),
                        }}
                      >
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Commentaire</Form.Label>
              <Form.Control
                name="comment"
                value={this.state.comment}
                type="text"
                onChange={this.handleChange}
                placeholder="Ceci est une caisse"
              />
            </Form.Group>
            <Button variant="secondary" onClick={this.onSubmit}>
              Sauvegarder
            </Button>
          </Form>
          <br />
          <Row>
            {this.state.tagBox.map((item) => (
              <Col key={item.id_tag} md={4}>
                <InputGroup>
                  <FormControl disabled readOnly value={item.tag.name} />
                  <Button
                    variant="secondary"
                    onClick={() => this.deleteTag(item.id_box, item.id_tag)}
                  >
                    X
                  </Button>
                </InputGroup>
              </Col>
            ))}
          </Row>
          <br />
          {tagSelection}
        </ModalBody>
      </>
    );
  }
}
