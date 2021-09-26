import { Component } from 'react';

import { Button, Form } from 'react-bootstrap';
import { withRouter } from 'react-router';

class SalesEditPage extends Component {
  handleSubmit = this.handleSubmit.bind(this);
  state = {
    customerEmail: '',
    customerName: '',
    inFlight: false,
    items: [],
    selectedItemIds: []
  };

  componentDidMount() {
    this.setState({
      inFlight: true
    }, async () => {
      const { data: { sale } } = await this.props.fetchApi('GET', `sales/${this.getId()}`);
      this.setState({
        customerEmail: sale.customer.email,
        customerName: sale.customer.name,
        inFlight: false,
        selectedItemIds: sale.items.map((item) => item.id)
      });
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
    await this.props.fetchApi('PUT', `sales/${this.getId()}`, {
      items: this.state.selectedItemIds
    });
    this.props.history.push('/sales');
  }

  isDisabled() {
    return !this.state.customerName || !this.state.customerEmail || this.inFlight;
  }

  render() {
    if (this.state.inFlight) {
      return 'Loading...';
    }

    return (
      <div className="SalesEditPage">
        <h1>Edit Sale</h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Customer Name</Form.Label>
            <div>{this.state.customerName}</div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Customer Email</Form.Label>
            <div>{this.state.customerEmail}</div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ display: 'block' }}>Items</Form.Label>
            <Form.Text className="text-muted">
              This is not supported yet.
            </Form.Text>
          </Form.Group>

          <Button disabled={this.isDisabled()} type="submit" variant="primary">
            Submit
          </Button>
        </Form>
      </div>
    );
  }

  updateField(key, event) {
    this.setState({
      [key]: event.target.value
    });
  }
};

export default withRouter(SalesEditPage);
