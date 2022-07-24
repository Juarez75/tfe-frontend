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
  ModalBody,
  Breadcrumb,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { withRouter } from "../../withRouter";
import { NavigationBar } from "../Component/NavUser";
import { create, isUndefined } from "lodash";
import { ModifyRoom } from "../Component/ModifyRoom";
import { ModifyBox } from "../Component/ModifiyBox";
import Delete from "../Component/Delete";
import WrongPage from "../Component/WrongPage";
import ErrorHappened from "../Component/ErrorHappened";

class Room_List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      society_code: localStorage.getItem("society_code"),
      name: "",
      stage: "",
      comment: "",
      type_room: "",
      number_box: "",
      box: [],
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
      showModalRoom: false,
      showModalBox: false,
      showCreateBox: false,
      showDelete: false,
      id_box: "",
      tags: [],
      selectedTag: "",
      nameBox: "",
      commentBox: "",
      selectedNumber: "1",
      selectedDelete: "1",
      id_data: "",
      url_data: "",
      name_data: "",
      url_return: "",
      type_delete: "",
      EMPTY_NAME: false,
      WRONG_PAGE: false,
      ERROR_HAPPENED: false,
      isLoading: true,
    };
    this.onRoomDelete = this.onRoomDelete.bind(this);
    this.onRoomModify = this.onRoomModify.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onMultCreate = this.onMultCreate.bind(this);
    this.onBoxDelete = this.onBoxDelete.bind(this);
    this.loadData();
  }

  loadData() {
    axios
      .get(
        `http://localhost:3001/room/${parseInt(this.props.router.params.id)}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        if (res.data.id_tagSociety == null) {
          this.setState({
            id: res.data.id,
            name: res.data.name,
            comment: res.data.comment,
            type_room: res.data.type,
            stage: res.data.stage,
            box: res.data.box,
            number_box: res.data._count.box,
            isLoading: false,
          });
        } else {
          this.setState({
            name: res.data.name,
            comment: res.data.comment,
            type_room: res.data.type,
            stage: res.data.stage,
            box: res.data.box,
            selectedTag: res.data.TagSociety.color,
            number_box: res.data._count.box,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.statusText == "Unauthorized")
          this.props.router.navigate("/");
        else if (error.response.data == "WRONG_PAGE")
          this.setState({ WRONG_PAGE: true });
        else if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
  }

  onBoxDelete(id, name) {
    this.setState({
      url_data: "http://localhost:3001/box/delete",
      id_data: id,
      name_data: name,
      showDelete: true,
      url_return: `/room/${this.state.id}`,
      type_delete: 0,
    });
  }
  onBoxModify(id) {
    this.setState({ id_box: id, showModalBox: true });
  }
  onCreate() {
    this.setState({ showCreateBox: true });
  }
  onClick(id) {
    this.props.router.navigate(`/box/${id}`);
  }
  onRoomDelete() {
    this.setState({
      url_data: "http://localhost:3001/room/delete",
      id_data: this.state.id,
      name_data: this.state.name,
      showDelete: true,
      url_return: "/room/list",
      type_delete: 0,
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
        .catch((error) => {
          if (error.response.data == "ERROR") {
            this.setState({ ERROR_HAPPENED: true });
            setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
          }
        });
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
        .catch((error) => {
          if (error.response.data == "ERROR") {
            this.setState({ ERROR_HAPPENED: true });
            setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
          }
        });
    }
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  onSubmit() {
    if (this.state.name != "") {
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
        .then(() => {
          this.loadData();
          this.setState({ showCreateBox: false });
        })
        .catch(function (error) {
          if (error.response.data == "ERROR") {
            this.setState({ ERROR_HAPPENED: true });
            setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
          }
        });
    } else this.setState({ EMPTY_NAME: true });
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
        if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
  }
  onMultDelete() {
    this.setState({
      url_data: "http://localhost:3001/box/deletemany",
      id_data: this.state.id,
      name_data: this.state.selectedDelete,
      showDelete: true,
      url_return: "",
      type_delete: 1,
    });
  }

  render() {
    if (this.state.isLoading) return <></>;
    var createBox = [];
    for (var i = 1; i < 51; i++) {
      createBox.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    var deleteBox = [];
    for (var i = 1; i <= this.state.number_box; i++) {
      deleteBox.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    if (this.state.type == 1) return <div>Vous n'avez pas accès à ça</div>;
    if (this.state.WRONG_PAGE) return <WrongPage></WrongPage>;
    return (
      <div>
        <Modal
          show={this.state.ERROR_HAPPENED}
          onHide={() => this.setState({ ERROR_HAPPENED: false })}
        >
          <ErrorHappened></ErrorHappened>
        </Modal>

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
          show={this.state.showDelete}
          onHide={() => this.setState({ showDelete: false })}
        >
          <Delete
            id={this.state.id_data}
            url={this.state.url_data}
            name={this.state.name_data}
            url_return={this.state.url_return}
            type={this.state.type_delete}
          />
        </Modal>
        <Modal
          show={this.state.showCreateBox}
          onHide={() => this.setState({ showCreateBox: false })}
        >
          <ModalTitle>Créer une caisse</ModalTitle>
          <ModalBody>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicText">
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  style={{
                    backgroundColor: this.state.EMPTY_PASSWORD
                      ? "#f7786f"
                      : " ",
                  }}
                  name="nameBox"
                  value={this.state.nameBox}
                  type="text"
                  onChange={this.handleChange}
                  placeholder="Exemple"
                  maxLength={14}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicText">
                <Form.Label>Commentaire</Form.Label>
                <Form.Control
                  name="commentBox"
                  value={this.state.commentBox}
                  type="text"
                  onChange={this.handleChange}
                  placeholder="Ceci est une caisse"
                />
              </Form.Group>
              <Button variant="secondary" onClick={this.onSubmit}>
                Ajouter
              </Button>
            </Form>
          </ModalBody>
        </Modal>
        <div id="center_list">
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
          <Breadcrumb>
            <Breadcrumb.Item href="/room/list">
              Liste des pièces
            </Breadcrumb.Item>
            <Breadcrumb.Item href="#" active>
              {this.state.name}
            </Breadcrumb.Item>
          </Breadcrumb>
          <ListGroup>
            <ListGroup.Item>
              <Row>
                <Col md={2}>
                  <Button
                    variant="outline-secondary"
                    onClick={() => this.onCreate()}
                  >
                    Ajouter une caisse
                  </Button>
                </Col>
                <Col>
                  <InputGroup>
                    <Form.Label className="my-auto">
                      Ajout rapide de caisses :
                    </Form.Label>
                    <div id="multBox">
                      <div id="selectNumber">
                        <Form.Select
                          aria-label="Exemple"
                          name="selectedNumber"
                          onChange={this.handleChange}
                          value={this.state.selectedNumber}
                          id="test"
                        >
                          {createBox}
                        </Form.Select>
                      </div>

                      <Button
                        variant="outline-secondary"
                        onClick={() => this.onMultCreate()}
                      >
                        Ajouter
                      </Button>
                    </div>
                  </InputGroup>
                </Col>
                <Col md={6}>
                  <InputGroup>
                    <Form.Label className="my-auto">
                      Suppresion rapide de caisses :
                    </Form.Label>
                    <div id="multBox">
                      <div id="selectDelete">
                        <Form.Select
                          aria-label="Exemple"
                          name="selectedDelete"
                          onChange={this.handleChange}
                          value={this.state.selectedDelete}
                          id="test"
                        >
                          {deleteBox}
                        </Form.Select>
                      </div>

                      <Button
                        variant="outline-secondary"
                        onClick={() => this.onMultDelete()}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </InputGroup>
                </Col>
              </Row>
            </ListGroup.Item>

            {this.state.box.map((item) => (
              <div key={item.id}>
                <ListGroup.Item variant={item.empty ? "danger" : ""}>
                  <ButtonGroup>
                    <Button
                      variant="light"
                      onClick={() => this.onClick(item.id)}
                    >
                      {item.name}
                    </Button>
                    <DropdownButton title="" variant="light">
                      <Dropdown.Item onClick={() => this.onBoxModify(item.id)}>
                        Modifier
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => this.onBoxDelete(item.id, item.name)}
                      >
                        Supprimer
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
                    <small>Nombre d'objets: {item._count.objects}</small>
                  </div>
                  <div>
                    <small>Tag: </small>
                    {item.TagOnBox.map((item2) => (
                      <small key={item2.id_tag}> {item2.tag.name} </small>
                    ))}
                  </div>
                </ListGroup.Item>
              </div>
            ))}
          </ListGroup>
        </div>
      </div>
    );
  }
}
export default withRouter(Room_List);
