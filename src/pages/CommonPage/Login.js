import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Form, Button, Nav, Container, Navbar, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { withRouter } from "../../withRouter";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mail: "",
      password: "",
      WRONG_LOGIN: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  onSubmit() {
    if (this.state.mail == "" || this.state.password == "")
      this.setState({ WRONG_LOGIN: true });
    else {
      axios
        .post(
          process.env.URL_API + `user/login`,
          {
            mail: this.state.mail,
            password: this.state.password,
          },
          { withCredentials: true }
        )
        .then((res) => {
          localStorage.setItem("type", res.data.type);
          localStorage.setItem("id_society", res.data.id_society);
          console.log(res.data.id_society);
          if (res.data.id_society == null) {
            localStorage.setItem("color", "#212529");
          } else localStorage.setItem("color", res.data.color);
          if (res.data.type == 2 || res.data.type == 0)
            this.props.router.navigate("/room/list");

          if (res.data.type == 1) this.props.router.navigate("/society/users");
        })
        .catch((error) => {
          console.log(error);
          //  if (error.response.data == "WRONG_LOGIN")
          //     this.setState({ WRONG_LOGIN: true });
        });
    }
  }

  render() {
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
        <div id="center">
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                name="mail"
                value={this.state.mail}
                type="mail"
                onChange={this.handleChange}
                placeholder="exemple@test.be"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                name="password"
                value={this.state.password}
                type="password"
                onChange={this.handleChange}
                placeholder="Mot de passe"
              />
            </Form.Group>
            {this.state.WRONG_LOGIN ? (
              <Alert variant="danger" id="WRONG_LOGIN">
                E-mail ou mot de passe incorect
              </Alert>
            ) : (
              " "
            )}
            <Button variant="secondary" onClick={this.onSubmit}>
              Connexion
            </Button>
          </Form>
          <br />
          <div> Pas encore de compte ?</div>
          <Button
            variant="secondary"
            onClick={() => this.props.router.navigate("/register")}
          >
            S'inscrire
          </Button>
        </div>
      </div>
    );
  }
}
export default withRouter(Login);
