import React from "react";
import axios from "axios";
import { withRouter } from "../../withRouter";
import {
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  Modal,
  Alert,
  ModalHeader,
  ModalFooter,
  ModalTitle,
} from "react-bootstrap";
import { NavigationBar } from "../Component/NavUser";
import Delete from "../Component/Delete";
import CreateBox from "./CreateBox";
import GraphicUser from "../Component/GraphicUser";

class ProfileBasic extends React.Component {
  node = document.createElement("svg");
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      mail: "",
      firstname: "",
      lastname: "",
      lastPwd: "",
      newPwd: "",
      type: localStorage.getItem("type"),
      id_society: localStorage.getItem("id_society"),
      color: localStorage.getItem("color"),
      nameTag: "",
      tags: [],
      selectedTag: "",
      showDelete: false,
      id_data: "",
      url_data: "",
      name_data: "",
      url_return: "",
      type_delete: "",
      EMPTY_FIRSTNAME: false,
      EMPTY_LASTNAME: false,
      EMPTY_MAIL: false,
      EMPTY_PASSWORD: false,
      WRONG_PASSWORD: false,
      success: false,
      isLoading: true,
      modalUnLink: false,
      graphData: [],
    };

    this.loadData = this.loadData.bind(this);
    this.unLinkSociety = this.unLinkSociety.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onUpdatePwd = this.onUpdatePwd.bind(this);
    this.onCreateTag = this.onCreateTag.bind(this);
    this.onDeleteTag = this.onDeleteTag.bind(this);
    this.loadTag = this.loadTag.bind(this);
    this.ifSuccess = this.ifSuccess.bind(this);

    this.loadData();
  }

  loadData() {
    axios
      .get(process.env.REACT_APP_URL_API + `/user/information`, {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({
          id: res.data.id,
          mail: res.data.mail,
          firstname: res.data.firstname,
          lastname: res.data.lastname,
          id_society: res.data.id_society,
          tags: res.data.tag,
          isLoading: false,
          graphData: res.data.graphData,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  ifSuccess() {
    this.setState({ success: true });
    setTimeout(() => this.setState({ success: false }), 500);
  }
  onUpdate() {
    this.setState({
      EMPTY_FIRSTNAME: false,
      EMPTY_LASTNAME: false,
      EMPTY_MAIL: false,
    });

    if (
      this.state.mail == "" ||
      this.state.firstname == "" ||
      this.state.password == ""
    ) {
      if (this.state.mail == "") this.setState({ EMPTY_MAIL: true });
      if (this.state.firstname == "") this.setState({ EMPTY_FIRSTNAME: true });
      if (this.state.lastname == "") this.setState({ EMPTY_LASTNAME: true });
    } else {
      if (this.state.lastname == "" && this.state.type == 2)
        this.setState({ EMPTY_LASTNAME: true });
      else {
        axios
          .post(
            process.env.REACT_APP_URL_API + `/user/update`,
            {
              mail: this.state.mail,
              firstname: this.state.firstname,
              lastname: this.state.lastname,
            },
            { withCredentials: true }
          )
          .then((res) => {
            window.location.reload(false);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }
  onUpdatePwd() {
    if (this.state.newPwd != "") {
      axios
        .post(
          process.env.REACT_APP_URL_API + `/user/updatePwd`,
          {
            lastPwd: this.state.lastPwd,
            newPwd: this.state.newPwd,
          },
          { withCredentials: true }
        )
        .then((res) => {
          window.location.reload(false);
          this.setState({ WRONG_PASSWORD: false });
        })
        .catch((error) => {
          if (error.reponse.data == "WRONG_PASSWORD")
            this.setState({ WRONG_PASSWORD: true });
        });
    } else this.setState({ EMPTY_PASSWORD: true });
  }
  onCreateTag() {
    axios
      .post(
        process.env.REACT_APP_URL_API + "/tag/user/create",
        {
          name: this.state.nameTag,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.ifSuccess();
        this.loadTag();
      })
      .catch((error) => console.log(error));
  }
  onDeleteTag() {
    this.setState({
      url_data: process.env.REACT_APP_URL_API + "/tag/user/delete",
      id_data: this.state.tags[parseInt(this.state.selectedTag)].id,
      name_data: this.state.tags[parseInt(this.state.selectedTag)].name,
      showDelete: true,
      url_return: "",
      type_delete: 0,
    });
  }
  loadTag() {
    axios
      .get(process.env.REACT_APP_URL_API + "/tag/user", {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({ tags: res.data });
      })
      .catch((error) => console.log(error));
  }
  unLinkSociety() {
    axios
      .post(
        process.env.REACT_APP_URL_API + "/society/unlink",
        { id_user: this.state.id },
        { withCredentials: true }
      )
      .then(() => {
        this.loadData();
        this.setState({ modalUnLink: false });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    if (this.state.isLoading) return <></>;
    let society_viewUser = "";
    if (this.state.id_society != null) {
      society_viewUser = (
        <div>
          <Form.Label>Code société</Form.Label>
          <InputGroup>
            <Form.Control
              name="id_society"
              value={this.state.id_society}
              type="number"
              onChange={this.handleChange}
              placeholder=""
              disabled
              readOnly
            />
            <Button
              variant="secondary"
              onClick={() => this.setState({ modalUnLink: true })}
            >
              Délier de la société
            </Button>
          </InputGroup>
        </div>
      );
    }
    console.log(this.state.svg);
    return (
      <div>
        {/* Modal de suppression */}
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
        {/* Modal d'unLink la société */}
        <Modal
          show={this.state.modalUnLink}
          onHide={() => this.setState({ modalUnLink: false })}
        >
          <ModalTitle>Êtes-vous sûr vous délier de la société ?</ModalTitle>
          <ModalFooter>
            <Button variant="danger" onClick={() => this.unLinkSociety()}>
              Oui
            </Button>
            <Button
              variant="secondary"
              onClick={() => this.setState({ modalUnLink: false })}
            >
              Non
            </Button>
          </ModalFooter>
        </Modal>
        {/* Début de la page */}
        <NavigationBar color={this.state.color} />
        <div id="center">
          <div>
            <div id="profile">
              <Button
                variant="secondary"
                style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 5 }}
                onClick={() =>
                  this.props.router.navigate(`/pdf/${this.state.id}`)
                }
              >
                {/* <a id="pdf" target="_blank" href={`/pdf/${this.state.id}`}> */}
                PDF
                {/* </a> */}
              </Button>
              <h5>Statistiques</h5>
              <h6>Nombres de caisses dans les différents états</h6>
              <GraphicUser
                data={this.state.graphData}
                color={this.state.color}
              />
              <h5 className="h5-profile">Données personnelles</h5>
              <div className="profile">
                <Form.Label>Prénom</Form.Label>
                <Form.Control
                  style={{
                    backgroundColor: this.state.EMPTY_FIRSTNAME
                      ? "#f7786f"
                      : " ",
                  }}
                  name="firstname"
                  value={this.state.firstname}
                  type="text"
                  onChange={this.handleChange}
                  placeholder="Exemple"
                />
              </div>
              <div className="profile">
                <Form.Label>Nom de famille</Form.Label>
                <Form.Control
                  style={{
                    backgroundColor: this.state.EMPTY_LASTNAME
                      ? "#f7786f"
                      : " ",
                  }}
                  name="lastname"
                  value={this.state.lastname}
                  type="lastname"
                  onChange={this.handleChange}
                  placeholder="Exemple"
                />
              </div>
              <div className="profile">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  style={{
                    backgroundColor: this.state.EMPTY_MAIL ? "#f7786f" : " ",
                  }}
                  name="mail"
                  value={this.state.mail}
                  type="mail"
                  onChange={this.handleChange}
                  placeholder="exemple@test.be"
                />
              </div>
            </div>
            <div className="profile">{society_viewUser}</div>
            <Button
              className="profile"
              variant="secondary"
              type="button"
              onClick={this.onUpdate}
            >
              Sauvegarder
            </Button>
            <br />
            <div>
              <h5 className="h5-profile">Tag</h5>
              <div className="profile">
                <InputGroup>
                  <Form.Select
                    aria-label="Exemple"
                    name="selectedTag"
                    onChange={this.handleChange}
                  >
                    <option>--Sélectionne--</option>
                    {this.state.tags.map((item, i) => (
                      <option key={item.id} value={i}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Button variant="secondary" onClick={this.onDeleteTag}>
                    Supprimer
                  </Button>
                </InputGroup>
              </div>
              <div className="profile">
                <InputGroup>
                  <Form.Control
                    type="text"
                    name="nameTag"
                    value={this.state.nameTag}
                    onChange={this.handleChange}
                    placeholder="Ajouter tag"
                  />
                  <Button variant="secondary" onClick={this.onCreateTag}>
                    Ajouter
                  </Button>
                </InputGroup>
              </div>
            </div>
          </div>
          <h5 className="h5-profile">Changer de mot de passe</h5>
          <div>
            <div className="profile">
              <Form.Label>Ancien mot de passe</Form.Label>
              <Form.Control
                name="lastPwd"
                value={this.state.lastPwd}
                type="password"
                onChange={this.handleChange}
                placeholder=""
              />
            </div>
            <div className="profile">
              <Form.Label>Nouveau mot de passe</Form.Label>
              <Form.Control
                style={{
                  backgroundColor: this.state.EMPTY_PASSWORD ? "#f7786f" : " ",
                }}
                name="newPwd"
                value={this.state.newPwd}
                type="password"
                onChange={this.handleChange}
                placeholder=""
              />
            </div>
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
          {this.state.WRONG_PASSWORD ? (
            <Alert variant="danger">Mot de passe incorrect</Alert>
          ) : (
            " "
          )}
          <Button variant="secondary" type="button" onClick={this.onUpdatePwd}>
            Sauvegarder
          </Button>
        </div>
      </div>
    );
  }
}
export default withRouter(ProfileBasic);
