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
      box: "",
      room: "",
      objects: [],
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
    };
    this.loadData = this.loadData.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.loadData();
  }
  loadData() {
    axios
      .get(`http://localhost:3001/box/${this.state.id}`, {
        withCredentials: true,
      })
      .then((res) => {
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
    this.props.router.navigate(`/object/modify/${id}`);
  }
  onCreate() {
    this.props.router.navigate(
      "/object/create/" + this.state.id + "/" + this.state.room.type
    );
  }

  render() {
    if (this.state.type == 1) return <div>Vous n'avez pas accès à ça</div>;
    return (
      <div>
        <NavigationBar color={this.state.color} />
        <h4>Dans la box : {this.state.box.name}</h4>
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
