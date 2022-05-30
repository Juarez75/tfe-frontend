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

class Box_List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      box: [],
    };
    axios
      .get(`http://localhost:3001/box/list`, { withCredentials: true })
      .then((res) => {
        this.setState({ box: res.data });
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
    this.props.router.navigate("/box/create");
  }

  onClick(id) {
    this.props.router.navigate(`/box/${id}`);
  }

  render() {
    return (
      <div>
        <NavigationBar />
        <h4>Liste des box</h4>
        <ListGroup>
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
              <div>
                <small>Pièce : {item.room.name}</small>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Link to="/register">Register</Link>
        <br />
        <Link to="/">Login</Link>
        <br />
        <Link to="/box/create">Createbox</Link>
        <br />
        <Link to="/box/create">CreateBox</Link>
        <br />
      </div>
    );
  }
}
export default withRouter(Box_List);
