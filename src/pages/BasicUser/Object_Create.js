import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Form,
  Button,
  Alert,
  ModalHeader,
  Modal,
  ModalBody,
} from "react-bootstrap";
import { withRouter } from "../../withRouter";
import { NavigationBar } from "../View/NavUser";
import { DEFAULT_BREAKPOINTS } from "react-bootstrap/esm/ThemeProvider";
import { delay } from "lodash";

class Box_Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id_box: parseInt(props.router.params.id),
      name: "",
      id_room: "",
      typeRoom: parseInt(props.router.params.type),
      typeUser: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
      success: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.ifSuccess = this.ifSuccess.bind(this);
    this.cancelSuccess = this.cancelSuccess.bind(this);
    axios
      .get(`http://localhost:3001/box/information/${this.state.id_box}`, {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({ id_room: res.data.id_room });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  onSubmit(name) {
    axios
      .post(
        `http://localhost:3001/object/create`,
        {
          id_box: this.state.id_box,
          name: name,
          id_room: this.state.id_room,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.props.router.navigate("/box/" + this.state.id_box);
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
          id_box: this.state.id_box,
          name: name,
          id_room: this.state.id_room,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        this.ifSuccess();
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  ifSuccess() {
    this.setState({ success: true });
    this.cancelSuccess(true);
  }
  cancelSuccess(delay) {
    setTimeout(() => this.setState({ success: false }), 500);
  }

  render() {
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
      </div>
    );
  }
}
export default withRouter(Box_Create);
