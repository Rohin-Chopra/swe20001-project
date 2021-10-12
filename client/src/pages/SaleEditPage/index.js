import { Component } from 'react';

import { Button, Form } from 'react-bootstrap';
import { withRouter } from 'react-router';

class SaleEditPage extends Component {
  handleSubmit = this.handleSubmit.bind(this);
  state = {
    customerEmail: '',
    customerName: '',
    inFlight: true,
    items: [],
  };

  async componentDidMount() {
    const { data: { sale } } = await this.props.fetchApi('GET', `sales/${this.getId()}`);
    this.setState({
      customerEmail: sale.customer.email,
      customerName: sale.customer.name
    });

    const { data: { items } } = await this.props.fetchApi('GET', 'items');
    this.setState({
      items: items.map((item) => {
        const saleItem = sale.items.find((saleItem) => saleItem.item && saleItem.item._id === item._id);
        return {
          ...item,
          quantity: (saleItem && saleItem.quantity) || 0
        };
      }),
      inFlight: false,
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
    return !this.state.customerName || !this.state.customerEmail;
  }

  render() {
    const { customerEmail, customerName, inFlight, items } = this.state;

    if (inFlight) {
      return 'Loading...';
    }

    return (
      <div className="SaleEditPage">
        <h1>Edit Sale</h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Customer Name</Form.Label>
            <div>{customerName}</div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Customer Email</Form.Label>
            <div>{customerEmail}</div>
          </Form.Group>

          <h2>Items</h2>
          {items.map((item) => {
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

export default withRouter(SaleEditPage);
