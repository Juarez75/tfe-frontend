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
  ModalBody,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { withRouter } from "../../withRouter";
import { NavigationBar } from "../Component/NavUser";
import { isUndefined } from "lodash";
import { ModifyRoom } from "../Component/ModifyRoom";
import { ModifyBox } from "../Component/ModifiyBox";

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
      showModalRoom: false,
      showModalBox: false,
      showCreateBox: false,
      id_box: "",
      tags: [],
      selectedTag: "",
      nameBox: "",
      commentBox: "",
      selectedNumber: "1",
    };
    this.onRoomDelete = this.onRoomDelete.bind(this);
    this.onRoomModify = this.onRoomModify.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onMultCreate = this.onMultCreate.bind(this);
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
    this.setState({ id_box: id, showModalBox: true });
  }
  onCreate() {
    this.setState({ showCreateBox: true });
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
    this.setState({ showModalRoom: true });
  }
  updateEmpty(data, id, empty) {
    if (empty) {
      axios
        .post(
          "http://localhost:3001/box/empty",
          {
            id: id,
            empty: data,
          },
          { withCredentials: true }
        )
        .then(() => this.loadData())
        .catch((error) => console.log(error));
    } else {
      axios
        .post(
          "http://localhost:3001/box/fragile",
          {
            id: id,
            fragile: data,
          },
          { withCredentials: true }
        )
        .then(() => this.loadData())
        .catch((error) => console.log(error));
    }
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  onSubmit() {
    axios
      .post(
        `http://localhost:3001/box/create`,
        {
          id_room: this.state.id,
          name: this.state.nameBox,
          comment: this.state.commentBox,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.loadData();
        this.setState({ showCreateBox: false });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  onMultCreate() {
    axios
      .post(
        "http://localhost:3001/box/createmany",
        {
          id_room: this.state.id,
          number: this.state.selectedNumber,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.loadData();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  onSelectChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    var stages = [];
    for (var i = 1; i < 51; i++) {
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
        <Modal
          show={this.state.showModalRoom}
          onHide={() => this.setState({ showModalRoom: false })}
        >
          <ModifyRoom id={this.state.id} />
        </Modal>
        <Modal
          show={this.state.showModalBox}
          onHide={() => this.setState({ showModalBox: false })}
        >
          <ModifyBox id={this.state.id_box} />
        </Modal>
        <Modal
          show={this.state.showCreateBox}
          onHide={() => this.setState({ showCreateBox: false })}
        >
          <ModalTitle>Créer une box</ModalTitle>
          <ModalBody>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicText">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="nameBox"
                  value={this.state.nameBox}
                  type="text"
                  onChange={this.handleChange}
                  placeholder="Enter name"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicText">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  name="commentBox"
                  value={this.state.commentBox}
                  type="text"
                  onChange={this.handleChange}
                  placeholder="Enter comment"
                />
              </Form.Group>
              <Button variant="secondary" onClick={this.onSubmit}>
                Submit
              </Button>
            </Form>
          </ModalBody>
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
            <Row>
              <Col md={2}>
                <Button
                  variant="outline-secondary"
                  onClick={() => this.onCreate()}
                >
                  Add new box
                </Button>
              </Col>
              <Col>
                <InputGroup>
                  <Form.Label className="my-auto">
                    Ajout rapide de caisse :
                  </Form.Label>
                  <div id="selectNumber">
                    <Form.Select
                      aria-label="Exemple"
                      name="selectedNumber"
                      onChange={this.onSelectChange}
                      value={this.state.selectedNumber}
                      id="test"
                    >
                      {stages}
                    </Form.Select>
                  </div>

                  <Button
                    variant="outline-secondary"
                    onClick={() => this.onMultCreate()}
                  >
                    Ajouter
                  </Button>
                </InputGroup>
              </Col>
            </Row>
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
                      this.updateEmpty(
                        (item.empty = !item.empty),
                        item.id,
                        true
                      )
                    }
                  />
                  <Form.Check
                    className="my-auto ms-3"
                    label="Fragile"
                    checked={item.fragile}
                    onChange={() =>
                      this.updateEmpty(
                        (item.fragile = !item.fragile),
                        item.id,
                        false
                      )
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
