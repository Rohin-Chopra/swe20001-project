import { Component } from 'react';

import { Button, Form } from 'react-bootstrap';
import { withRouter } from 'react-router';

class ItemEditPage extends Component {
  handleSubmit = this.handleSubmit.bind(this);
  state = {
    description: '',
    inFlight: true,
    name: '',
    price: 0,
    stock: 0
  };

  async componentDidMount() {
    const { data: { item } } = await this.props.fetchApi('GET', `items/${this.getId()}`);
    this.setState({
      description: item.description,
      inFlight: false,
      name: item.name,
      price: item.price,
      stock: item.stock
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
    await this.props.fetchApi('PUT', `items/${this.getId()}`, {
      description: this.state.description,
      name: this.state.name,
      price: this.state.price,
      stock: this.state.stock
    });
    this.props.history.push('/items');
  }

  isDisabled() {
    return !this.state.name || !this.state.description;
  }

  render() {
    if (this.state.inFlight) {
      return 'Loading...';
    }

    return (
      <div className="ItemEditPage">
        <h1>Edit Item</h1>
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
      [key]: number ? (parseInt(event.target.value, 10) || '') : event.target.value
    });
  }
};

export default withRouter(ItemEditPage);
