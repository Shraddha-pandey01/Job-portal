const responseHelper = require("../helpers/responseHelper");

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const error = new Error("Validation error!!");
      error.status = 400;
      error.errors = result.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return responseHelper.handleError(res, error);
    }

    req.body = result.data;
    next();
  };
};

module.exports = { validate };