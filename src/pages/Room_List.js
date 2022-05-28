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
import { withRouter } from "../withRouter";

class Room_List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      box: [],
      mail: "marcan.gallez@std.heh.be",
      password: "marcan",
    };
    axios
      .get(`http://localhost:3001/room/list`, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        this.setState({ box: res.data });
        console.log(this.state.box);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onDelete(id) {
    console.log(id);
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
        // redirige vers le login
        this.props.router.navigate("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  onCreate() {
    this.props.router.navigate("/room/create");
  }

  onClick(id) {
    this.props.router.navigate(`/room/${id}`);
  }

  render() {
    return (
      <div>
        <ListGroup>
          <ListGroup.Item>
            <Button variant="outline-secondary" onClick={() => this.onCreate()}>
              Add new room
            </Button>
          </ListGroup.Item>
          {this.state.box.map((item) => (
            <ListGroup.Item key={item.id}>
              <ButtonGroup>
                <Button variant="light" onClick={() => this.onClick(item.id)}>
                  {item.name}
                </Button>
                <DropdownButton title="" variant="light">
                  <Dropdown.Item>Modify</Dropdown.Item>
                  <Dropdown.Item onClick={() => this.onDelete(item.id)}>
                    Delete
                  </Dropdown.Item>
                </DropdownButton>
              </ButtonGroup>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Link to="/register">Register</Link>
        <br />
        <Link to="/">Login</Link>
        <br />
        <Link to="/room/create">CreateRoom</Link>
        <br />
        <Link to="/box/create">CreateBox</Link>
        <br />
      </div>
    );
  }
}
export default withRouter(Room_List);
