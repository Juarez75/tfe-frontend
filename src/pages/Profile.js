import React from "react";
import axios from "axios";
import { withRouter } from "../withRouter";
import { Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { NavigationBar } from "./View/NavUser";
import { NavigationBarSociety } from "./View/NavSociety";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mail: "",
      firstname: "",
      lastname: "",
      lastPwd: "",
      newPwd: "",
      type: localStorage.getItem("type"),
      society_code: localStorage.getItem("society_code"),
      color: localStorage.getItem("color"),
      nameTag: "",
      tags: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onUpdatePwd = this.onUpdatePwd.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCreateTag = this.onCreateTag.bind(this);
    this.onDeleteTag = this.onDeleteTag.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.loadTag = this.loadTag.bind(this);
    axios
      .get(`http://localhost:3001/user/information`, {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({
          mail: res.data.mail,
          firstname: res.data.firstname,
          lastname: res.data.lastname,
          society_code: res.data.society_code,
          color: res.data.color,
          tags: res.data.tag,
          selectedTag: "",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  onUpdate() {
    axios
      .post(
        `http://localhost:3001/user/update`,
        {
          mail: this.state.mail,
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          color: this.state.color,
        },
        { withCredentials: true }
      )
      .then((res) => {
        localStorage.setItem("color", this.state.color);
        window.location.reload(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  onUpdatePwd() {
    axios
      .post(
        `http://localhost:3001/user/updatePwd`,
        {
          lastPwd: this.state.lastPwd,
          newPwd: this.state.newPwd,
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
  onChange(event) {
    this.setState({ color: event.target.value });
  }
  onSelectChange(event) {
    this.setState({ selectedTag: event.target.value });
  }
  onCreateTag() {
    axios
      .post(
        "http://localhost:3001/tag/create",
        {
          name: this.state.nameTag,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.loadTag();
      })
      .catch((error) => console.log(error));
  }
  onDeleteTag() {
    console.log(this.state.selectedTag);
    axios
      .post(
        "http://localhost:3001/tag/delete",
        {
          id: this.state.selectedTag,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.loadTag();
      })
      .catch((error) => console.log(error));
  }
  loadTag() {
    axios
      .get("http://localhost:3001/tag/user", { withCredentials: true })
      .then((res) => {
        this.setState({ tags: res.data });
      })
      .catch((error) => console.log(error));
  }

  render() {
    let view;
    let tag_view = (
      <Row>
        <h5>Tag</h5>
        <Col>
          <InputGroup>
            <Form.Select
              aria-label="Exemple"
              name="selectedTag"
              onChange={this.onSelectChange}
            >
              <option>--Sélectionne--</option>
              {this.state.tags.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Form.Select>
            <Button variant="secondary" onClick={this.onDeleteTag}>
              Ajouter
            </Button>
          </InputGroup>
        </Col>
        <Col>
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
        </Col>
      </Row>
    );
    let society_view = (
      <div>
        <Form.Label>Code société</Form.Label>
        <Form.Control
          name="society_code"
          value={this.state.society_code}
          type="number"
          onChange={this.handleChange}
          placeholder=""
          disabled
          readOnly
        />
      </div>
    );
    if (this.state.society_code == 0) {
      society_view = null;
    }
    if (this.state.type == 2 || this.state.type == 0) {
      if (this.state.society_code != 0) tag_view = null;
      view = (
        <div>
          <NavigationBar color={this.state.color} />
          <Row>
            <Col>
              <Form.Label>Firstname</Form.Label>
              <Form.Control
                name="firstname"
                value={this.state.firstname}
                type="text"
                onChange={this.handleChange}
                placeholder="Enter firstname"
              />
            </Col>
            <Col>
              <Form.Label>Lastname</Form.Label>
              <Form.Control
                name="lastname"
                value={this.state.lastname}
                type="lastname"
                onChange={this.handleChange}
                placeholder="Enter lastname"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="mail"
                value={this.state.mail}
                type="mail"
                onChange={this.handleChange}
                placeholder="Enter email"
              />
            </Col>
            <Col>{society_view}</Col>
          </Row>
          <Button variant="secondary" type="button" onClick={this.onUpdate}>
            Submit
          </Button>
          <br />
          {tag_view}
        </div>
      );
    } else if (this.state.type == 1) {
      view = (
        <div>
          <NavigationBarSociety color={this.state.color} />
          <Row>
            <Col>
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="firstname"
                value={this.state.firstname}
                type="text"
                onChange={this.handleChange}
                placeholder="Enter firstname"
              />
            </Col>
            <Col>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="mail"
                value={this.state.mail}
                type="mail"
                onChange={this.handleChange}
                placeholder="Enter email"
              />
            </Col>
          </Row>
          <Row>
            <Col>{society_view}</Col>
            <Col>
              <Form.Label htmlFor="exampleColorInput">Color picker</Form.Label>
              <Form.Control
                type="color"
                id="exampleColorInput"
                title="Choose your color"
                value={this.state.color}
                onChange={this.onChange}
              />
            </Col>
          </Row>
          <Button variant="secondary" type="button" onClick={this.onUpdate}>
            Submit
          </Button>
          <br />
          <br />
          {tag_view}
        </div>
      );
    }
    return (
      <div>
        {view}
        <br />
        <br />
        <h5>Changer de mot de passe</h5>
        <Row>
          <Col>
            <Form.Label>Actual password</Form.Label>
            <Form.Control
              name="lastPwd"
              value={this.state.lastPwd}
              type="password"
              onChange={this.handleChange}
              placeholder=""
            />
          </Col>
          <Col>
            <Form.Label>New password</Form.Label>
            <Form.Control
              name="newPwd"
              value={this.state.newPwd}
              type="password"
              onChange={this.handleChange}
              placeholder=""
            />
          </Col>
        </Row>
        <Button variant="secondary" type="button" onClick={this.onUpdatePwd}>
          Submit
        </Button>
      </div>
    );
  }
}
export default withRouter(Profile);
