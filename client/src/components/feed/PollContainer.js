import React, { Component } from 'react';
import { getPolls } from '../../actions/poll-actions';
import { connect } from 'react-redux';
import DashboardPollCard from './FeedPollCard';

class PollContainer extends Component {

  // Get the polls for the logged in user
  componentDidMount() {
    this.props.getPolls();
  }
render(){
  return(
    <>
      <div className="poll-display">
      {/* Display message for first time pollers */}
      {this.props.poll.polls.length === 0 &&
      <p>Nothing here! Create a poll!</p>}
      {/* Otherwise display the user's polls */}
      { this.props.poll.polls.length > 0 &&
        this.props.poll.polls.map(poll =>
          <DashboardPollCard
          key={poll._id}
          title={poll.title}
          date={poll.date}
          options={poll.options}
          balance={poll.balance}
          paying={poll.paying}
          pollId={poll._id}/>
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
    { getPolls })(PollContainer);