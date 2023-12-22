import React from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';

function Header() {
  return (
    <>
      <Navbar expand="md"  data-bs-theme="dark" className="sticky-top">
        <Container>
          <Navbar.Brand href="/home">
            <img
              alt="munchkin"
              src="/header-logo.png"
              width="35"
              height="35"
              className="d-inline-block align-top"
            />{' '}
            munchkin
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="align-items-center header text-end ms-auto">
              <Nav.Link href="/home">Home</Nav.Link>
              <Nav.Link href="/recipes">Recipes</Nav.Link>
              <Nav.Link href="/child-health">Child Health</Nav.Link>
              <Nav.Link href="/about">About</Nav.Link>
              <Nav.Link href="/contact">Contact</Nav.Link>
              <Nav.Link href="/signup">
                <Button className="header-button" variant="secondary" size="sm">
                  Get Started
                </Button>{' '}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
