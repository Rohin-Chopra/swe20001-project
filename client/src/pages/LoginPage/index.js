import { Component } from 'react';

import { Button, Form } from 'react-bootstrap';

import fetchApi from 'utils/fetchApi';

export default class LoginPage extends Component {
  handleSubmit = this.handleSubmit.bind(this);
  state = {
    email: '',
    inFlight: false,
    incorrect: false,
    password: ''
  };

  async handleSubmit(event) {
    event.preventDefault();

    this.setState({
      inFlight: true
    });

    try {
      const user = await fetchApi('POST', 'auth/login', {
        email: this.state.email,
        password: this.state.password
      });
      this.props.onLogin(user);
    } catch {
      this.setState({
        inFlight: false,
        incorrect: true
      });
    }
  }

  isDisabled() {
    return !this.state.email || !this.state.password || this.inFlight;
  }

  render() {
    return (
      <div className="LoginPage">
        <h1>Log In</h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              onChange={(event) => this.updateField('email', event)}
              placeholder="Email Address"
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

          <Button disabled={this.isDisabled()} type="submit" variant="primary">
            Log In
          </Button>
        </Form>
        {this.state.incorrect && <div className="mt-3 text-danger">Sorry, that is incorrect</div>}
      </div>
    );
  }

  updateField(key, event) {
    this.setState({
      [key]: event.target.value
    });
  }
}
