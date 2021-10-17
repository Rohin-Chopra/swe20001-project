import { Component } from 'react';

import { Button } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import { LinkContainer } from 'react-router-bootstrap';

import RecordTable from 'components/RecordTable';
import formatDate from 'utils/formatDate';

export default class SalesPage extends Component {
  state = {
    inFlight: true,
    items: [],
    sales: []
  };

  async componentDidMount() {
    await Promise.all([
      this.fetchSales(),
      this.fetchItems()
    ]);
    this.setState({
      inFlight: false
    });
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

  async fetchItems() {
    const { data } = await this.props.fetchApi('GET', 'items');
    this.setState({
      items: data.items
    });
  }

  async fetchSales() {
    const { data } = await this.props.fetchApi('GET', 'sales');
    this.setState({
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

  getSalesThePrevious3Months() {
    const startOfPeriod = new Date();
    startOfPeriod.setMonth(startOfPeriod.getMonth() - 3);
    startOfPeriod.setHours(0, 0, 0, 0);

    const endOfLastMonth = new Date();
    endOfLastMonth.setDate(0);
    endOfLastMonth.setHours(0, 0, 0, 0);

    return this.state.sales.filter((sale) => {
      const createdAt = new Date(sale.createdAt);
      return createdAt >= startOfPeriod && createdAt <= endOfLastMonth;
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

  predictSalesNextMonth() {
    const byId = {};
    const byCategory = {};
    const sales = this.getSalesThePrevious3Months();

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (!item.item) {
          return;
        }

        if (typeof byId[item.item._id] === 'undefined') {
          byId[item.item._id] = 0;
        }

        byId[item.item._id] += item.quantity;

        const category = item.item.category.toLowerCase();

        if (typeof byCategory[category] === 'undefined') {
          byCategory[category] = 0;
        }

        byCategory[category] += item.quantity;
      });
    });

    const earliestSale = sales[0];
    const monthDiff = (earliestSale && new Date().getMonth() - new Date(earliestSale.created_at).getMonth()) || 1;
    const averageOut = (object) => {
      return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, value / monthDiff]))
    };

    return {
      byId: averageOut(byId),
      byCategory: averageOut(byCategory)
    };
  }

  render() {
    const csvData = this.getSalesThisMonth().map((sale) => ({
      'Created At': formatDate(sale.createdAt),
      'Customer Name': sale.customer.name,
      'Customer Email': sale.customer.email,
      'Items': sale.items.map((item) => `${(item.item && item.item.name) || 'Deleted Item'} x ${item.quantity}`).join(', ')
    }));

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

          {csvData.length > 0 && (
            <CSVLink data={csvData} filename={`PHP Sales - ${formatDate(new Date())}.csv`}>
              Download CSV of this month's sales
            </CSVLink>
          )}
        </div>
        <br />
        <h1>Next Month</h1>
        {this.renderItemPredictions()}
      </div>
    );
  }

  renderItemPredictions() {
    const { inFlight, items } = this.state;
    if (inFlight) {
      return 'Loading...';
    }

    const { byId, byCategory } = this.predictSalesNextMonth();
    const categories = new Set();
    items.forEach((item) => {
      categories.add(item.category.toLowerCase());
    });

    return (
      <div>
        <div>Items sold: {Object.values(byCategory).reduce((prev, curr) => prev + curr, 0)}</div>
        <br />
        <p>These are predicted based on the prior 3 months of sales (or the earliest month if less than 3 months of data is available):</p>
        <h2>Predicted Sales By Item</h2>
        <RecordTable noPadding>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Predicted Sales</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{byId[item._id] ?? 'Inconclusive'}</td>
              </tr>
            ))}
          </tbody>
        </RecordTable>
        <h2>Predicted Sales By Category</h2>
        <RecordTable noPadding>
          <thead>
            <tr>
              <th>Category</th>
              <th>Predicted Sales</th>
            </tr>
          </thead>
          <tbody>
            {[...categories].map((category) => (
              <tr key={category}>
                <td>{category}</td>
                <td>{byCategory[category] ?? 'Inconclusive'}</td>
              </tr>
            ))}
          </tbody>
        </RecordTable>
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
