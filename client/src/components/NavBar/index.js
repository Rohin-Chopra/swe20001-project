import { Component } from 'react';

import { Container, Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class NavBar extends Component {
  render() {
    const { user } = this.props;
    if (!user) {
      return <></>;
    }

    return (
      <Navbar bg="light" expand="lg">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>People Health Pharmacy</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <LinkContainer exact to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/items">
                <Nav.Link>Items</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/sales">
                <Nav.Link>Sales</Nav.Link>
              </LinkContainer>
            </Nav>
            <Nav>
              Signed in as: {user.name}
            </Nav>
            <Nav.Link onClick={this.props.onLogout}>
              Log Out
            </Nav.Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}
