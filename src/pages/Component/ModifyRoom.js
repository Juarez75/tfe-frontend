import {
  Button,
  Form,
  Row,
  ModalTitle,
  Col,
  InputGroup,
  FormControl,
  ModalBody,
} from "react-bootstrap";
import axios from "axios";
import { isUndefined } from "lodash";
import React from "react";

export class ModifyRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: parseInt(props.id),
      society_code: localStorage.getItem("society_code"),
      name: "",
      stage: "",
      comment: "",
      type_room: "",
      box: [],
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
      show: false,
      tags: [],
      selectedTag: "",
    };
    this.loadData = this.loadData.bind(this);
    this.loadTag = this.loadTag.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.loadData();
  }
  loadData() {
    axios
      .get(`http://localhost:3001/room/${this.state.id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (isUndefined(res.data.TagOnRoom[0])) {
          this.setState({
            name: res.data.name,
            comment: res.data.comment,
            type_room: res.data.type,
            stage: res.data.stage,
            box: res.data.box,
          });
        } else {
          this.setState({
            room: res.data,
            box: res.data.box,
            selectedTag: res.data.TagOnRoom[0].tag,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
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
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  onSelectChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  onUpdate() {
    axios
      .post(
        `http://localhost:3001/room/update`,
        {
          id: this.state.id,
          name: this.state.name,
          comment: this.state.comment,
          type: this.state.type_room,
          stage: this.state.stage,
          tag: this.state.selectedTag,
        },
        { withCredentials: true }
      )
      .then((res) => {
        window.location.reload(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  deleteTag() {
    axios
      .post(
        "http://localhost:3001/tag/deletelinkroom",
        {
          id_room: this.state.id,
          id_tag: this.state.selectedTag.id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.setState({ selectedTag: "" });
        this.loadData();
      })
      .catch((error) => {
        console.log(error);
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

    if (this.state.society_code != 0) {
      this.loadTag();
      if (this.state.selectedTag == "")
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
                style={{ backgroundColor: this.state.selectedTag.color }}
                disabled
                readOnly
                value={this.state.selectedTag.name}
              />
              <Button variant="secondary" onClick={() => this.deleteTag()}>
                X
              </Button>
            </InputGroup>
          </>
        );
    }

    var stages = [];
    for (var i = 0; i < 164; i++) {
      stages.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return (
      <>
        <ModalTitle className="mx-1">Modifier la pièce</ModalTitle>
        <ModalBody>
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
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Etage</Form.Label>
                  <Form.Select
                    aria-label="Exemple"
                    name="stage"
                    onChange={this.onSelectChange}
                    value={this.state.stage}
                    htmlSize={4}
                  >
                    {stages}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Button variant="secondary" onClick={this.onUpdate}>
              Submit
            </Button>
          </Form>
        </ModalBody>
      </>
    );
  }
}
