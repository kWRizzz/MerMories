import bcrypt from'bcrypt';
import jwt from 'jsonwebtoken';

import user from '../models/user.js';

export const signin=async(req,res)=>{
       const {email,password}=req.body;

       try{
            const existingUser=await user.findOne({email});

            if(!existingUser) return res.status(404).json({message:"user doesn't exist"})
            
             const isPassowrdCorrect=await bcrypt.compare(password,existingUser.password);

             if(!isPassowrdCorrect) return res.status(400).json( {message:"invalid credentials"})
             const token=jwt.sign({email:existingUser.email, id:existingUser._id}, 'test',{expiresIn:"1h"});

             res.status(200).json({result: existingUser,token});
            }catch(error){
              res.status(500).json({message:'something went wrong'});
       }
}
export const signup=async(req,res)=>{

    const { email,password,confirmPassword,firstName,lastName} = req.body;

    try{
           const existingUser=await user.findOne({email});
            if(existingUser) return res.status(400).json({message:"user already exist"})
            if(password!== confirmPassword) return res.status(404).json({message:"password don't match"})

            const hashedPassword=await bcrypt.hash(password,12);
            const result = await user.create({email,password:hashedPassword,name:`${firstName} ${lastName}`})

            const token=jwt.sign({email:result.email, id:result._id}, 'test',{expiresIn:"1h"});

            res.status(200).json({result: result,token});


    }catch(error){
         res.status(500).json({message:'something went wrong'});

    }
    
}