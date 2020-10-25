const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEntryInput(data) {
  let errors = {};

  data.description = !isEmpty(data.description) ? data.description : "";
  data.title = !isEmpty(data.title) ? data.title : "";

  if (!Validator.isLength(data.description, { min: 10, max: 600 })) {
    errors.description = "Description must be between 10 and 600 characters";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "Description field is required";
  }
  // if (Validator.isEmpty(data.vpath)) {
  //   errors.vpath = "Please Select A Video";
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
