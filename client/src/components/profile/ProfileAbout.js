import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from '../../validation/is-empty';

class ProfileAbout extends Component {
  render() {
    const { profile } = this.props;

    // Get first name
    const username = profile.user.username;


    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-light mb-3">
            <h3 className="profile-text text-center">{username}'s bio</h3>
            <p className="lead">
              {isEmpty(profile.bio) ? (
                <span>{username} does not have a bio</span>
              ) : (
                <span>{profile.bio}</span>
              )}
            </p>
            <hr />
            <p className="lead">
              {isEmpty(profile.location) ? (
                <span>{username} does not have a location</span>
              ) : (
                <span className="about">Location: {profile.location}</span>
              )}
            </p>
            <p>Github: {profile.github}</p>
          </div>
        </div>
      </div>
    );
  }
}
ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
};
export default ProfileAbout;