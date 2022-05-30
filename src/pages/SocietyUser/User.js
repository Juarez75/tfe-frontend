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
    };
    axios
      .get(`http://localhost:3001/society/user/${this.state.id_user}`, {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({ room: res.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onClick(id) {
    this.props.router.navigate(`/society/room/${id}`);
  }

  render() {
    return (
      <div>
        <NavigationBarSociety />
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
