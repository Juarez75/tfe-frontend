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

class Room_List extends React.Component {
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
      .get(`http://localhost:3001/room/${this.state.id}`, {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({ room: res.data, box: res.data.box });
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

  render() {
    if (this.state.type == 1) return <div>Vous n'avez pas accès à ça</div>;
    return (
      <div>
        <NavigationBar color={this.state.color} />
        <h4>Dans la pièce : {this.state.room.name}</h4>
        <ListGroup>
          <ListGroup.Item>
            <Button variant="outline-secondary" onClick={() => this.onCreate()}>
              Add new box
            </Button>
          </ListGroup.Item>
          {this.state.box.map((item) => (
            <ListGroup.Item key={item.id}>
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
              </ButtonGroup>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    );
  }
}
export default withRouter(Room_List);
