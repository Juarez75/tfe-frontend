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
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { withRouter } from "../../withRouter";
import { NavigationBar } from "../View/NavUser";

class Box_List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      box: [],
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
    };
    this.loadData = this.loadData.bind(this);
    this.loadData();
  }
  loadData() {
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
        <h4>Liste des box</h4>
        <ListGroup>
          {this.state.box.map((item) => (
            <ListGroup.Item variant={item.empty ? "danger" : ""} key={item.id}>
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
                <small>Pièce : {item.room.name}</small>
                <div>
                  <small>Tags :</small>
                  {item.TagOnBox.map((item2) => (
                    <small key={item2.id_tag}> {item2.tag.name} </small>
                  ))}
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    );
  }
}
export default withRouter(Box_List);
