import axios from "axios";
import React from "react";
import {
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  Modal,
  ModalHeader,
} from "react-bootstrap";
import { withRouter } from "../../withRouter";
import { NavigationBarSociety } from "../Component/NavSociety";
import Delete from "../Component/Delete";
import ErrorHappened from "../Component/ErrorHappened";

class Personalize extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: localStorage.getItem("color"),
      id_society: localStorage.getItem("id_society"),
      type: localStorage.getItem("type"),
      tags: [],
      selectedTag: "",
      nameTag: "",
      tagColor: "#707070",
      showDelete: false,
      id_data: "",
      url_data: "",
      name_data: "",
      url_return: "",
      type_delete: "",
      ERROR_HAPPENED: false,
      success: false,
      isLoading: true,
    };

    this.loadData = this.loadData.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
    this.addTag = this.addTag.bind(this);
    this.updateColor = this.updateColor.bind(this);
    this.ifSuccess = this.ifSuccess.bind(this);
    this.cancelSuccess = this.cancelSuccess.bind(this);

    this.loadData();
  }

  loadData() {
    axios
      .get("http://localhost:3001/tag/society", { withCredentials: true })
      .then((res) => {
        this.setState({ tags: res.data, isLoading: false });
      })
      .catch((error) => {
        if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
  }

  ifSuccess() {
    this.setState({ success: true });
    this.cancelSuccess(true);
  }
  cancelSuccess() {
    setTimeout(() => this.setState({ success: false }), 500);
  }
  deleteTag() {
    this.setState({
      url_data: "http://localhost:3001/tag/society/delete",
      id_data: this.state.tags[parseInt(this.state.selectedTag)].id,
      name_data: this.state.tags[parseInt(this.state.selectedTag)].name,
      showDelete: true,
      url_return: "",
      type_delete: 0,
    });
  }

  addTag() {
    if (this.state.name != "") {
      axios
        .post(
          "http://localhost:3001/tag/society/create",
          {
            name: this.state.nameTag,
            color: this.state.tagColor,
          },
          { withCredentials: true }
        )
        .then((res) => {
          this.loadData();
          this.ifSuccess();
        })
        .catch((error) => {
          if (error.response.data == "ERROR") {
            this.setState({ ERROR_HAPPENED: true });
            setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
          }
        });
    }
  }

  updateColor() {
    axios
      .post(
        "http://localhost:3001/society/updateColor",
        {
          color: this.state.color,
        },
        { withCredentials: true }
      )
      .then(() => {
        localStorage.setItem("color", this.state.color);
      })
      .catch((error) => {
        if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
  }

  render() {
    if (this.state.isLoading) return <></>;
    if (this.state.type == 2 || 0)
      return <div>Nous n'êtes pas autorisé sur cette page</div>;
    return (
      <>
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
          show={this.state.ERROR_HAPPENED}
          onHide={() => this.setState({ ERROR_HAPPENED: false })}
        >
          <ErrorHappened></ErrorHappened>
        </Modal>
        <NavigationBarSociety color={this.state.color} />
        <div id="center_list">
          <h4>Personalisation</h4>
          <div className="my-2">
            <Form.Group style={{ display: "flex", flexFlow: "row wrap" }}>
              <Form.Label
                column
                className="my-auto"
                style={{
                  minWidth: "100%",
                  marginRight: "1rem",
                  marginBottom: "1rem",
                }}
              >
                Couleur du site:
              </Form.Label>

              <Form.Control
                type="color"
                value={this.state.color}
                onChange={(event) =>
                  this.setState({ color: event.target.value })
                }
              />

              <Button variant="secondary" onClick={this.updateColor}>
                Sauvegarder
              </Button>
            </Form.Group>
          </div>
          <div className="my-2">
            <Form.Group style={{ display: "flex", flexFlow: "row wrap" }}>
              <Form.Label
                className="my-auto"
                style={{
                  minWidth: "100%",
                  marginRight: "1rem",
                  marginBottom: "2rem ",
                }}
              >
                Ajouter un tag:
              </Form.Label>
              <Form.Control
                type="text"
                name="nameTag"
                value={this.state.nameTag}
                style={{ maxWidth: "40vh" }}
                onChange={(event) =>
                  this.setState({ nameTag: event.target.value })
                }
                placeholder="Ajouter tag"
              />
              <Form.Control
                type="color"
                value={this.state.tagColor}
                onChange={(event) =>
                  this.setState({ tagColor: event.target.value })
                }
              />

              <Button variant="secondary" onClick={this.addTag}>
                Ajouter
              </Button>
            </Form.Group>
          </div>
          <Modal
            size="sm"
            show={this.state.success}
            onHide={() => this.setState({ success: false })}
          >
            <ModalHeader
              style={{ backgroundColor: "#77DD77", color: "#00561B" }}
              closeButton
            >
              Tag ajouté !
            </ModalHeader>
          </Modal>
          <div>
            <InputGroup
              className="my-2"
              style={{ display: "flex", flexFlow: "row wrap" }}
            >
              <Form.Label
                style={{
                  minWidth: "100%",
                  marginRight: "1rem",
                  marginBottom: "1rem",
                }}
              >
                Supprimer un tag :
              </Form.Label>
              <Form.Select
                aria-label="Exemple"
                className="mx-1 "
                name="selectedTag"
                style={{ maxWidth: "40vh" }}
                onChange={(event) =>
                  this.setState({ selectedTag: event.target.value })
                }
              >
                <option>--Sélectionne--</option>
                {this.state.tags.map((item, i) => (
                  <option
                    style={{ backgroundColor: item.color }}
                    key={item.id}
                    value={i}
                  >
                    {item.name}
                  </option>
                ))}
              </Form.Select>
              <Button variant="secondary" onClick={this.deleteTag}>
                Supprimer
              </Button>
            </InputGroup>
          </div>
        </div>
      </>
    );
  }
}
export default withRouter(Personalize);
