import axios from "axios";
import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import disconnectLogo from "../../image/arrow.svg";
import burgerButton from "../../image/hamburger.svg";

export class NavigationBarSociety extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuPhone: false,
    };
  }
  render() {
    return (
      <div style={{ backgroundColor: this.props.color }}>
        <Navbar className="w-100" variant="dark" id="navUser">
          <Container>
            <Navbar.Brand
              href="#"
              onClick={() => window.location.reload(false)}
            >
              Case App
            </Navbar.Brand>
            <Nav
              id="hamburger"
              onClick={() =>
                this.setState({ menuPhone: !this.state.menuPhone })
              }
            >
              <img src={burgerButton}></img>
            </Nav>
            <Nav className="me-auto" id="navComputer">
              <Nav.Link href="/profile">Mon compte</Nav.Link>
              <Nav.Link href="/society/users">Utilisateurs</Nav.Link>
              <Nav.Link href="/society/personalize">Personnalisation</Nav.Link>
            </Nav>
            <Nav id="disconnect">
              <Nav.Link
                href="/"
                onClick={() =>
                  axios
                    .get(
                      `http://localhost:3001/user/disconnect`,

                      {
                        withCredentials: true,
                      }
                    )
                    .then(() => {
                      localStorage.clear("type");
                      localStorage.clear("id_society");
                      localStorage.clear("color");
                    })
                    .catch(function (error) {
                      console.log(error);
                    })
                }
              >
                <img src={disconnectLogo}></img>
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        {this.state.menuPhone ? (
          <div id="menuPhone">
            <Nav.Link href="/profile">Mon compte</Nav.Link>
            <Nav.Link href="/society/users">Utilisateurs</Nav.Link>
            <Nav.Link href="/society/personalize">Personnalisation</Nav.Link>
            <Nav.Link
              href="/"
              onClick={() =>
                axios
                  .get(
                    `http://localhost:3001/user/disconnect`,

                    {
                      withCredentials: true,
                    }
                  )
                  .then(() => {
                    localStorage.clear("type");
                    localStorage.clear("id_society");
                    localStorage.clear("color");
                  })
                  .catch(function (error) {
                    console.log(error);
                  })
              }
            >
              Se déconnecter
            </Nav.Link>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
