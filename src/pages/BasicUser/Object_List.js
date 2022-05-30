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
import { withRouter } from "../../withRouter";
import { NavigationBar } from "../View/NavUser";

class Box_List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objects: [],
      type: localStorage.getItem("type"),
    };
    axios
      .get(`http://localhost:3001/object/list`, { withCredentials: true })
      .then((res) => {
        this.setState({ objects: res.data });
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

  render() {
    if (this.state.type == 1) return <div>Vous n'avez pas accès à ça</div>;
    return (
      <div>
        <NavigationBar />
        <h4>Liste des box</h4>
        <ListGroup>
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
              <div>
                <small>Box : {item.box.name} </small>
                <br />
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
