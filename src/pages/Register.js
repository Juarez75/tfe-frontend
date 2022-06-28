import React from "react";
import axios from "axios";
import { Form, Button, Navbar, Container } from "react-bootstrap";
import { withRouter } from "../withRouter";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mail: "",
      password: "",
      firstname: "",
      lastname: "",
      type: "",
      id_society: "",
      WRONG_MAIL: false,
      EXISTING_MAIL: false,
      EMPTY_FIRSTNAME: false,
      EMPTY_LASTNAME: false,
      EMPTY_MAIL: false,
      EMPTY_PASSWORD: false,
      EXISTING_SOCIETY: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  onSubmit() {
    this.setState({
      WRONG_MAIL: false,
      EXISTING_MAIL: false,
      EMPTY_FIRSTNAME: false,
      EMPTY_LASTNAME: false,
      EMPTY_MAIL: false,
      EMPTY_PASSWORD: false,
      EXISTING_SOCIETY: false,
    });

    if (
      this.state.mail == "" ||
      this.state.firstname == "" ||
      this.state.password == ""
    ) {
      if (this.state.mail == "") this.setState({ EMPTY_MAIL: true });
      if (this.state.firstname == "") this.setState({ EMPTY_FIRSTNAME: true });
      if (this.state.password == "") this.setState({ EMPTY_PASSWORD: true });
      if (this.state.lastname == "") this.setState({ EMPTY_LASTNAME: true });
    } else {
      if (this.state.lastname == "" && this.state.type == 2)
        this.setState({ EMPTY_LASTNAME: true });
      else {
        axios
          .post(`http://localhost:3001/user/create`, {
            mail: this.state.mail,
            password: this.state.password,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            type: this.state.type,
            id_society: this.state.id_society,
          })
          .then((res) => {
            this.props.router.navigate("/");
          })
          .catch((error) => {
            if (error.response.data == "WRONG_SOCIETY")
              this.setState({ EXISTING_SOCIETY: true });
            else if (error.response.data == "WRONG_MAIL")
              this.setState({ WRONG_MAIL: true });
            else if (error.response.data == "EXISTING_MAIL")
              this.setState({ EXISTING_MAIL: true });
          });
      }
    }
  }
  onChange(event) {
    this.setState({ type: event.target.value });
  }

  render() {
    let view;
    if (this.state.type == 2) {
      view = (
        <Form>
          <Form.Group className="mb-3" controlId="formBasicFirstname">
            <Form.Label>Prénom *</Form.Label>
            <Form.Control
              style={{
                backgroundColor: this.state.EMPTY_FIRSTNAME ? "#f9dad9" : " ",
              }}
              name="firstname"
              value={this.state.firstname}
              type="text"
              onChange={this.handleChange}
              placeholder="Exemple"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicLastname">
            <Form.Label>Nom de famille *</Form.Label>
            <Form.Control
              style={{
                backgroundColor: this.state.EMPTY_LASTNAME ? "#f9dad9" : " ",
              }}
              name="lastname"
              value={this.state.lastname}
              type="lastname"
              onChange={this.handleChange}
              placeholder="Exemple"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formSocietyCode">
            <Form.Label>Code de société</Form.Label>
            <Form.Control
              name="id_society"
              value={this.state.id_society}
              type="number"
              onChange={this.handleChange}
              placeholder="00000"
            />
            <small>Numéro à rentrer si vous passez par une société</small>
            <br />
            {this.state.EXISTING_SOCIETY ? (
              <small style={{ color: "red" }}>Code de société inexistant</small>
            ) : (
              " "
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>E-mail *</Form.Label>
            <Form.Control
              style={{
                backgroundColor: this.state.EMPTY_MAIL ? "#f9dad9" : " ",
              }}
              name="mail"
              value={this.state.mail}
              type="mail"
              onChange={this.handleChange}
              placeholder="exemple@test.be"
            />
            {this.state.WRONG_MAIL ? (
              <small style={{ color: "red" }}>E-mail invalide</small>
            ) : (
              " "
            )}
            {this.state.EXISTING_MAIL ? (
              <small style={{ color: "red" }}>E-mail déjà utilisé</small>
            ) : (
              " "
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Mot de passe *</Form.Label>
            <Form.Control
              style={{
                backgroundColor: this.state.EMPTY_PASSWORD ? "#f9dad9" : " ",
              }}
              name="password"
              value={this.state.password}
              type="password"
              onChange={this.handleChange}
              placeholder="Mot de passe"
            />
          </Form.Group>
          <Button variant="secondary" onClick={this.onSubmit}>
            Inscription
          </Button>
        </Form>
      );
    } else if (this.state.type == 1) {
      view = (
        <Form>
          <Form.Group className="mb-3" controlId="formBasicFirstname">
            <Form.Label>Nom de la société *</Form.Label>
            <Form.Control
              style={{
                backgroundColor: this.state.EMPTY_FIRSTNAME ? "#f9dad9" : " ",
              }}
              name="firstname"
              value={this.state.firstname}
              type="text"
              onChange={this.handleChange}
              placeholder="Exemple"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>E-mail *</Form.Label>
            <Form.Control
              style={{
                backgroundColor: this.state.EMPTY_MAIL ? "#f9dad9" : " ",
              }}
              name="mail"
              value={this.state.mail}
              type="mail"
              onChange={this.handleChange}
              placeholder="exemple@test.be"
            />
            {this.state.WRONG_MAIL ? (
              <small style={{ color: "red", textDecoration: "underline" }}>
                E-mail invalide
              </small>
            ) : (
              " "
            )}
            {this.state.EXISTING_MAIL ? (
              <small style={{ color: "red", textDecoration: "underline" }}>
                E-mail déjà utilisé
              </small>
            ) : (
              " "
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Mot de passe *</Form.Label>
            <Form.Control
              style={{
                backgroundColor: this.state.EMPTY_PASSWORD ? "#f9dad9" : " ",
              }}
              name="password"
              value={this.state.password}
              type="password"
              onChange={this.handleChange}
              placeholder="Mot de passe"
            />
          </Form.Group>
          <Button variant="secondary" onClick={this.onSubmit}>
            Inscription
          </Button>
        </Form>
      );
    }
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand
              href="#"
              onClick={() => window.location.reload(false)}
              style={{ margin: "auto" }}
            >
              Case App
            </Navbar.Brand>
          </Container>
        </Navbar>
        <br />
        <div id="center">
          <Form.Label>Vous êtes</Form.Label>
          <Form.Select
            aria-label="Default select example"
            onChange={this.onChange}
          >
            <option>--------------------</option>
            <option value="1">Société</option>
            <option value="2">Particulier</option>
          </Form.Select>
          {view}
          <br />
          <div> Vous avez déjà un compte ?</div>
          <Button
            variant="secondary"
            onClick={() => this.props.router.navigate("/")}
          >
            Connexion
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(Register);
