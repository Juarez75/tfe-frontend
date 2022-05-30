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
      objects: [],
      mail: "marcan.gallez@std.heh.be",
      password: "marcan",
    };
    axios
      .get(`http://localhost:3001/box/${this.state.id}`, {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({ box: res.data, objects: res.data.objects });
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
        window.location.reload(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  onModify(id) {
    this.props.router.navigate(`/object/modify/${id}`);
  }
  onCreate() {
    this.props.router.navigate("/object/create/" + this.state.id);
  }

  render() {
    return (
      <div>
        <NavigationBar />
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
