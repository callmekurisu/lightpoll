import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
const QRCode = require('qrcode.react');

class Invoice extends Component {

render() {
  return(
    <div>
    <Dialog className="invoice"
      open={this.props.open}
      onClose={this.props.close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle className="invoice" id="alert-dialog-title">
        Lightpoll Invoice
      </DialogTitle>
      <DialogContent>
      <DialogContentText className="invoice">
        Poll #: {this.props.pollId}
     </DialogContentText>
     <DialogContentText className="invoice">
         Amount: {this.props.amount} (satoshis)
        </DialogContentText>
        <br/>
      <QRCode className="invoice" value={this.props.invoice} />
      <br/>
      <p className="invoice">Payment Request: {this.props.invoice}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={this.props.close} color="primary">
            Close
        </Button>
      </DialogActions>
    </Dialog>
  </div>
    );
  };
}

export default Invoice
