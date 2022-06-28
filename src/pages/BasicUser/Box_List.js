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
  Modal,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { withRouter } from "../../withRouter";
import { NavigationBar } from "../Component/NavUser";
import { ModifyBox } from "../Component/ModifiyBox";
import Delete from "../Component/Delete";
import ErrorHappened from "../Component/ErrorHappened";

class Box_List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      box: [],
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
      show: false,
      id_box: "",
      showDelete: false,
      id_data: "",
      url_data: "",
      name_data: "",
      url_return: "",
      type_delete: "",
      ERROR_HAPPENED: false,
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
      .catch((error) => {
        if (error.response.statusText == "Unauthorized")
          this.props.router.navigate("/");
        else if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
  }

  onDelete(id, name) {
    this.setState({
      url_data: "http://localhost:3001/box/delete",
      id_data: id,
      name_data: name,
      showDelete: true,
      url_return: "",
      type_delete: 0,
    });
  }
  onModify(id) {
    this.setState({ id_box: id, show: true });
  }
  onCreate() {
    this.props.router.navigate("/box/create");
  }

  onClick(id) {
    this.props.router.navigate(`/box/${id}`);
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
        .then(() => this.loadData())
        .catch((error) => {
          if (error.response.data == "ERROR") {
            this.setState({ ERROR_HAPPENED: true });
            setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
          }
        });
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
        .then(() => this.loadData())
        .catch((error) => {
          if (error.response.data == "ERROR") {
            this.setState({ ERROR_HAPPENED: true });
            setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
          }
        });
    }
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
          <h4>Liste des caisses</h4>
          <Modal
            show={this.state.show}
            onHide={() => this.setState({ show: false })}
          >
            <ModifyBox id={this.state.id_box} />
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
          <ListGroup>
            {this.state.box.map((item) => (
              <ListGroup.Item
                variant={item.empty ? "danger" : ""}
                key={item.id}
              >
                <ButtonGroup>
                  <Button variant="light" onClick={() => this.onClick(item.id)}>
                    {item.name}
                  </Button>
                  <DropdownButton title="" variant="light">
                    <Dropdown.Item onClick={() => this.onModify(item.id)}>
                      Modifier
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => this.onDelete(item.id, item.name)}
                    >
                      Supprimer
                    </Dropdown.Item>
                  </DropdownButton>
                  <Form.Check
                    className="my-auto ms-3"
                    label="Vidée"
                    checked={item.empty}
                    onChange={() =>
                      this.updateEmpty(
                        (item.empty = !item.empty),
                        item.id,
                        true
                      )
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
                  <br />
                  <small>Nombre d'objets: {item._count.objects}</small>
                  <div>
                    <small>Tag :</small>
                    {item.TagOnBox.map((item2) => (
                      <small key={item2.id_tag}> {item2.tag.name} </small>
                    ))}
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    );
  }
}
export default withRouter(Box_List);
