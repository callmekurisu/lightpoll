import PollClient from '../Axios/PollClient';

import {
  ADD_POLL,
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_POLLS,
  GET_POLL,
  POLL_LOADING,
  DELETE_POLL
} from './types';

// Add Poll
export const addPoll = pollData => dispatch => {
  dispatch(clearErrors());
  PollClient
    .post('/api/poll', pollData)
    .then(res =>
      dispatch({
        type: ADD_POLL,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get Polls
export const getPolls = () => dispatch => {
  dispatch(setPollLoading());
  PollClient
    .get('/api/polls')
    .then(res =>
      dispatch({
        type: GET_POLLS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POLLS,
        payload: null
      })
    );
};

// Get Poll
export const getPoll = id => dispatch => {
  dispatch(setPollLoading());
  PollClient
    .get(`/api/polls/${id}`)
    .then(res =>
      dispatch({
        type: GET_POLL,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POLL,
        payload: null
      })
    );
};

// Delete Poll
export const deletePoll = id => dispatch => {
  PollClient
    .delete(`/api/polls/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_POLL,
        payload: id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add Like
export const addLike = id => dispatch => {
  PointerEvent
    .post(`/api/polls/like/${id}`)
    .then(res => dispatch(getPolls()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Remove Like
export const removeLike = id => dispatch => {
  PointerEvent
    .post(`/api/polls/unlike/${id}`)
    .then(res => dispatch(getPolls()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add Comment
export const addComment = (pollId, commentData) => dispatch => {
  dispatch(clearErrors());
  PollClient
    .post(`/api/polls/comment/${pollId}`, commentData)
    .then(res =>
      dispatch({
        type: GET_POLL,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete Comment
export const deleteComment = (pollId, commentId) => dispatch => {
  PollClient
    .delete(`/api/polls/comment/${pollId}/${commentId}`)
    .then(res =>
      dispatch({
        type: GET_POLL,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set loading state
export const setPollLoading = () => {
  return {
    type: POLL_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};