import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { withRouter } from "../../withRouter";
import { NavigationBar } from "../View/NavUser";
import { isUndefined } from "lodash";

class Room_List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: parseInt(props.router.params.id),
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
    this.onRoomDelete = this.onRoomDelete.bind(this);
    this.onRoomModify = this.onRoomModify.bind(this);
    this.loadData = this.loadData.bind(this);
    this.loadTag = this.loadTag.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.loadData();
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
        this.loadData();
        this.setState({ show: false });
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
  onDelete(id) {
    axios
      .post(
        `http://localhost:3001/box/delete`,
        {
          id: id,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        window.location.reload(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  onModify(id) {
    this.props.router.navigate(`/box/modify/${id}`);
  }
  onCreate() {
    this.props.router.navigate("/box/create/" + this.state.id);
  }
  onClick(id) {
    this.props.router.navigate(`/box/${id}`);
  }
  onRoomDelete() {
    axios
      .post(
        `http://localhost:3001/room/delete`,
        {
          id: this.state.id,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        this.props.router.navigate("/room/list");
      })
      .catch(function (error) {
        console.log(error.message);
      });
  }
  onRoomModify() {
    this.setState({ show: true });
  }
  updateEmpty(empty, id) {
    axios
      .post(
        "http://localhost:3001/box/empty",
        {
          id: id,
          empty: empty,
        },
        { withCredentials: true }
      )
      .then(() => this.loadData())
      .catch((error) => console.log(error));
  }

  render() {
    if (this.state.type == 1) return <div>Vous n'avez pas accès à ça</div>;
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
      if (this.state.selectedTag == null)
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
      <div>
        <NavigationBar color={this.state.color} />
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
                      name="type_room"
                      onChange={this.onSelectChange}
                      defaultValue={this.state.type_room}
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
            <Button variant="secondary" onClick={this.onUpdate}>
              Submit
            </Button>
          </Form>
        </Modal>
        <h4>
          Dans la pièce : {this.state.name}{" "}
          <ButtonGroup>
            {" "}
            <Button onClick={this.onRoomModify} variant="light">
              Modifier
            </Button>
            <Button variant="light" onClick={this.onRoomDelete}>
              Supprimer
            </Button>
          </ButtonGroup>
        </h4>
        <ListGroup>
          <ListGroup.Item>
            <Button variant="outline-secondary" onClick={() => this.onCreate()}>
              Add new box
            </Button>
          </ListGroup.Item>
          {this.state.box.map((item) => (
            <div key={item.id}>
              <ListGroup.Item variant={item.empty ? "danger" : ""}>
                <ButtonGroup>
                  <Button variant="light" onClick={() => this.onClick(item.id)}>
                    {item.name}
                  </Button>
                  <DropdownButton title="" variant="light">
                    <Dropdown.Item onClick={() => this.onModify(item.id)}>
                      Modify
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => this.onDelete(item.id)}>
                      Delete
                    </Dropdown.Item>
                  </DropdownButton>
                  {"  "}
                  <Form.Check
                    className="my-auto ms-3"
                    label="Vidée"
                    checked={item.empty}
                    onChange={() =>
                      this.updateEmpty((item.empty = !item.empty), item.id)
                    }
                  />
                </ButtonGroup>
                <div>
                  <small>Tags :</small>
                  {item.TagOnBox.map((item2) => (
                    <small key={item2.id_tag}> {item2.tag.name} </small>
                  ))}
                </div>
              </ListGroup.Item>
            </div>
          ))}
        </ListGroup>
      </div>
    );
  }
}
export default withRouter(Room_List);
