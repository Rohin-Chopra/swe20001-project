import { Component } from 'react';

import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import RecordTable from 'components/RecordTable';
import formatDate from 'utils/formatDate';

export default class SalesPage extends Component {
  state = {
    inFlight: true,
    sales: []
  };

  componentDidMount() {
    this.fetchSales();
  }

  async deleteSale(sale) {
    if (!window.confirm('Are you sure?')) {
      return;
    }

    this.setState({
      inFlight: true
    });
    await this.props.fetchApi('DELETE', `sales/${sale._id}`);
    await this.fetchSales();
  }

  async fetchSales() {
    const { data } = await this.props.fetchApi('GET', 'sales');
    this.setState({
      inFlight: false,
      sales: data.sales
    });
  }

  getItemsSoldThisMonth() {
    return this.getSalesThisMonth()
      .map((sale) => sale.items.filter((item) => item.item).map((item) => item.quantity))
      .flat()
      .reduce((prev, curr) => prev + curr, 0)
  }

  getSalesThisMonth() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // pretty redundant since we can't sell in the future!
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getDate() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    return this.state.sales.filter((sale) => {
      const createdAt = new Date(sale.createdAt);
      return createdAt >= startOfMonth && createdAt <= endOfMonth;
    });
  }

  getTopSellingItemThisMonth() {
    const items = this.getSalesThisMonth()
      .map((sale) => sale.items.filter((item) => item.item))
      .flat();
    if (items.length === 0) {
      return 'N/A';
    }

    if (items.length > 1) {
      items.sort((a, b) => b.quantity - a.quantity);
    }

    return items[0].item.name;
  }

  render() {
    return (
      <div className="SalesPage">
        <h1>Sales</h1>
        <LinkContainer to="/sales/new">
          <Button variant="primary">Add</Button>
        </LinkContainer>
        <RecordTable>
          <thead>
            <tr>
              <th>Created At</th>
              <th>Customer Name</th>
              <th>Customer Email</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.renderSales()}
          </tbody>
        </RecordTable>
        <h1>This Month</h1>
        <div>
          <div>Items sold: {this.getItemsSoldThisMonth()}</div>
          <div>Top selling item: {this.getTopSellingItemThisMonth()}</div>
        </div>
      </div>
    );
  }

  renderSales() {
    const { inFlight, sales } = this.state;

    if (inFlight) {
      return (
        <tr>
          <td colSpan="100%">Loading...</td>
        </tr>
      );
    }

    if (sales.length === 0) {
      return (
        <tr>
          <td colSpan="100%">There are no sales</td>
        </tr>
      );
    }

    return sales.map((sale) => {
      const items = sale.items.filter((item) => item.item);
      return (
        <tr key={sale._id}>
          <td>
            {formatDate(sale.createdAt)}
          </td>
          <td>
            {sale.customer.name}
          </td>
          <td>
            {sale.customer.email}
          </td>
          <td>
            {items.length > 0 ? (
              items.map((item) => <div key={item.item._id}>{item.item.name} x {item.quantity}</div>)
            ) : 'None'}
          </td>
          <td>
            <LinkContainer to={`/sales/${sale._id}`}>
              <Button variant="warning">
                Edit
              </Button>
            </LinkContainer>
            <Button onClick={() => this.deleteSale(sale)} variant="danger">
              Delete
            </Button>
          </td>
        </tr>
      );
    });
  }
}
