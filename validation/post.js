const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";
  // data.vpath = !isEmpty(data.vpath) ? data.vpath : "";

  if (!Validator.isLength(data.text, { min: 10, max: 10000 })) {
    errors.text = "Post must be between 10 and 10000 characters";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }
  // if (Validator.isEmpty(data.vpath)) {
  //   errors.vpath = "Please Select A Video";
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
