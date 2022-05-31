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
import { NavigationBar } from "../View/NavUser";
import { NavigationBarSociety } from "../View/NavSociety";

class UserRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: parseInt(props.router.params.id),
      room: "",
      box: [],
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
    };
    axios
      .get(`http://localhost:3001/society/room/${this.state.id}`, {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({ room: res.data, box: res.data.box });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    if (this.state.type == 2) return <div>Vous n'avez pas accès à ça</div>;
    return (
      <div>
        <NavigationBarSociety color={this.state.color} />
        <h4>Dans la pièce : {this.state.room.name}</h4>
        <ListGroup>
          {this.state.box.map((item) => (
            <ListGroup.Item key={item.id}>{item.name}</ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    );
  }
}
export default withRouter(UserRoom);
