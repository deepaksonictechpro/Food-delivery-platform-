const Joi = require("joi");

const phoneRegex = /^[6-9]\d{9}$/;

const updateDeliveryPartnerProfileSchema = Joi.object({

  fullName: Joi.string()
    .min(3)
    .optional(),

  phoneNumber: Joi.string()
    .pattern(phoneRegex)
    .optional()
    .messages({
      "string.pattern.base": "Phone number must be valid 10 digit Indian number"
    }),

  vehicleType: Joi.string()
    .optional(),

  vehicleNumber: Joi.string()
    .optional(),

  drivingLicenseNumber: Joi.string()
    .optional(),

  totalDeliveries: Joi.number()
    .integer()
    .min(0)
    .optional(),

  earnings: Joi.number()
    .min(0)
    .optional()

});

module.exports = {
  updateDeliveryPartnerProfileSchema
};