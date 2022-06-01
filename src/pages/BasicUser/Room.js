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
  Row,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { withRouter } from "../../withRouter";
import { NavigationBar } from "../View/NavUser";
import { isCompositeComponent } from "react-dom/test-utils";

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
    this.onRoomDelete = this.onRoomDelete.bind(this);
    this.onRoomModify = this.onRoomModify.bind(this);
    this.loadData = this.loadData.bind(this);
    this.loadData();
  }

  loadData() {
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

  onRoomDelete(id) {
    axios
      .post(
        `http://localhost:3001/room/delete`,
        {
          id: id,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        this.props.router.navigate("/room/list");
      })
      .catch(function (error) {
        console.log(error.message);
      });
  }
  onRoomModify(id) {
    this.props.router.navigate(`/room/modify/${id}`);
  }
  updateEmpty(empty, id) {
    axios
      .post(
        "http://localhost:3001/box/empty",
        {
          id: id,
          empty: empty,
        },
        { withCredentials: true }
      )
      .then(() => this.loadData())
      .catch((error) => console.log(error));
  }

  render() {
    if (this.state.type == 1) return <div>Vous n'avez pas accès à ça</div>;
    return (
      <div>
        <NavigationBar color={this.state.color} />
        <h4>
          Dans la pièce : {this.state.room.name}{" "}
          <ButtonGroup>
            {" "}
            <Button onClick={this.onRoomModify} variant="light">
              Modifier
            </Button>
            <Button variant="light" onClick={this.onRoomDelete}>
              Supprimer
            </Button>
          </ButtonGroup>
        </h4>
        <ListGroup>
          <ListGroup.Item>
            <Button variant="outline-secondary" onClick={() => this.onCreate()}>
              Add new box
            </Button>
          </ListGroup.Item>
          {this.state.box.map((item) => (
            <div key={item.id}>
              <ListGroup.Item variant={item.empty ? "danger" : ""}>
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
                  {"  "}
                  <Form.Check
                    className="my-auto ms-3"
                    label="Vidée"
                    checked={item.empty}
                    onChange={() =>
                      this.updateEmpty((item.empty = !item.empty), item.id)
                    }
                  />
                </ButtonGroup>
                <div>
                  <small>Tags :</small>
                  {item.TagOnBox.map((item2) => (
                    <small key={item2.id_tag}> {item2.tag.name} </small>
                  ))}
                </div>
              </ListGroup.Item>
            </div>
          ))}
        </ListGroup>
      </div>
    );
  }
}
export default withRouter(Room_List);
