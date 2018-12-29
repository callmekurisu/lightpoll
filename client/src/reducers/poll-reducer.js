import {
    ADD_POLL,
    GET_POLLS,
    GET_POLL,
    DELETE_POLL,
    POLL_LOADING
  } from '../actions/types';
  
  const initialState = {
    polls: [],
    poll: {},
    loading: false
  };
  
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
      case GET_POLL:
        return {
          ...state,
          poll: action.payload,
          loading: false
        };
      case ADD_POLL:
        return {
          ...state,
          polls: [action.payload, ...state.polls]
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