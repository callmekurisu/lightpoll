const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.options = !isEmpty(data.options) ? data.options : '';

  if (!Validator.isLength(data.title, { min: 3, max: 30 })) {
    errors.title = 'Poll title must be between 10 and 100 characters';
  }

  if (Validator.isEmpty(data.title)) {
    errors.title = 'Title field is required';
  }

  if (Validator.isEmpty(data.options)) {
    errors.options = 'Options are required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
