import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
// import NavDropdown from "react-bootstrap/NavDropdown";

import * as links from "./Links.js";

function Header() {
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="sm">
        <Container fluid>
          <Navbar.Brand href="/" className="serif">
            Alex C Warren
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">HOME</Nav.Link>
              <Nav.Link href={links.medium} target="_blank">ARTICLES</Nav.Link>
              <Nav.Link href={links.youtube} target="_blank">VIDEOS</Nav.Link>
              <Nav.Link href={links.github} target="_blank">PROJECTS</Nav.Link>
              <Nav.Link href={links.contactme} target="_blank">CONTACT ME</Nav.Link>

              {/* "href" determined by "path" of Route component in App.js */}
              {/* <Nav.Link href="/about">About</Nav.Link> */}

              {/* <NavDropdown
                menuVariant="dark"
                title="Dropdown"
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
