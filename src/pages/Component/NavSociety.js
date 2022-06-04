import axios from "axios";
import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

export function NavigationBarSociety(props) {
  return (
    <Navbar
      className="w-100"
      variant="dark"
      style={{ backgroundColor: props.color }}
    >
      <Container>
        <Navbar.Brand href="#" onClick={() => window.location.reload(false)}>
          Case App
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/profile">Mon compte</Nav.Link>
          <Nav.Link href="/society/users">Utilisateurs</Nav.Link>
          <Nav.Link href="/society/personalize">Personnalisation</Nav.Link>
        </Nav>
        <Nav>
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
                })
                .catch(function (error) {
                  console.log(error);
                })
            }
          >
            Se déconnecter
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}