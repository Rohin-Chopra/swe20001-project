import { Component } from 'react';

import { withRouter } from 'react-router';

import fetchApi from 'utils/fetchApi';

const LOCAL_STORAGE_KEY = 'auth_token';

class AuthWrapper extends Component {
  authToken = localStorage.getItem(LOCAL_STORAGE_KEY);
  fetchApi = this.fetchApi.bind(this);
  handleLogin = this.handleLogin.bind(this);
  handleLogout = this.handleLogout.bind(this);
  state = {
    inFlight: true,
    user: null
  };

  async componentDidMount() {
    const isAuthed = await this.verify();
    if (!isAuthed) {
      this.props.history.push('/login');
    }

    this.setState({
      inFlight: false
    });
  }

  fetchApi(method, endpoint, data) {
    return fetchApi(method, endpoint, data, {
      Authorization: `Bearer ${this.authToken}`
    });
  }

  handleLogin(user) {
    this.setState({
      user
    });
    this.storeToken(user);
    this.props.history.push('/');
  }

  handleLogout() {
    this.storeToken();
    this.setState({
      user: null
    });
    this.props.history.push('/login');
  }

  render() {
    if (this.state.inFlight) {
      return <div>Loading...</div>;
    }

    return this.props.children({
      fetchApi: this.fetchApi,
      onLogin: this.handleLogin,
      onLogout: this.handleLogout,
      user: this.state.user
    });
  }

  storeToken({ token = null } = {}) {
    this.authToken = token;

    if (token) {
      localStorage.setItem(LOCAL_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }

  async verify() {
    if (!this.authToken) {
      return false;
    }

    try {
      const user = await fetchApi('GET', 'auth/verify', {
        token: this.authToken
      });
      this.storeToken(user);
      this.setState({
        user
      });
      return true;
    } catch {
      return false;
    }
  }
}

export default withRouter(AuthWrapper);
