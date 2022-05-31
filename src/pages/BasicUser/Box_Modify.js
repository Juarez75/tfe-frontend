import React from "react";
import axios from "axios";
import {
  Form,
  Button,
  InputGroup,
  Row,
  Col,
  FormControl,
} from "react-bootstrap";
import { withRouter } from "../../withRouter";
import { NavigationBar } from "../View/NavUser";

class Room_Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: parseInt(props.router.params.id),
      id_room: "",
      name: "",
      comment: "",
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
      society_code: localStorage.getItem("society_code"),
      tagBox: [],
      tags: [],
      selectedTag: "",
      id_box: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.addTag = this.addTag.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.loadTag = this.loadTag.bind(this);

    axios
      .get(`http://localhost:3001/box/information/${this.state.id}`, {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({
          name: res.data.name,
          comment: res.data.comment,
          id_room: res.data.id_room,
          tagBox: res.data.TagOnBox,
          id_box: res.data.id,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    if (this.state.society_code == 0) {
      axios
        .get("http://localhost:3001/tag/user", { withCredentials: true })
        .then((res) => {
          this.setState({ tags: res.data });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .get("http://localhost:3001/tag/society", { withCredentials: true })
        .then((res) => {
          this.setState({ tags: res.data });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  onSubmit() {
    axios
      .post(
        `http://localhost:3001/box/update`,
        {
          id: this.state.id,
          name: this.state.name,
          comment: this.state.comment,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.props.router.navigate(`/room/${this.state.id_room}`);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  onSelectChange(event) {
    this.setState({ selectedTag: event.target.value });
  }
  addTag() {
    axios
      .post(
        "http://localhost:3001/tag/link",
        {
          id_box: this.state.id_box,
          id_tag: this.state.selectedTag,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        this.loadTag();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  deleteTag(id_box, id_tag) {
    axios
      .post(
        "http://localhost:3001/tag/deletelink",
        {
          id_box: id_box,
          id_tag: id_tag,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        this.loadTag();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  loadTag() {
    axios
      .get("http://localhost:3001/tag/box/" + this.state.id_box, {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({ tagBox: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    if (this.state.type == 1) return <div>Vous n'avez pas accès à ça</div>;
    let tagSelection = (
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
        <Button variant="secondary" onClick={this.addTag}>
          Ajouter
        </Button>
      </InputGroup>
    );
    let fakecol = null;
    if (this.state.tagBox.length == 3)
      tagSelection = <small>Max 3 tags par box</small>;
    else if (this.state.tagBox.length == 2) fakecol = <Col></Col>;
    else if (this.state.tagBox.length == 1)
      fakecol = (
        <>
          <Col></Col>
          <Col></Col>
        </>
      );
    return (
      <div>
        <NavigationBar color={this.state.color} />
        <h4>Modification d'une box</h4>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={this.state.name}
              type="text"
              onChange={this.handleChange}
              placeholder="Enter name"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              name="comment"
              value={this.state.comment}
              type="text"
              onChange={this.handleChange}
              placeholder="Enter comment"
            />
          </Form.Group>
          <Button variant="secondary" onClick={this.onSubmit}>
            Submit
          </Button>
        </Form>
        <br />
        <Row>
          {this.state.tagBox.map((item) => (
            <Col key={item.id_tag}>
              <InputGroup>
                <FormControl disabled readOnly value={item.tag.name} />
                <Button
                  variant="secondary"
                  onClick={() => this.deleteTag(item.id_box, item.id_tag)}
                >
                  X
                </Button>
              </InputGroup>
            </Col>
          ))}
          {fakecol}
        </Row>
        <br />
        {tagSelection}
      </div>
    );
  }
}
export default withRouter(Room_Create);
