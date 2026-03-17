function validate(schema, property = 'body') {
  if (!schema) {
    throw new Error(
      `Validation schema is undefined. Check your imports or schema definition.`
    );
  }

  return (req, res, next) => {
    const dataToValidate = req[property];

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true, 
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    req[property] = value;

    next();
  };
}

module.exports = validate;