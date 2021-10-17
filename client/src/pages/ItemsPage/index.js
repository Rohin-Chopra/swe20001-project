import { Component } from 'react';

import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import RecordTable from 'components/RecordTable';
import formatDate from 'utils/formatDate';

export default class ItemsPage extends Component {
  state = {
    inFlight: true,
    items: [],
    sort: ['name', false]
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
              <th className="sortable" onClick={() => this.setSort('name')}>
                Name
                {this.renderSort('name')}
              </th>
              <th>Description</th>
              <th className="sortable" onClick={() => this.setSort('price')}>
                Price
                {this.renderSort('price')}
              </th>
              <th className="sortable" onClick={() => this.setSort('stock')}>
                Stock
                {this.renderSort('stock')}
              </th>
              <th className="sortable" onClick={() => this.setSort('category')}>
                Category
                {this.renderSort('category')}
              </th>
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
    const { inFlight, items, sort: [key, descending] } = this.state;

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

    const sortedItems = [...items].sort((a, b) => {
      if (a[key] > b[key]) {
        return descending ? -1 : 1;
      }

      if (b[key] > a[key]) {
        return descending ? 1 : -1;
      }

      return 0;
    });

    return sortedItems.map((item) => (
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
          {item.category}
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

  renderSort(key) {
    const { sort: [currentKey, descending] } = this.state;
    return currentKey === key && (
      <span>
        &nbsp;
        {descending ? <span>&darr;</span> : <span>&uarr;</span>}
      </span>
    );
  }

  setSort(key) {
    const { sort: [currentKey, descending] } = this.state;

    this.setState({
      sort: [key, key === currentKey && !descending]
    });
  }
}
