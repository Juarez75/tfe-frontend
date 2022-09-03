import React from "react";
import axios from "axios";
import {
  Button,
  ListGroup,
  DropdownButton,
  Dropdown,
  ButtonGroup,
  Form,
  Row,
  ModalTitle,
  Modal,
  Col,
  InputGroup,
  ModalBody,
  Breadcrumb,
  ModalHeader,
  ModalFooter,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { withRouter } from "../../withRouter";
import { NavigationBar } from "../Component/NavUser";
import { ModifyRoom } from "../Component/ModifyRoom";
import { ModifyBox } from "../Component/ModifiyBox";
import Delete from "../Component/Delete";
import WrongPage from "../Component/WrongPage";
import ErrorHappened from "../Component/ErrorHappened";
import { FilePond, registerPlugin } from "react-filepond";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css";

import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginImageResize,
  FilePondPluginImageCrop,
  FilePondPluginFileValidateSize
);

class Room_List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      society_code: localStorage.getItem("society_code"),
      name: "",
      stage: "",
      comment: "",
      type_room: "",
      number_box: "",
      box: [],
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
      showModalRoom: false,
      showModalBox: false,
      showCreateBox: false,
      showDelete: false,
      id_box: "",
      tags: [],
      selectedTag: "",
      nameBox: "",
      commentBox: "",
      selectedNumber: "1",
      selectedDelete: "1",
      id_data: "",
      url_data: "",
      name_data: "",
      url_return: "",
      type_delete: "",
      EMPTY_NAME: false,
      WRONG_PAGE: false,
      ERROR_HAPPENED: false,
      isLoading: true,
      room: [],
      modalRoom: false,
      boxChecked: [],
      updateOk: false,
      id_room: "",
      file: "",
      validateImage: false,
    };
    this.onRoomDelete = this.onRoomDelete.bind(this);
    this.onRoomModify = this.onRoomModify.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onMultCreate = this.onMultCreate.bind(this);
    this.onBoxDelete = this.onBoxDelete.bind(this);

    this.checkBoxChange = this.checkBoxChange.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.deleteMany = this.deleteMany.bind(this);
    this.updateManyRoom = this.updateManyRoom.bind(this);
    this.openModalRoom = this.openModalRoom.bind(this);
    this.loadRoom = this.loadRoom.bind(this);

    this.loadData();
  }

  loadData() {
    axios
      .get(
        `http://localhost:3001/room/${parseInt(this.props.router.params.id)}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        this.loadRoom();
        if (res.data.id_tagSociety == null) {
          this.setState({
            id: res.data.id,
            name: res.data.name,
            comment: res.data.comment,
            type_room: res.data.type,
            stage: res.data.stage,
            box: res.data.box,
            number_box: res.data._count.box,
            isLoading: false,
          });
        } else {
          console.log(res.data);
          this.setState({
            name: res.data.name,
            comment: res.data.comment,
            type_room: res.data.type,
            stage: res.data.stage,
            box: res.data.box,
            selectedTag: res.data.TagSociety.color,
            number_box: res.data._count.box,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data == "WRONG_PAGE")
          this.setState({ WRONG_PAGE: true });
        else if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
  }

  onBoxDelete(id, name) {
    this.setState({
      url_data: "http://localhost:3001/box/delete",
      id_data: id,
      name_data: name,
      showDelete: true,
      url_return: `/room/${this.state.id}`,
      type_delete: 0,
    });
  }
  onBoxModify(id) {
    this.setState({ id_box: id, showModalBox: true });
  }
  onCreate() {
    this.setState({ showCreateBox: true });
  }
  onClick(id) {
    this.props.router.navigate(`/box/${id}`);
  }
  onRoomDelete() {
    this.setState({
      url_data: "http://localhost:3001/room/delete",
      id_data: this.state.id,
      name_data: this.state.name,
      showDelete: true,
      url_return: "/room/list",
      type_delete: 0,
    });
  }
  onRoomModify() {
    this.setState({ showModalRoom: true });
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
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  onSubmit() {
    if (this.state.name != "") {
      var formData = new FormData();
      if (this.state.file[0] != null)
        formData.append("picture", this.state.file[0].file);
      formData.append("id_room", this.state.id);
      formData.append("name", this.state.nameBox);
      formData.append("comment", this.state.commentBox);
      axios
        .post(`http://localhost:3001/box/create`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        })
        .then(() => {
          this.loadData();
          this.setState({ showCreateBox: false });
        })
        .catch(function (error) {
          if (error.response.data == "ERROR") {
            this.setState({ ERROR_HAPPENED: true });
            setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
          }
        });
    } else this.setState({ EMPTY_NAME: true });
  }
  onMultCreate() {
    axios
      .post(
        "http://localhost:3001/box/createmany",
        {
          id_room: this.state.id,
          number: this.state.selectedNumber,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.loadData();
      })
      .catch((error) => {
        if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
  }
  onMultDelete() {
    this.setState({
      url_data: "http://localhost:3001/box/deletemany",
      id_data: this.state.id,
      name_data: this.state.selectedDelete,
      showDelete: true,
      url_return: "",
      type_delete: 1,
    });
  }
  handleInit() {
    console.log("FilePond instance has initialised", this.pond);
  }

  render() {
    if (this.state.isLoading) return <></>;
    var createBox = [];
    for (var i = 1; i < 51; i++) {
      createBox.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    var deleteBox = [];
    for (var y = 1; y <= this.state.number_box; y++) {
      deleteBox.push(
        <option key={y} value={y}>
          {y}
        </option>
      );
    }
    if (this.state.type == 1) return <div>Vous n'avez pas accès à ça</div>;
    if (this.state.WRONG_PAGE) return <WrongPage></WrongPage>;
    return (
      <div>
        <Modal
          show={this.state.updateOk}
          onHide={() => this.setState({ updateOk: false })}
        >
          <ModalHeader
            style={{ backgroundColor: "#77DD77", color: "#00561B" }}
            closeButton
          >
            Modification effectuée !
          </ModalHeader>
        </Modal>
        <Modal
          show={this.state.modalRoom}
          onHide={() => this.setState({ modalRoom: false })}
        >
          <ModalHeader closeButton>Changer de pièce</ModalHeader>
          <ModalBody>
            <Form.Select
              aria-label="Exemple"
              className="mx-1 "
              name=""
              style={{ maxWidth: "40vh" }}
              onChange={(event) => {
                this.setState({ id_room: event.target.value });
                console.log(event.target.value);
              }}
            >
              <option>--Sélectionne--</option>
              {this.state.room.map((item, i) => (
                <option key={i} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Form.Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline-success" onClick={this.updateManyRoom}>
              Sauvegarder
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => this.setState({ modalRoom: false })}
            >
              Annuler
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          show={this.state.ERROR_HAPPENED}
          onHide={() => this.setState({ ERROR_HAPPENED: false })}
        >
          <ErrorHappened></ErrorHappened>
        </Modal>

        <NavigationBar color={this.state.color} />
        <Modal
          show={this.state.showModalRoom}
          onHide={() => this.setState({ showModalRoom: false })}
        >
          <ModifyRoom id={this.state.id} />
        </Modal>
        <Modal
          show={this.state.showModalBox}
          onHide={() => this.setState({ showModalBox: false })}
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
        <Modal
          show={this.state.showCreateBox}
          onHide={() => this.setState({ showCreateBox: false })}
        >
          <ModalTitle>Créer une caisse</ModalTitle>
          <ModalBody>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicText">
                <Form.Label>
                  Ajouter une photo <small>* Non obligatoire</small>
                </Form.Label>
                <div style={{ width: 300 }}>
                  <FilePond
                    ref={(ref) => (this.pond = ref)}
                    file={this.state.file}
                    allowReorder={true}
                    instantUpload={false}
                    maxFileSize="5MB"
                    name="file"
                    id="filePond"
                    allowProcess={false}
                    acceptedFileTypes={["image/png", "image/jpeg"]}
                    imageResizeTargetWidth={300}
                    imageCropAspectRatio="1:1"
                    oninit={() => this.handleInit()}
                    onaddfile={(ref) =>
                      this.setState({ validateImage: ref == null })
                    }
                    onupdatefiles={(fileItem) => {
                      console.log(fileItem);
                      // Set currently active file objects to this.state
                      this.setState({
                        file: fileItem,
                      });
                    }}
                  />
                </div>
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  style={{
                    backgroundColor: this.state.EMPTY_PASSWORD
                      ? "#f7786f"
                      : " ",
                  }}
                  name="nameBox"
                  value={this.state.nameBox}
                  type="text"
                  onChange={this.handleChange}
                  placeholder="Exemple"
                  maxLength={14}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicText">
                <Form.Label>Commentaire</Form.Label>
                <Form.Control
                  name="commentBox"
                  value={this.state.commentBox}
                  type="text"
                  onChange={this.handleChange}
                  placeholder="Ceci est une caisse"
                />
              </Form.Group>
              <Button variant="secondary" onClick={this.onSubmit}>
                Ajouter
              </Button>
            </Form>
          </ModalBody>
        </Modal>
        <div id="center_list">
          <h4>
            Dans la pièce : {this.state.name}{" "}
            <ButtonGroup>
              {" "}
              <Button onClick={this.onRoomModify} variant="light">
                Modifier
              </Button>
              <Button variant="light" onClick={this.onRoomDelete}>
                Supprimer
              </Button>
            </ButtonGroup>
          </h4>
          <Breadcrumb>
            <Breadcrumb.Item href="/room/list">
              Liste des pièces
            </Breadcrumb.Item>
            <Breadcrumb.Item href="#" active>
              {this.state.name}
            </Breadcrumb.Item>
          </Breadcrumb>
          <ListGroup>
            <ListGroup.Item>
              <Row>
                <Col md={2}>
                  <Button
                    variant="outline-secondary"
                    onClick={() => this.onCreate()}
                  >
                    Ajouter une caisse
                  </Button>
                </Col>
                <Col>
                  <InputGroup>
                    <Form.Label className="my-auto">
                      Ajout rapide de caisses :
                    </Form.Label>
                    <div id="multBox">
                      <div id="selectNumber">
                        <Form.Select
                          aria-label="Exemple"
                          name="selectedNumber"
                          onChange={this.handleChange}
                          value={this.state.selectedNumber}
                          id="test"
                        >
                          {createBox}
                        </Form.Select>
                      </div>

                      <Button
                        variant="outline-secondary"
                        onClick={() => this.onMultCreate()}
                      >
                        Ajouter
                      </Button>
                    </div>
                  </InputGroup>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Check
                type="checkbox"
                onChange={(e) => this.selectAll(e)}
                style={{ marginRight: 20 }}
                label="Tout sélectionner"
                id="selectAll"
              />
              {this.state.boxChecked.length != 0 ? (
                <>
                  <h5>Caisses sélectionnées :</h5>
                  <Button
                    style={{ marginRight: 10, marginTop: 10 }}
                    variant="outline-secondary"
                    onClick={() => this.openModalRoom()}
                  >
                    Changer de pièce
                  </Button>
                  <Button
                    style={{ marginRight: 10, marginTop: 10 }}
                    variant="outline-danger"
                    onClick={() => this.deleteMany()}
                  >
                    Supprimer les caisses
                  </Button>
                </>
              ) : (
                ""
              )}
            </ListGroup.Item>

            {this.state.box.map((item) => (
              <div key={item.id}>
                <ListGroup.Item
                  variant={
                    item.state == 2
                      ? "danger"
                      : "" || item.state == 1
                      ? "success"
                      : ""
                  }
                >
                  <ButtonGroup>
                    <Form.Check
                      type="checkbox"
                      id={item.id}
                      onChange={(event) => this.checkBoxChange(event)}
                      style={{ alignItems: "center", marginRight: 20 }}
                    />
                    <Button
                      variant="light"
                      onClick={() => this.onClick(item.id)}
                    >
                      {item.name}
                    </Button>
                    <DropdownButton title="" variant="light">
                      <Dropdown.Item onClick={() => this.onBoxModify(item.id)}>
                        Modifier
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => this.onBoxDelete(item.id, item.name)}
                      >
                        Supprimer
                      </Dropdown.Item>
                    </DropdownButton>
                    {"  "}
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
                  <div>
                    <small>Nombre d'objets: {item._count.objects}</small>
                  </div>
                  <div>
                    <small>Tag: </small>
                    {item.TagOnBox.map((item2) => (
                      <small key={item2.id_tag}> {item2.tag.name} </small>
                    ))}
                  </div>
                </ListGroup.Item>
              </div>
            ))}
          </ListGroup>
        </div>
      </div>
    );
  }

  loadRoom() {
    axios
      .get(`http://localhost:3001/room/list`, { withCredentials: true })
      .then((res) => {
        this.setState({ room: res.data });
      })
      .catch((error) => {
        if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
  }

  deleteMany() {
    this.setState({
      url_data: "http://localhost:3001/box/deletemany",
      id_data: this.state.boxChecked,
      name_data: this.state.boxChecked.length,
      showDelete: true,
      url_return: "",
      type_delete: 1,
    });
  }
  openModalRoom() {
    this.setState({ modalRoom: true });
  }
  updateManyRoom() {
    if (!isNaN(this.state.id_room)) {
      axios
        .post(
          "http://localhost:3001/box/updateManyRoom",
          {
            list: this.state.boxChecked,
            id_room: this.state.id_room,
          },
          { withCredentials: true }
        )
        .then(() => {
          this.ifSuccess();
          this.setState({ modalRoom: false });
          this.loadData();
        })
        .catch((error) => {
          if (error.response.data == "ERROR") {
            this.setState({ ERROR_HAPPENED: true });
            setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
          }
        });
    }
  }

  checkBoxChange(event) {
    var array = [];
    var e;
    if (event.target.checked) {
      array = this.state.boxChecked.concat(parseInt(event.target.id));
    } else {
      array = this.state.boxChecked.filter(
        (i) => i != parseInt(event.target.id)
      );
    }
    this.setState({ boxChecked: array });
    if (array.length != this.state.box.length) {
      e = document.getElementById("selectAll");
      e.checked = false;
    } else if (array.length == this.state.box.length) {
      e = document.getElementById("selectAll");
      e.checked = true;
    }
  }
  ifSuccess() {
    this.setState({ updateOk: true });
    this.cancelSuccess();
  }
  cancelSuccess() {
    setTimeout(() => this.setState({ updateOk: false }), 500);
  }
  selectAll(event) {
    var array = [];
    var e;
    if (event.target.checked) {
      this.state.box.map((item) => {
        array.push(item.id);
        e = document.getElementById(item.id);
        e.checked = event.target.checked;
      });
    } else {
      array = [];
      this.state.box.map((item) => {
        e = document.getElementById(item.id);
        e.checked = event.target.checked;
      });
    }

    this.setState({ boxChecked: array });
  }
}
export default withRouter(Room_List);
