import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import { connect } from 'react-redux';
import { addPoll, toggleAddPoll } from '../../actions/poll-actions';
class CreatePoll extends Component {
  constructor(props) {
    super(props);
        this.state = {
          title: "",
          options: "",
        };
      }

getTitle = (e) => {
  this.setState({
    ...this.state,
    title: e.target.value
  })
}

getOptions = (e) => {
    this.setState({
      ...this.state,
      options: e.target.value
    })
  }

render() {
  const pollData = {
    title: this.state.title,
    options: this.state.options
  }
  return(
    <div>
      <Button color="primary" onClick={this.props.toggleAddPoll}>CreatePoll</Button>
        <Modal isOpen={this.props.poll.modal} toggle={this.props.toggleAddPoll} className={this.props.className}>
          <ModalHeader >New Poll</ModalHeader>
          <ModalBody>
          <InputGroup>
            <InputGroupAddon addonType="prepend">Title: </InputGroupAddon>
            <Input placeholder="title goes here" onChange={this.getTitle}/>
          </InputGroup>
          <br/>
          <InputGroup>
            <InputGroupAddon addonType="prepend">Options: </InputGroupAddon>
            <Input placeholder="Option 1, Option 2, etc." onChange={this.getOptions}/>
          </InputGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={()=>this.props.addPoll(pollData)}>Add Poll</Button>
            <Button color="secondary" onClick={this.props.toggleAddPoll}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
      );
  };
}

const mapStateToProps = state => ({
    poll: state.poll
  });
export default connect( 
  mapStateToProps, {
      addPoll, toggleAddPoll
  })(CreatePoll);
