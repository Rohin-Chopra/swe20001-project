import { Component } from 'react';

import { Table } from 'react-bootstrap';

import './style.scss'

export default class RecordTable extends Component {
  render() {
    return (
      <div className="RecordTable">
        <Table bordered hover striped>
          {this.props.children}
        </Table>
      </div>
    );
  }
}
