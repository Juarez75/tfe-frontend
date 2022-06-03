import React from "react";
import { withRouter } from "../../withRouter";
import {
  ListGroup,
  Form,
  ButtonGroup,
  DropdownButton,
  Dropdown,
  Button,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import { NavigationBar } from "../Component/NavUser";
import { ModifyObject } from "../Component/ModifyObject";
import { ModifyRoom } from "../Component/ModifyRoom";
import { ModifyBox } from "../Component/ModifiyBox";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: [],
      box: [],
      object: [],
      tag: [],
      search: "",
      id: null,
      showBox: false,
      showRoom: false,
      showObject: false,
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
  onModify(id, type) {
    // type 0 => Room | type 1 => Box | type 2 => Object
    if (type == 0) this.setState({ id: id, showRoom: true });
    else if (type == 1) this.setState({ id: id, showBox: true });
    else if (type == 2) this.setState({ id: id, showObject: true });
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
  updateEmpty(data, id, empty) {
    if (empty) {
      axios
        .post(
          "http://localhost:3001/box/empty",
          {
            id: id,
            empty: data,
          },
          { withCredentials: true }
        )
        .then(() => this.loadData(this.state.search))
        .catch((error) => console.log(error));
    } else {
      axios
        .post(
          "http://localhost:3001/box/fragile",
          {
            id: id,
            fragile: data,
          },
          { withCredentials: true }
        )
        .then(() => this.loadData(this.state.search))
        .catch((error) => console.log(error));
    }
  }
  render() {
    if (this.state.type == 1) return <div>Vous n'avez pas accès à ça</div>;
    return (
      <div>
        <NavigationBar color={this.state.color} />
        <h4>Recherche</h4>
        <Modal
          show={this.state.showRoom}
          onHide={() => this.setState({ showRoom: false })}
        >
          <ModifyRoom id={this.state.id} />
        </Modal>
        <Modal
          show={this.state.showBox}
          onHide={() => this.setState({ showBox: false })}
        >
          <ModifyBox id={this.state.id} />
        </Modal>
        <Modal
          show={this.state.showObject}
          onHide={() => this.setState({ showObject: false })}
        >
          <ModifyObject id={this.state.id} />
        </Modal>
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
                  <Dropdown.Item onClick={() => this.onModify(item.id, 0)}>
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
                  <Dropdown.Item onClick={() => this.onModify(item.id, 1)}>
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
                    this.updateEmpty((item.empty = !item.empty), item.id, true)
                  }
                />
                <Form.Check
                  className="my-auto ms-3"
                  label="Fragile"
                  checked={item.fragile}
                  onChange={() =>
                    this.updateEmpty(
                      (item.fragile = !item.fragile),
                      item.id,
                      false
                    )
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
              <Button
                variant="light"
                onClick={() => this.onClick(item.id_box, "box")}
              >
                {item.name}
              </Button>
              <ButtonGroup>
                <DropdownButton title="" variant="light">
                  <Dropdown.Item onClick={() => this.onModify(item.id, 2)}>
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
                          item2.box.id,
                          true
                        )
                      }
                    />
                    <Form.Check
                      className="my-auto ms-3"
                      label="Fragile"
                      checked={item2.box.fragile}
                      onChange={() =>
                        this.updateEmpty(
                          (item2.box.fragile = !item2.box.fragile),
                          item2.box.id,
                          false
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
