import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, CardBody,
  CardTitle, CardSubtitle } from 'reactstrap';
import moment from 'moment';


class FeedPollCard extends Component {

comment = (option) => {
  console.log(`Vote for ${option}?`)
}
render(){ 
  // Make the string from the database iterable
  const arr = this.props.options[0].split(",");
  return (
    <div className="poll-card shadow-lg p-3 mb-5 bg-white rounded">
      <Card>
        <CardBody>
          <CardTitle><strong>{this.props.title}</strong></CardTitle>
          <CardSubtitle>{moment(this.props.date).format('MMMM Do YYYY, h:mm:ss a')}</CardSubtitle>
          <br/>
          <CardSubtitle>Balance: {this.props.balance}</CardSubtitle>
        </CardBody>
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
                 <td onClick={()=>this.comment(options)}>{options}</td>
                 <td>0</td>
                </tr>
                )
              }
            </tbody>
          </table>
          <br/>
        </CardBody>
      </Card>
    </div>
  );
 }
};

const mapStateToProps = state => ({
  profile: state.profile,
  poll: state.poll
});

export default
  connect(mapStateToProps,
    { })(FeedPollCard);