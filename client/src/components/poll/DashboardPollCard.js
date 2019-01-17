import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addBalance, deletePoll } from '../../actions/poll-actions';
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
       pollId: '',
       openInvoice: false,
       paid: false,
       error: "Could not generate invoice"
      };
    }
  generateInvoice = (pollId) =>{
    PayClient.get(`invoice/lightpoll/${this.state.amount}`)
      .then((response) => {
        this.setState({
          ...this.state,
          invoice: response.data.invoice,
          hash: response.data.hash,
          pollId,
          openInvoice: true
        })
      }).catch(err => {
         // Open error dialog
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
            // Call server to verify payment and add balance
            const pollId = this.state.pollId;
            const amt = this.state.amount;
            const hash = this.state.hash;
            this.props.addBalance(pollId, amt, hash);
            // work around until figuring out to update state in real time
            window.location.reload();
          } else {
          this.setState({
            ...this.state,
            paid: false,
            openInvoice: false
          })
        }
      }).catch(err => {
          // Open error dialog
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
          <CardSubtitle>
            Poll #: {this.props.pollId}
          </CardSubtitle>
          <br/>
          <CardSubtitle>
          {moment(this.props.date).format('MMMM Do YYYY, h:mm:ss a')}</CardSubtitle>
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
              onClick={()=>this.generateInvoice(this.props.pollId)}>Generate Invoice</button>
            }
            <button className="btn btn-danger delete-poll"
            onClick={()=>this.props.deletePoll(this.props.pollId)}>Delete Poll</button>
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
    { addBalance, deletePoll })(DashboardPollCard);