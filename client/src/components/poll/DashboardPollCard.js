import React, { Component } from 'react';
import { Card, CardBody,
  CardTitle, CardSubtitle } from 'reactstrap';
import Invoice from './Invoice';
import moment from 'moment';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import PayClient from '../../Axios/PayClient';

class DashboardPollCard extends Component {
  constructor(props) {
    super(props);
      this.state = {
       amount: 0,
       invoice: '',
       hash: '',
       openInvoice: false,
       paid: false,
       error: "Could not generate invoice"
      };
    }
  generateInvoice = () =>{
    PayClient.get(`invoice/lightpoll/${this.state.amount}`)
      .then((response) => {
        this.setState({
          ...this.state,
          invoice: response.data.invoice,
          hash: response.data.hash,
          openInvoice: true
        })
      }).catch(err => {
          console.log(this.state.error);
        })
      setTimeout(()=>{
        PayClient.get(`listen/${this.state.invoice}`)
          .then((response) => {
            if(response.status === 200) {
              this.setState({
                ...this.state,
                paid: true,
                openInvoice: false
            })
            // call action to add balance to poll
            //  console.log(`Got ${this.state.amount} satoshis`)
          } else {
          this.setState({
            ...this.state,
            paid: false,
            openInvoice: false
          })
        }
      }).catch(err => {
          console.log(this.state.error);
          })
        }, 5000)
      };
  // pass amount to state
  handleAmount = (e) => {
      this.setState({
        ...this.state,
        amount: e.target.value,
      })
    }

  //Close button on paywall
    handleClose = () => {
      this.setState({ openInvoice: false });
    };
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
                 <td>{options}</td>
                 <td>0</td>
                </tr>
                )
              }
            </tbody>
          </table>
          <div className="amount">
            { this.props.paying === false &&
              <InputGroup>
                <InputGroupAddon addonType="prepend" >$ satoshis</InputGroupAddon>
                <Input placeholder="30 satoshis minimum" onChange={this.handleAmount}/>
              </InputGroup>
            }
            </div>
            <Invoice
            invoice={this.state.invoice}
            open={this.state.openInvoice}
            amount={this.state.amount}
            close={this.handleClose}
            pollId={this.props.pollId}/>
          <br/>
            { this.state.amount >= 30 &&
              <button className="btn btn-primary invoice-btn"
              onClick={this.generateInvoice}>Generate Invoice</button>
            }
            <button className="btn btn-danger delete-poll">Delete Poll</button>
        </CardBody>
      </Card>
    </div>
  );
 }
};

export default DashboardPollCard;