import { Component } from 'react';

import { Button, Form } from 'react-bootstrap';
import { withRouter } from 'react-router';

class UserAddPage extends Component {
  handleSubmit = this.handleSubmit.bind(this);
  state = {
    email: '',
    inFlight: false,
    isAdmin: true,
    name: '',
    password: ''
  };

  async handleSubmit(event) {
    event.preventDefault();

    this.setState({
      inFlight: true
    });
    await this.props.fetchApi('POST', 'users', {
      email: this.state.email,
      isAdmin: this.state.isAdmin,
      name: this.state.name,
      password: this.state.password
    });
    this.props.history.push('/users');
  }

  isDisabled() {
    return !this.state.name || !this.state.email || !this.state.password || this.state.inFlight;
  }

  render() {
    return (
      <div className="UserAddPage">
        <h1>Add User</h1>
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
              placeholder="Password"
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

export default withRouter(UserAddPage);
