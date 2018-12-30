import React, { Component } from 'react';
import { getUserDbPolls } from '../../actions/poll-actions';
import { connect } from 'react-redux';
import DashboardPollCard from './DashboardPollCard';

class PollContainer extends Component {

  // Get the polls for the logged in user
  componentDidMount() {
    const id = this.props.profile.profile.user._id;
    this.props.getUserDbPolls(id)
  }
render(){
  return(
    <>
      <div className="poll-display">
      {
        this.props.poll.polls.map(poll => 
          <DashboardPollCard
          key={poll._id}
          title={poll.title}
          date={poll.date}
          options={poll.options}
          balance={poll.balance}/>
        )
      }
      </div>
    </>
  )
 }
};

const mapStateToProps = state => ({
  profile: state.profile,
  poll: state.poll
});

export default
  connect(mapStateToProps,
    { getUserDbPolls })(PollContainer);