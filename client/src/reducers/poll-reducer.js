import {
    ADD_POLL,
    POLL_FORM,
    ADD_BALANCE,
    GET_POLLS,
    GET_POLL,
    DELETE_POLL,
    POLL_LOADING,
    GET_USER_DB_POLLS,
    BALANCE_FORM
  } from '../actions/types';

  const initialState = {
    polls: [],
    poll: {},
    loading: false,
    balanceModal: false,
    createPollModal: false
  }
  export default function(state = initialState, action) {
    switch (action.type) {
      case POLL_LOADING:
        return {
          ...state,
          loading: true
        };
      case GET_POLLS:
        return {
          ...state,
          polls: action.payload,
          loading: false
        };
      case GET_USER_DB_POLLS:
        return {
          ...state,
          polls: action.payload,
          loading: false
        };
      case GET_POLL:
        return {
          ...state,
          poll: action.payload,
          loading: false
        };
      case ADD_POLL:
        return {
          ...state,
          polls: [action.payload, ...state.polls],
          modal: false
        };
      case ADD_BALANCE:
        return {
          ...state,
          polls: [action.payload, ...state.polls]
        };
      case POLL_FORM:
        return {
          ...state,
          createPollModal: !state.createPollModal
        };
      case BALANCE_FORM:
        return {
          ...state,
          balanceModal: !state.balanceModal
        };
      case DELETE_POLL:
        return {
          ...state,
          polls: state.polls.filter(poll => poll._id !== action.payload)
        };
      default:
        return state;
    }
  }