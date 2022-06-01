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
      tag: [],
      search: "",
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
    };
    this.handleChange = this.handleChange.bind(this);
    this.loadData = this.loadData.bind(this);
    this.updateEmpty = this.updateEmpty.bind(this);
  }
  loadData(search) {
    if (search !== "") {
      axios
        .post(
          "http://localhost:3001/search",
          {
            search: search,
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
            tag: res.data.tag,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      this.setState({ room: [], box: [], object: [], tag: [] });
    }
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    this.loadData(event.target.value);
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
      .then(() => this.loadData(this.state.search))
      .catch((error) => console.log(error));
  }
  render() {
    if (this.state.type == 1) return <div>Vous n'avez pas accès à ça</div>;
    return (
      <div>
        <NavigationBar color={this.state.color} />
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
            <ListGroup.Item key={item.id} variant={item.empty ? "danger" : ""}>
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
        <h5>Box contenant Tag correspondant :</h5>
        <ListGroup>
          {this.state.tag.map((item) => (
            <>
              {item.link.map((item2) => (
                <ListGroup.Item
                  key={item2.id_box}
                  variant={item2.box.empty ? "danger" : ""}
                >
                  {item2.box.name}
                  <ButtonGroup>
                    <DropdownButton title="" variant="light">
                      <Dropdown.Item
                        onClick={() => this.onModify(item2.box.id, "box")}
                      >
                        Modify
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => this.onDelete(item2.box.id, "box")}
                      >
                        Delete
                      </Dropdown.Item>
                    </DropdownButton>
                    <Form.Check
                      className="my-auto ms-3"
                      label="Vidée"
                      checked={item2.box.empty}
                      onChange={() =>
                        this.updateEmpty(
                          (item2.box.empty = !item2.box.empty),
                          item2.box.id
                        )
                      }
                    />
                  </ButtonGroup>
                  <div>
                    <small>Pièce : {item2.box.room.name}</small>
                  </div>
                  <div>
                    <small>Tag : {item.name}</small>
                  </div>
                </ListGroup.Item>
              ))}
            </>
          ))}
        </ListGroup>
      </div>
    );
  }
}
export default withRouter(Search);
