import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profile-actions';
import Spinner from '../common/Spinner';
import CreatePoll from '../poll/CreatePoll';
import banner from '../../img/banner.jpg';
import PollContainer from '../poll/PollContainer';
class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  onDeleteClick(e) {
    this.props.deleteAccount();
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;
    let dashboardContent;

    if (profile === null || loading) {
      dashboardContent = <Spinner />;
    } else {
      // Check if logged in user has profile data
      if (Object.keys(profile).length > 0) {
        dashboardContent = (
          <div>
            <p className="lead text-muted">
              What's up <Link to={`/profile/${profile.handle}`}>{user.username}</Link>!
            </p>
            <h3>Stats</h3>
              <p>Polls Created: {this.props.poll.polls.length}</p>
              <p>Satoshis Available: </p>
              <p>Total Satoshis Added: {profile.satsAdded} </p>
              <p>Total Satoshis Earned: {profile.satsEarned}</p>
            <CreatePoll/>
            <hr/>
            <div className="dashboard-polls">
              <h3>Your Polls</h3>
              <PollContainer/>
            </div>
            <div style={{ marginBottom: '60px' }} />
            <button
              onClick={this.onDeleteClick.bind(this)}
              className="btn btn-danger">
              Delete My Account
            </button>
          </div>
        );
      } else {
        // User is logged in but has no profile
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p>You have not yet setup a profile, please add some info</p>
            <Link to="/create-profile" className="btn btn-lg btn-info">
              Create Profile
            </Link>
          </div>
        );
      }
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <img src={banner} alt="banner"/>
              <br/>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
  poll: state.poll
});

export default 
  connect(mapStateToProps,
    { getCurrentProfile,
      deleteAccount
    })(Dashboard);