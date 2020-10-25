const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateVideoInput(data) {
  let errors = {};

  data.description = !isEmpty(data.description) ? data.description : "";
  data.title = !isEmpty(data.title) ? data.title : "";
  data.genre = !isEmpty(data.genre) ? data.genre : "";
  // data.from = !isEmpty(data.from) ? data.from : "";

  if (!Validator.isLength(data.description, { min: 10, max: 600 })) {
    errors.description = "Description must be between 10 and 600 characters";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "Description field is required";
  }
  // if (Validator.isEmpty(data.from)) {
  //   errors.from = "From date field is required";
  // }
  if (!Validator.isLength(data.title, { min: 7, max: 60 })) {
    errors.title = "title must be between 7 and 60 characters";
  }
  if (Validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
