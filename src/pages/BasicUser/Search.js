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
import Delete from "../Component/Delete";
import ErrorHappened from "../Component/ErrorHappened";

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
      showDelete: false,
      id_data: "",
      url_data: "",
      name_data: "",
      url_return: "",
      type_delete: "",
      ERROR_HAPPENED: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.loadData = this.loadData.bind(this);
    this.updateFragile = this.updateFragile.bind(this);
    this.timer = null;
  }
  loadData(search) {
    if (search != "") {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
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
          .catch((error) => {
            if (error.response.statusText == "Unauthorized")
              this.props.router.navigate("/");
            else if (error.response.data == "ERROR") {
              this.setState({ ERROR_HAPPENED: true });
              setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
            }
          });
      }, 300);
    } else {
      clearTimeout(this.timer);
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
  onDelete(id, type, name) {
    this.setState({
      url_data: `http://localhost:3001/${type}/delete`,
      id_data: id,
      name_data: name,
      showDelete: true,
      url_return: "",
      type_delete: 0,
    });
  }
  updateFragile(data, id) {
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
      .catch((error) => {
        if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
  }
  render() {
    if (this.state.type == 1) return <div>Vous n'avez pas accès à ça</div>;
    return (
      <div>
        <Modal
          show={this.state.ERROR_HAPPENED}
          onHide={() => this.setState({ ERROR_HAPPENED: false })}
        >
          <ErrorHappened></ErrorHappened>
        </Modal>
        <NavigationBar color={this.state.color} />
        <div id="center_list">
          {" "}
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
            show={this.state.showDelete}
            onHide={() => this.setState({ showDelete: false })}
          >
            <Delete
              id={this.state.id_data}
              url={this.state.url_data}
              name={this.state.name_data}
              url_return={this.state.url_return}
              type={this.state.type_delete}
            />
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
            placeholder="Exemple"
          />
          {/* Pièces */}
          {this.state.room[0] == undefined ? "" : <h5>Pièces :</h5>}
          <ListGroup>
            {this.state.room.map((item, i) => (
              <ListGroup.Item key={i}>
                <ButtonGroup>
                  <Button
                    variant="light"
                    onClick={() => this.onClick(item.id, "room")}
                  >
                    {item.name}
                  </Button>
                  <DropdownButton title="" variant="light">
                    <Dropdown.Item onClick={() => this.onModify(item.id, 0)}>
                      Modifier
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => this.onDelete(item.id, "room", item.name)}
                    >
                      Supprimer
                    </Dropdown.Item>
                  </DropdownButton>
                </ButtonGroup>
                <br />
                <small>Nombre de box: {item._count.box}</small>
              </ListGroup.Item>
            ))}
          </ListGroup>
          {/* Caisse */}
          {this.state.box[0] == undefined ? "" : <h5>Caisses :</h5>}
          <ListGroup>
            {this.state.box.map((item, i) => (
              <ListGroup.Item
                key={i}
                variant={
                  item.state == 2
                    ? "danger"
                    : "" || item.state == 1
                    ? "success"
                    : ""
                }
              >
                <ButtonGroup>
                  <Button
                    variant="light"
                    onClick={() => this.onClick(item.id, "box")}
                  >
                    {item.name}
                  </Button>
                  <DropdownButton title="" variant="light">
                    <Dropdown.Item onClick={() => this.onModify(item.id, 1)}>
                      Modifier
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => this.onDelete(item.id, "box", item.name)}
                    >
                      Supprimer
                    </Dropdown.Item>
                  </DropdownButton>
                  <small className="my-auto ms-3">
                    {item.state == 2
                      ? "Vidée"
                      : "" || item.state == 1
                      ? "Déménagée"
                      : ""}
                  </small>
                  <Form.Check
                    className="my-auto ms-3"
                    label="Fragile"
                    checked={item.fragile}
                    onChange={() =>
                      this.updateFragile(
                        (item.fragile = !item.fragile),
                        item.id
                      )
                    }
                  />
                </ButtonGroup>
                <br />
                <small>Nombre d'objets: {item._count.objects}</small>
                <div>
                  <small>Pièce : {item.room.name}</small>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          {/* Objet */}
          {this.state.object[0] == undefined ? "" : <h5>Objets :</h5>}
          <ListGroup>
            {this.state.object.map((item, i) => (
              <ListGroup.Item key={i}>
                <Button
                  variant="light"
                  onClick={() => this.onClick(item.id_box, "box")}
                >
                  {item.name}
                </Button>
                <ButtonGroup>
                  <DropdownButton title="" variant="light">
                    <Dropdown.Item onClick={() => this.onModify(item.id, 2)}>
                      Modifier
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        this.onDelete(item.id, "object", item.name)
                      }
                    >
                      Supprimer
                    </Dropdown.Item>
                  </DropdownButton>
                </ButtonGroup>
                <div>
                  <small>Caisse : {item.box.name} </small>
                  <br />
                  <small>Pièce : {item.box.room.name}</small>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          {/* Tags */}
          {this.state.tag[0] == undefined ? (
            ""
          ) : (
            <h5>Caisse contenant le tag correspondant :</h5>
          )}
          <ListGroup>
            {this.state.tag.map((item, i) => (
              <div key={i}>
                {item.link.map((item2, i2) => (
                  <ListGroup.Item
                    key={i2}
                    variant={item2.box.empty ? "danger" : ""}
                  >
                    <ButtonGroup>
                      <Button
                        variant="light"
                        onClick={() => this.onClick(item2.box.id, "box")}
                      >
                        {item2.box.name}
                      </Button>
                      <DropdownButton title="" variant="light">
                        <Dropdown.Item
                          onClick={() => this.onModify(item2.box.id, "box")}
                        >
                          Modifier
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            this.onDelete(item2.box.id, "box", item2.box.name)
                          }
                        >
                          Supprimer
                        </Dropdown.Item>
                      </DropdownButton>
                      <small className="my-auto ms-3">
                        {item.state == 2
                          ? "Vidée"
                          : "" || item.state == 1
                          ? "Déménagée"
                          : ""}
                      </small>
                      <Form.Check
                        className="my-auto ms-3"
                        label="Fragile"
                        checked={item2.box.fragile}
                        onChange={() =>
                          this.updateFragile(
                            (item2.box.fragile = !item2.box.fragile),
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
              </div>
            ))}
          </ListGroup>
        </div>
      </div>
    );
  }
}
export default withRouter(Search);
