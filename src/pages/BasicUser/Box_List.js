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
  Modal,
  ListGroupItem,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { withRouter } from "../../withRouter";
import { NavigationBar } from "../Component/NavUser";
import { ModifyBox } from "../Component/ModifiyBox";
import Delete from "../Component/Delete";
import ErrorHappened from "../Component/ErrorHappened";

class Box_List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      box: [],
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
      show: false,
      id_box: "",
      showDelete: false,
      id_data: "",
      url_data: "",
      name_data: "",
      url_return: "",
      type_delete: "",
      id_room: "",
      ERROR_HAPPENED: false,
      isLoading: true,
      boxChecked: [],
      updateOk: false,
      room: [],
      modalRoom: false,
    };
    this.loadData = this.loadData.bind(this);
    this.checkBoxChange = this.checkBoxChange.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.deleteMany = this.deleteMany.bind(this);
    this.updateManyRoom = this.updateManyRoom.bind(this);
    this.openModalRoom = this.openModalRoom.bind(this);
    this.loadRoom = this.loadRoom.bind(this);
    this.loadData();
  }
  loadData() {
    axios
      .get(`http://localhost:3001/box/list`, { withCredentials: true })
      .then((res) => {
        this.setState({ box: res.data, isLoading: false });
        this.loadRoom();
      })
      .catch((error) => {
        if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
  }

  loadRoom() {
    axios
      .get(`http://localhost:3001/room/list`, { withCredentials: true })
      .then((res) => {
        this.setState({ room: res.data });
      })
      .catch((error) => {
        if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
  }
  onDelete(id, name) {
    this.setState({
      url_data: "http://localhost:3001/box/delete",
      id_data: id,
      name_data: name,
      showDelete: true,
      url_return: "",
      type_delete: 0,
    });
  }
  deleteMany() {
    this.setState({
      url_data: "http://localhost:3001/box/deletemany",
      id_data: this.state.boxChecked,
      name_data: this.state.boxChecked.length,
      showDelete: true,
      url_return: "",
      type_delete: 1,
    });
  }
  openModalRoom() {
    this.setState({ modalRoom: true });
  }
  updateManyRoom() {
    if (!isNaN(this.state.id_room)) {
      axios
        .post(
          "http://localhost:3001/box/updateManyRoom",
          {
            list: this.state.boxChecked,
            id_room: this.state.id_room,
          },
          { withCredentials: true }
        )
        .then(() => {
          this.ifSuccess();
          this.setState({ modalRoom: false });
          this.loadData();
        })
        .catch((error) => {
          if (error.response.data == "ERROR") {
            this.setState({ ERROR_HAPPENED: true });
            setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
          }
        });
    }
  }
  onModify(id) {
    this.setState({ id_box: id, show: true });
  }
  onCreate() {
    this.props.router.navigate("/box/create");
  }

  onClick(id) {
    this.props.router.navigate(`/box/${id}`);
  }
  updateFragile(data, id) {
    axios
      .post(
        "http://localhost:3001/box/fragile",
        {
          id: id,
          fragile: data,
        },
        { withCredentials: true }
      )
      .then(() => this.loadData(this.state.search))
      .catch((error) => {
        if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
  }
  checkBoxChange(event) {
    var array = [];
    var e;
    if (event.target.checked) {
      array = this.state.boxChecked.concat(parseInt(event.target.id));
    } else {
      array = this.state.boxChecked.filter(
        (i) => i !== parseInt(event.target.id)
      );
    }
    this.setState({ boxChecked: array });
    if (array.length == 0) {
      e = document.getElementById("selectAll");
      e.checked = false;
    } else if (array.length == this.state.box.length) {
      e = document.getElementById("selectAll");
      e.checked = true;
    }
  }
  ifSuccess() {
    this.setState({ updateOk: true });
    this.cancelSuccess();
  }
  cancelSuccess() {
    setTimeout(() => this.setState({ updateOk: false }), 500);
  }
  selectAll(event) {
    var array = [];
    var e;
    if (event.target.checked) {
      this.state.box.map((item) => {
        array.push(item.id);
        e = document.getElementById(item.id);
        e.checked = event.target.checked;
      });
    } else {
      array = [];
      this.state.box.map((item) => {
        e = document.getElementById(item.id);
        e.checked = event.target.checked;
      });
    }

    this.setState({ boxChecked: array });
  }

  render() {
    if (this.state.type == 1) return <div>Vous n'avez pas accès à ça</div>;
    if (this.state.isLoading) return <></>;
    return (
      <div>
        <Modal
          show={this.state.updateOk}
          onHide={() => this.setState({ updateOk: false })}
        >
          <ModalHeader
            style={{ backgroundColor: "#77DD77", color: "#00561B" }}
            closeButton
          >
            Modification effectuée !
          </ModalHeader>
        </Modal>
        <Modal
          show={this.state.modalRoom}
          onHide={() => this.setState({ modalRoom: false })}
        >
          <ModalHeader closeButton>Changer de pièce</ModalHeader>
          <ModalBody>
            <Form.Select
              aria-label="Exemple"
              className="mx-1 "
              name=""
              style={{ maxWidth: "40vh" }}
              onChange={(event) => {
                this.setState({ id_room: event.target.value });
                console.log(event.target.value);
              }}
            >
              <option>--Sélectionne--</option>
              {this.state.room.map((item, i) => (
                <option key={i} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Form.Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline-success" onClick={this.updateManyRoom}>
              Sauvegarder
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => this.setState({ modalRoom: false })}
            >
              Annuler
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          show={this.state.ERROR_HAPPENED}
          onHide={() => this.setState({ ERROR_HAPPENED: false })}
        >
          <ErrorHappened></ErrorHappened>
        </Modal>
        <NavigationBar color={this.state.color} />
        <div id="center_list">
          <h4>Liste des caisses</h4>
          <Modal
            show={this.state.show}
            onHide={() => this.setState({ show: false })}
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
          <ListGroup>
            <ListGroup.Item>
              <Form.Check
                type="checkbox"
                onChange={(e) => this.selectAll(e)}
                style={{ marginRight: 20 }}
                label="Tout sélectionner"
                id="selectAll"
              />
              {this.state.boxChecked.length != 0 ? (
                <>
                  <h5>Caisses sélectionnées :</h5>
                  <Button
                    style={{ marginRight: 10, marginTop: 10 }}
                    variant="outline-secondary"
                    onClick={() => this.openModalRoom()}
                  >
                    Changer de pièce
                  </Button>
                  <Button
                    style={{ marginRight: 10, marginTop: 10 }}
                    variant="outline-danger"
                    onClick={() => this.deleteMany}
                  >
                    Supprimer les caisses
                  </Button>
                </>
              ) : (
                ""
              )}
            </ListGroup.Item>

            {this.state.box.map((item) => (
              <ListGroup.Item
                variant={
                  item.state == 2
                    ? "danger"
                    : "" || item.state == 1
                    ? "success"
                    : ""
                }
                key={item.id}
              >
                <ButtonGroup>
                  <Form.Check
                    type="checkbox"
                    id={item.id}
                    onChange={(event) => this.checkBoxChange(event)}
                    style={{ alignItems: "center", marginRight: 20 }}
                  />
                  <Button variant="light" onClick={() => this.onClick(item.id)}>
                    {item.name}
                  </Button>
                  <DropdownButton title="" variant="light">
                    <Dropdown.Item onClick={() => this.onModify(item.id)}>
                      Modifier
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => this.onDelete(item.id, item.name)}
                    >
                      Supprimer
                    </Dropdown.Item>
                  </DropdownButton>
                  <small className="my-auto ms-3">
                    {item.state == 2
                      ? "Vidée"
                      : "" || item.state == 1
                      ? "Déménagée"
                      : ""}
                  </small>
                  <Form.Check
                    className="my-auto ms-3"
                    label="Fragile"
                    checked={item.fragile}
                    onChange={() =>
                      this.updateFragile(
                        (item.fragile = !item.fragile),
                        item.id
                      )
                    }
                  />
                </ButtonGroup>
                <div>
                  <small>Pièce : {item.room.name}</small>
                  <br />
                  <small>Nombre d'objets: {item._count.objects}</small>
                  <div>
                    <small>Tag :</small>
                    {item.TagOnBox.map((item2) => (
                      <small key={item2.id_tag}> {item2.tag.name} </small>
                    ))}
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    );
  }
}
export default withRouter(Box_List);
