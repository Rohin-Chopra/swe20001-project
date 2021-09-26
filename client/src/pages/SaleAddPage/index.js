import { Component } from 'react';

import { Button, Form } from 'react-bootstrap';
import { withRouter } from 'react-router';

class SaleAddPage extends Component {
  handleSubmit = this.handleSubmit.bind(this);
  state = {
    customerEmail: '',
    customerName: '',
    inFlight: false,
    items: [],
    selectedItemIds: []
  };

  async handleSubmit(event) {
    event.preventDefault();

    this.setState({
      inFlight: true
    });
    await this.props.fetchApi('POST', 'sales', {
      customer: {
        email: this.state.customerEmail,
        name: this.state.customerName
      },
      items: this.state.selectedItemIds
    });
    this.props.history.push('/sales');
  }

  isDisabled() {
    return !this.state.customerName || !this.state.customerEmail || this.inFlight;
  }

  render() {
    return (
      <div className="SalesAddPage">
        <h1>Add Sale</h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              onChange={(event) => this.updateField('customerName', event)}
              placeholder="Customer Name"
              type="text"
              value={this.state.customerName}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Customer Email</Form.Label>
            <Form.Control
              onChange={(event) => this.updateField('customerEmail', event)}
              placeholder="Customer Email"
              type="email"
              value={this.state.customerEmail}
            />
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

export default withRouter(SaleAddPage);
