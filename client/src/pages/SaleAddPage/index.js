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
    itemsInFlight: true
  };

  async componentDidMount() {
    const { data: { items } } = await this.props.fetchApi('GET', 'items');
    this.setState({
      items: items.map((item) => ({
        ...item,
        quantity: 0
      })),
      itemsInFlight: false
    });
  }

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
      items: this.state.items
        .filter((item) => item.quantity > 0)
        .map((item) => ({
          item: item._id,
          quantity: item.quantity
        }))
    });
    this.props.history.push('/sales');
  }

  isDisabled() {
    return !this.state.customerName || !this.state.customerEmail || this.state.inFlight;
  }

  render() {
    const { customerEmail, customerName, items, itemsInFlight } = this.state;
    return (
      <div className="SaleAddPage">
        <h1>Add Sale</h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              onChange={(event) => this.updateField('customerName', event)}
              placeholder="Customer Name"
              type="text"
              value={customerName}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Customer Email</Form.Label>
            <Form.Control
              onChange={(event) => this.updateField('customerEmail', event)}
              placeholder="Customer Email"
              type="email"
              value={customerEmail}
            />
          </Form.Group>

          <h2>Items</h2>
          {itemsInFlight ? 'Loading...' : items.map((item) => {
            return (
              <Form.Group className="mb-3" key={item._id}>
                <Form.Label style={{ display: 'block' }}>{item.name}</Form.Label>
                <Form.Control
                  onChange={(event) => {
                    item.quantity = parseInt(event.target.value, 10) || '';
                    this.setState({
                      items
                    });
                  }}
                  placeholder="Quantity"
                  type="number"
                  value={item.quantity}
                />
              </Form.Group>
            );
          })}

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
