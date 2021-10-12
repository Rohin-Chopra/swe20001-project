import { Component } from 'react';

import { Button, Form } from 'react-bootstrap';
import { withRouter } from 'react-router';

class ItemAddPage extends Component {
  handleSubmit = this.handleSubmit.bind(this);
  state = {
    description: '',
    inFlight: false,
    name: '',
    price: 0,
    stock: 0
  };

  async handleSubmit(event) {
    event.preventDefault();

    this.setState({
      inFlight: true
    });
    await this.props.fetchApi('POST', 'items', {
      description: this.state.description,
      name: this.state.name,
      price: this.state.price,
      stock: this.state.stock
    });
    this.props.history.push('/items');
  }

  isDisabled() {
    return !this.state.name || !this.state.description || this.state.inFlight;
  }

  render() {
    return (
      <div className="ItemAddPage">
        <h1>Add Item</h1>
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
            <Form.Label>Description</Form.Label>
            <Form.Control
              onChange={(event) => this.updateField('description', event)}
              placeholder="Description"
              type="text"
              value={this.state.description}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              onChange={(event) => this.updateField('price', event, true)}
              placeholder="Price"
              type="number"
              value={this.state.price}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              onChange={(event) => this.updateField('stock', event, true)}
              placeholder="Stock"
              type="number"
              value={this.state.stock}
            />
          </Form.Group>

          <Button disabled={this.isDisabled()} type="submit" variant="primary">
            Submit
          </Button>
        </Form>
      </div>
    );
  }

  updateField(key, event, number) {
    this.setState({
      [key]: number ? (parseInt(event.target.value || '0', 10) || '') : event.target.value
    });
  }
};

export default withRouter(ItemAddPage);
