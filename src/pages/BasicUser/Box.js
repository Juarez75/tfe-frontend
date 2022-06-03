import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Button,
  ListGroup,
  DropdownButton,
  Dropdown,
  ButtonGroup,
  Modal,
  ModalHeader,
  Form,
  ModalBody,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { withRouter } from "../../withRouter";
import { NavigationBar } from "../Component/NavUser";
import { ModifyObject } from "../Component/ModifyObject";

class Room_List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: parseInt(props.router.params.id),
      box: "",
      room: "",
      name: "",
      success: false,
      show: false,
      showModify: false,
      id_object: null,
      objects: [],
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
    };
    this.loadData = this.loadData.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.ifSuccess = this.ifSuccess.bind(this);
    this.cancelSuccess = this.cancelSuccess.bind(this);
    this.loadData();
  }
  loadData() {
    axios
      .get(`http://localhost:3001/box/${this.state.id}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        this.setState({
          box: res.data,
          objects: res.data.objects,
          room: res.data.room,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onDelete(id) {
    axios
      .post(
        `http://localhost:3001/object/delete`,
        {
          id: id,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        this.loadData();
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  onModify(id) {
    console.log(id);
    this.setState({ id_object: id, showModify: true });
  }
  onCreate() {
    this.setState({ show: true });
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  onSubmit(name) {
    console.log(this.state.room.id);
    axios
      .post(
        `http://localhost:3001/object/create`,
        {
          id_box: this.state.box.id,
          name: name,
          id_room: this.state.room.id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.loadData();
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  onAdd(name) {
    axios
      .post(
        `http://localhost:3001/object/create`,
        {
          id_box: this.state.box.id,
          name: name,
          id_room: this.state.room.id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.ifSuccess();
        this.loadData();
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  ifSuccess() {
    this.setState({ success: true });
    this.cancelSuccess(true);
  }
  cancelSuccess() {
    setTimeout(() => this.setState({ success: false }), 500);
  }

  render() {
    if (this.state.type == 1) return <div>Vous n'avez pas accès à ça</div>;
    var listDefault = [
      "Verre",
      "Livre",
      "Lampe",
      "Cadre",
      "Vêtements",
      "Produits de ménage",
      "Chaussures",
      "Souvenirs",
      "Assiette",
    ];
    var listBedroom = [
      "Lampe de chevet",
      "Radio réveil",
      "BD",
      "Livre",
      "Coussin",
      "Vetement",
      "Couette",
      "Peluche",
      "Cadre",
      "Tv",
      "Console de jeu",
    ];
    var listKitchen = [
      "Ustensile",
      "Couverts",
      "Casserole",
      "Verre",
      "Tupperware",
      "Tasse",
      "Passoir",
      "Bol",
      "Poele",
      "Assietes",
    ];
    var listLivingroom = [
      "Lampe",
      "Console de jeu",
      "Couverture",
      "Box Internet",
      "Décodeur",
      "Cables TV",
      "Decorations",
      "Livre",
      "Magazine",
      "DVD",
    ];
    var listOffice = [
      "Ecran",
      "Bloc de feuille",
      "Cahier",
      "Clavier",
      "Souris",
      "Bic",
      "Crayons",
      "Imprimante",
      "Farde",
    ];
    var listBathroom = [
      "Essui",
      "Gant de toilette",
      "Dentifrice",
      "Brosse à dents",
      "Ventouse",
      "Produits entretien douche",
      "Produits entretien WC",
      "Brosse à cheveux",
      "Produits de beauté",
      "Savon",
    ];
    if (this.state.typeUser == 1) <div>"Vous n'avez pas accès à ça "</div>;
    var listObjects;
    this.state.typeRoom == 1
      ? (listObjects = listBedroom)
      : this.state.typeRoom == 2
      ? (listObjects = listKitchen)
      : this.state.typeRoom == 3
      ? (listObjects = listLivingroom)
      : this.state.typeRoom == 4
      ? (listObjects = listOffice)
      : this.state.typeRoom == 5
      ? (listObjects = listBathroom)
      : (listObjects = listDefault);
    return (
      <div>
        <NavigationBar color={this.state.color} />
        <h4>Dans la box : {this.state.box.name}</h4>
        <Modal
          show={this.state.showModify}
          onHide={() => this.setState({ showModify: false })}
        >
          <ModifyObject id={this.state.id_object} />
        </Modal>
        <Modal
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
        >
          <ModalHeader>Ajouter un objet</ModalHeader>
          <ModalBody>
            <Modal
              size="sm"
              show={this.state.success}
              onHide={() => this.setState({ success: false })}
            >
              <ModalHeader
                style={{ backgroundColor: "#77DD77", color: "#00561B" }}
                closeButton
              >
                Objet ajouté !
              </ModalHeader>
            </Modal>
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
              <Button
                variant="secondary"
                onClick={() => {
                  this.onSubmit(this.state.name);
                }}
              >
                Submit
              </Button>
            </Form>
            Ajout rapide:
            {listObjects.map((item) => (
              <Button
                key={item}
                onClick={() => this.onAdd(item)}
                variant="outline-secondary"
                className="mx-1 mb-1"
              >
                {item} +
              </Button>
            ))}
          </ModalBody>
        </Modal>
        <ListGroup>
          <ListGroup.Item>
            <Button variant="outline-secondary" onClick={() => this.onCreate()}>
              Add new object
            </Button>
          </ListGroup.Item>
          {this.state.objects.map((item) => (
            <ListGroup.Item key={item.id}>
              {item.name}
              <ButtonGroup>
                <DropdownButton title="" variant="light">
                  <Dropdown.Item onClick={() => this.onModify(item.id)}>
                    Modify
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => this.onDelete(item.id)}>
                    Delete
                  </Dropdown.Item>
                </DropdownButton>
              </ButtonGroup>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    );
  }
}
export default withRouter(Room_List);
