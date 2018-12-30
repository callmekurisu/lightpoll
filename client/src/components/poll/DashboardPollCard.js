import React, { Component } from 'react';
import { Card, CardText, CardBody, CardLink,
  CardTitle, CardSubtitle } from 'reactstrap';

class DashboardPollCard extends Component {

render(){
  // Make the string from the database iterable
  const arr = this.props.options[0].split(",");
  return (
    <div className="poll-card shadow-lg p-3 mb-5 bg-white rounded">
      <Card>
        <CardBody>
          <CardTitle><strong>{this.props.title}</strong></CardTitle>
          <CardSubtitle>{this.props.date}</CardSubtitle>
          <br/>
          <CardSubtitle>Balance: {this.props.balance}</CardSubtitle>
        </CardBody>
        <img width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" alt="Poll" />
        <CardBody>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Choices</th>
                <th>Votes</th>
              </tr>
            </thead>
              <tbody>
              {
               arr.map((options,index)=>
               <tr key={index}>
                 <td>{options}</td>
                 <td>0</td>
                </tr>
                )
              }
            </tbody>
          </table>
          <div className="poll-card-footer">
            <button className="btn btn-primary">Add Balance</button>
            <button className="btn btn-danger">Delete Poll</button>          
          </div>
        </CardBody>
      </Card>
    </div>
  );
 }
};

export default DashboardPollCard;