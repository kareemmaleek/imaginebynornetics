import Joi from "joi";

const uploadArtValidation = async (data) => {
  const scheme = Joi.object({
    engine: Joi.string().required(),
    images: Joi.any().required(),
  });

  //engine: Joi.string().required(),

  return scheme.validateAsync(data);
};

export default uploadArtValidation;
