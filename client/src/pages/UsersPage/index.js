import { Component } from 'react';

import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import RecordTable from 'components/RecordTable';
import formatDate from 'utils/formatDate';

export default class UsersPage extends Component {
  state = {
    inFlight: true,
    users: []
  };

  componentDidMount() {
    this.fetchUsers();
  }

  async deleteUser(user) {
    if (!window.confirm('Are you sure?')) {
      return;
    }

    this.setState({
      inFlight: true
    });
    await this.props.fetchApi('DELETE', `users/${user._id}`);
    await this.fetchUsers();
  }

  async fetchUsers() {
    const { data } = await this.props.fetchApi('GET', 'users');
    this.setState({
      inFlight: false,
      users: data.users
    });
  }

  render() {
    return (
      <div className="UsersPage">
        <h1>Users</h1>
        <LinkContainer to="/users/new">
          <Button variant="primary">Add</Button>
        </LinkContainer>
        <RecordTable>
          <thead>
            <tr>
              <th>Created At</th>
              <th>Name</th>
              <th>Email</th>
              <th>Admin?</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.renderSales()}
          </tbody>
        </RecordTable>
      </div>
    );
  }

  renderSales() {
    const { inFlight, users } = this.state;

    if (inFlight) {
      return (
        <tr>
          <td colSpan="100%">Loading...</td>
        </tr>
      );
    }

    // impossible really!
    if (users.length === 0) {
      return (
        <tr>
          <td colSpan="100%">There are no users</td>
        </tr>
      );
    }

    return users.map((user) => (
      <tr key={user._id}>
        <td>
          {formatDate(user.createdAt)}
        </td>
        <td>
          {user.name}
        </td>
        <td>
          {user.email}
        </td>
        <td>
          {user.isAdmin ? 'Yes' : 'No'}
        </td>
        <td>
          <LinkContainer to={`/users/${user._id}`}>
            <Button variant="warning">
              Edit
            </Button>
          </LinkContainer>
          {user._id !== this.props.user.id && (
            <Button onClick={() => this.deleteUser(user)} variant="danger">
              Delete
            </Button>
          )}
        </td>
      </tr>
    ));
  }
}
