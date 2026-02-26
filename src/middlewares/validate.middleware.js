const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map(e => e.message),
      });
    }

    req[property] = value; // cleaned data
    next();
  };
};

module.exports = validate;