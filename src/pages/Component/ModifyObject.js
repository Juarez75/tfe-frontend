import React from "react";
import { ModalBody, ModalTitle, Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import ErrorHappened from "./ErrorHappened";

export class ModifyObject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      name: "",
      id_box: "",
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
      ERROR_HAPPENED: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    axios
      .get(`http://localhost:3001/object/information/${this.state.id}`, {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({ name: res.data.name, id_box: res.data.id_box });
      })
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
      axios
        .post(
          `http://localhost:3001/object/update`,
          {
            id: this.state.id,
            name: this.state.name,
          },
          { withCredentials: true }
        )
        .then((res) => {
          window.location.reload(false);
        })
        .catch((error) => {
          if (error.response.data == "ERROR") {
            this.setState({ ERROR_HAPPENED: true });
            setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
          }
        });
    }
  }
  render() {
    return (
      <>
        <Modal
          show={this.state.ERROR_HAPPENED}
          onHide={() => this.setState({ ERROR_HAPPENED: false })}
        >
          <ErrorHappened></ErrorHappened>
        </Modal>
        <ModalTitle>Modification de l'objet</ModalTitle>
        <ModalBody>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={this.state.name}
                type="text"
                onChange={this.handleChange}
                placeholder="Exemple"
              />
            </Form.Group>

            <Button variant="secondary" onClick={this.onSubmit}>
              Submit
            </Button>
          </Form>
        </ModalBody>
      </>
    );
  }
}
