import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Button,
  ListGroup,
  DropdownButton,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { withRouter } from "../../withRouter";
import { NavigationBarSociety } from "../View/NavSociety";

class Room_List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: [],
      id_user: this.props.router.params.id,
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
    };
    axios
      .get(`http://localhost:3001/society/user/${this.state.id_user}`, {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({ room: res.data });
      })
      .catch((res) => {
        console.log(res);
      });
  }

  onClick(id) {
    this.props.router.navigate(`/society/room/${id}`);
  }

  render() {
    if (this.state.type == 2) return <div>Vous n'avez pas accès à ça</div>;
    return (
      <div>
        <NavigationBarSociety color={this.state.color} />
        <h4>Liste des pièces de l'utilisateur</h4>
        <ListGroup>
          {this.state.room.map((item) => (
            <ListGroup.Item key={item.id}>
              <ButtonGroup>
                <Button variant="light" onClick={() => this.onClick(item.id)}>
                  {item.name}
                </Button>
              </ButtonGroup>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    );
  }
}
export default withRouter(Room_List);
