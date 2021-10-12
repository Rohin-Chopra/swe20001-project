import { Component } from 'react';

import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import RecordTable from 'components/RecordTable';
import formatDate from 'utils/formatDate';

export default class ItemsPage extends Component {
  state = {
    inFlight: true,
    items: []
  };

  componentDidMount() {
    this.fetchItems();
  }

  async deleteItem(item) {
    if (!window.confirm('Are you sure?')) {
      return;
    }

    this.setState({
      inFlight: true
    });
    await this.props.fetchApi('DELETE', `items/${item._id}`);
    await this.fetchItems();
  }

  async fetchItems() {
    const { data } = await this.props.fetchApi('GET', 'items');
    this.setState({
      inFlight: false,
      items: data.items
    });
  }

  render() {
    return (
      <div className="ItemsPage">
        <h1>Items</h1>
        <LinkContainer to="/items/new">
          <Button variant="primary">Add</Button>
        </LinkContainer>
        <RecordTable>
          <thead>
            <tr>
              <th>Created At</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock</th>
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
    const { inFlight, items } = this.state;

    if (inFlight) {
      return (
        <tr>
          <td colSpan="100%">Loading...</td>
        </tr>
      );
    }

    if (items.length === 0) {
      return (
        <tr>
          <td colSpan="100%">There are no items</td>
        </tr>
      );
    }

    return items.map((item) => (
      <tr key={item._id}>
        <td>
          {formatDate(item.createdAt)}
        </td>
        <td>
          {item.name}
        </td>
        <td>
          {item.description}
        </td>
        <td>
          ${item.price.toFixed(2)}
        </td>
        <td>
          {item.stock}
        </td>
        <td>
          <LinkContainer to={`/items/${item._id}`}>
            <Button variant="warning">
              Edit
            </Button>
          </LinkContainer>
          <Button onClick={() => this.deleteItem(item)} variant="danger">
            Delete
          </Button>
        </td>
      </tr>
    ));
  }
}
