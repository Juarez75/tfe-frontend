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

class User_List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: [],
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
    };
    axios
      .get(`http://localhost:3001/society/users`, { withCredentials: true })
      .then((res) => {
        this.setState({ room: res.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onClick(id) {
    this.props.router.navigate(`/society/user/${id}`);
  }

  render() {
    if (this.state.type == 2) return <div>Vous n'avez pas accès à ça</div>;
    return (
      <div>
        <NavigationBarSociety color={this.state.color} />
        <h4>Liste des utilisateurs</h4>
        <ListGroup>
          {this.state.room.map((item) => (
            <ListGroup.Item key={item.id}>
              <Button variant="light" onClick={() => this.onClick(item.id)}>
                {item.firstname} {item.lastname}
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    );
  }
}
export default withRouter(User_List);
