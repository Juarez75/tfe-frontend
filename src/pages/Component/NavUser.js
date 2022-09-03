import axios from "axios";
import React from "react";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Dropdown,
  Button,
  DropdownButton,
} from "react-bootstrap";
import disconnectLogo from "../../image/arrow.svg";
import burgerButton from "../../image/hamburger.svg";

export class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuPhone: false,
      color: props.color,
    };
  }
  render() {
    return (
      <div style={{ backgroundColor: this.state.color }}>
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
              <Nav.Link href="/profile" className="navBarLink">
                Mon compte
              </Nav.Link>
              <NavDropdown title="Liste">
                <NavDropdown.Item href="/room/list" className="navBarLink">
                  Pièces
                </NavDropdown.Item>
                <NavDropdown.Item href="/box/list" className="navBarLink">
                  Caisses
                </NavDropdown.Item>
                <NavDropdown.Item href="/object/list" className="navBarLink">
                  Objets
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/scanQR" className="navBarLink">
                QR Code
              </Nav.Link>

              <Nav.Link href="/search" className="navBarLink">
                Recherche
              </Nav.Link>
            </Nav>
            <Nav id="disconnect">
              <Nav.Link
                className="navBarLink"
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
            <Nav.Link href="/profile" className="navBarLink">
              Mon compte
            </Nav.Link>
            <NavDropdown title="Liste" id="dropdown_menu">
              <NavDropdown.Item href="/room/list" class="navdropdown">
                Pièces
              </NavDropdown.Item>
              <NavDropdown.Item href="/box/list" class="navdropdown">
                Caisses
              </NavDropdown.Item>
              <NavDropdown.Item href="/object/list" class="navdropdown">
                Objets
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/scanQR" className="navBarLink">
              QR Code
            </Nav.Link>
            <Nav.Link href="/search" className="navBarLink">
              Recherche
            </Nav.Link>
            <Nav.Link
              href="/"
              className="navBarLink"
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
