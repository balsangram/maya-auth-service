import Joi from "joi";

export const editProfileValidation = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional(),

  username: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional(),

  bio: Joi.string()
    .trim()
    .max(500)
    .optional(),

  dateOfBirth: Joi.date()
    .iso()
    .max("now")
    .optional(),

  gender: Joi.string()
    .valid("male", "female", "other")
    .optional(),

  education: Joi.string()
    .trim()
    .max(150)
    .optional(),

  profession: Joi.string()
    .trim()
    .max(150)
    .optional(),

  hobbies: Joi.alternatives()
    .try(
      Joi.array()
        .items(
          Joi.string()
            .trim()
            .min(1)
            .max(50)
        )
        .max(20),

      Joi.string()
    )
    .optional(),

  languages: Joi.alternatives()
    .try(
      Joi.array()
        .items(
          Joi.string()
            .trim()
            .min(1)
            .max(50)
        )
        .max(20),

      Joi.string()
    )
    .optional(),

  address: Joi.string()
    .trim()
    .max(300)
    .optional(),

  country: Joi.string()
    .trim()
    .max(100)
    .optional(),

  state: Joi.string()
    .trim()
    .max(100)
    .optional(),

  district: Joi.string()
    .trim()
    .max(100)
    .optional(),

  pin: Joi.string()
    .trim()
    .pattern(/^[0-9]{4,10}$/)
    .optional()
    .messages({
      "string.pattern.base": "PIN must contain 4 to 10 digits",
    }),

  isProfilePublic: Joi.alternatives()
    .try(
      Joi.boolean(),
      Joi.string().valid("true", "false")
    )
    .optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one profile field is required",
  });
