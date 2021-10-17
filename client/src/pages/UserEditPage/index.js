import { Component } from 'react';

import { Button, Form } from 'react-bootstrap';
import { withRouter } from 'react-router';

class UserEditPage extends Component {
  handleSubmit = this.handleSubmit.bind(this);
  state = {
    email: '',
    inFlight: true,
    isAdmin: false,
    name: '',
    password: ''
  };

  async componentDidMount() {
    const { data: { user } } = await this.props.fetchApi('GET', `users/${this.getId()}`);
    this.setState({
      email: user.email,
      inFlight: false,
      isAdmin: user.isAdmin,
      name: user.name
    });
  }

  getId() {
    const path = this.props.location.pathname.split('/');
    return path[path.length - 1];
  }

  async handleSubmit(event) {
    event.preventDefault();

    this.setState({
      inFlight: true
    });
    await this.props.fetchApi('PUT', `users/${this.getId()}`, {
      email: this.state.email,
      isAdmin: this.state.isAdmin,
      name: this.state.name,
      password: this.state.password
    });
    this.props.history.push('/users');
  }

  isDisabled() {
    return !this.state.name || !this.state.email;
  }

  render() {
    if (this.state.inFlight) {
      return 'Loading...';
    }

    return (
      <div className="UserEditPage">
        <h1>Edit User</h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              onChange={(event) => this.updateField('name', event)}
              placeholder="Name"
              type="text"
              value={this.state.name}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              onChange={(event) => this.updateField('email', event)}
              placeholder="Email"
              type="email"
              value={this.state.email}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              onChange={(event) => this.updateField('password', event)}
              placeholder="Leave blank to keep unchanged"
              type="password"
              value={this.state.password}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              checked={this.state.isAdmin}
              label="Admin?"
              onChange={(event) => this.updateField('isAdmin', event, true)}
              type="checkbox"
            />
          </Form.Group>

          <Button disabled={this.isDisabled()} type="submit" variant="primary">
            Submit
          </Button>
        </Form>
      </div>
    );
  }

  updateField(key, event, checkbox) {
    this.setState({
      [key]: checkbox ? event.target.checked : event.target.value
    });
  }
};

export default withRouter(UserEditPage);
