import React from "react";
import { withRouter } from "../../withRouter";
import {
  ListGroup,
  Form,
  ButtonGroup,
  DropdownButton,
  Dropdown,
  Button,
} from "react-bootstrap";
import axios from "axios";
import { NavigationBar } from "../View/NavUser";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: [],
      box: [],
      object: [],
      search: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.value !== "") {
      axios
        .post(
          "http://localhost:3001/search",
          {
            search: event.target.value,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          this.setState({
            room: res.data.room,
            box: res.data.box,
            object: res.data.object,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      this.setState({ room: [], box: [], object: [] });
    }
  }
  onClick(id, name) {
    this.props.router.navigate("/" + name + "/" + id);
  }
  onModify(id, name) {
    this.props.router.navigate("/" + name + "/modify/" + id);
  }
  onDelete(id, name) {
    axios
      .post(
        "http://localhost:3001/" + name + "/delete",
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
  render() {
    return (
      <div>
        <NavigationBar />
        <h4>Recherche</h4>
        <Form.Control
          name="search"
          value={this.state.search}
          type="text"
          onChange={this.handleChange}
          placeholder="Search"
        />
        <h5>Pièces :</h5>
        <ListGroup>
          {this.state.room.map((item) => (
            <ListGroup.Item key={item.id}>
              <ButtonGroup>
                <Button
                  variant="light"
                  onClick={() => this.onClick(item.id, "room")}
                >
                  {item.name}
                </Button>
                <DropdownButton title="" variant="light">
                  <Dropdown.Item onClick={() => this.onModify(item.id, "room")}>
                    Modify
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => this.onDelete(item.id, "room")}>
                    Delete
                  </Dropdown.Item>
                </DropdownButton>
              </ButtonGroup>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <h5>Caisse :</h5>
        <ListGroup>
          {this.state.box.map((item) => (
            <ListGroup.Item key={item.id}>
              <ButtonGroup>
                <Button
                  variant="light"
                  onClick={() => this.onClick(item.id, "box")}
                >
                  {item.name}
                </Button>
                <DropdownButton title="" variant="light">
                  <Dropdown.Item onClick={() => this.onModify(item.id, "box")}>
                    Modify
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => this.onDelete(item.id, "box")}>
                    Delete
                  </Dropdown.Item>
                </DropdownButton>
              </ButtonGroup>
              <div>
                <small>Pièce : {item.room.name}</small>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <h5>Objets :</h5>
        <ListGroup>
          {this.state.object.map((item) => (
            <ListGroup.Item key={item.id}>
              {item.name}
              <ButtonGroup>
                <DropdownButton title="" variant="light">
                  <Dropdown.Item
                    onClick={() => this.onModify(item.id, "object")}
                  >
                    Modify
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => this.onDelete(item.id, "object")}
                  >
                    Delete
                  </Dropdown.Item>
                </DropdownButton>
              </ButtonGroup>
              <div>
                <small>Box : {item.box.name} </small>
                <br />
                <small>Pièce : {item.room.name}</small>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    );
  }
}
export default withRouter(Search);
