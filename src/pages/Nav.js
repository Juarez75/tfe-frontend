import axios from "axios";
import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

export function NavigationBar() {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#" onClick={() => window.location.reload(false)}>
          Case App
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/profile">Mon compte</Nav.Link>
          <NavDropdown title="Liste">
            <NavDropdown.Item href="/room/list">Pièces</NavDropdown.Item>
            <NavDropdown.Item href="/box/list">Box</NavDropdown.Item>
            <NavDropdown.Item href="/object/list">Objets</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav>
          <Nav.Link
            href="/"
            onClick={() =>
              axios
                .get(`http://localhost:3001/user/disconnect`, {
                  withCredentials: true,
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
