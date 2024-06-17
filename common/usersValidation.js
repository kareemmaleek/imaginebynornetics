import Joi from "joi"

const usersValidator = (data) => {
    const scheme = Joi.object({
        email: Joi.string().email({minDomainSegments: 2}).required(),
        pwd: Joi.string().required(),
        confirmPwd: Joi.ref('pwd')
    })

    // const scheme = Joi.object({
    //     email: Joi.string().required(),
    //     pwd: Joi.string().required(),
    //     confirmPwd: Joi.string().required()
    // })

    return scheme.validate(data)
}

export default usersValidator