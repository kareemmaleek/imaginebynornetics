import React from 'react'
import usersValidator from '@/common/usersValidation'

export default async function signup(req, res){

    try{
        if(req.method !== 'POST') return res.status(403).json({message: 'Not Allowed!'})
        
        const data = req.body
        const {email, pwd, confirmPwd} = data

        let {error} = usersValidator(data)

        if(error){
            res.status(200).json({message: error.details[0].message})
        }else{
            res.status(200).json({message: email+pwd+confirmPwd})
        }
    }catch(errs){
        res.status(403).json({message: errs})
    }
}