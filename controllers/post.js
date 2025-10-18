import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts= async(req,res)=>{
    const { page}=req.query;
   try {
       const LIMIT = 8;
       const startIndex=(Number(page)-1)*LIMIT;
       const total=await postMessage.countDocuments({});

       const posts= await postMessage.find().sort({_id:-1}).limit(LIMIT).skip(startIndex);

       

       res.status(200).json({data:posts,currentPage: Number(page),numberOfPage:Math.ceil(total/LIMIT)});
   }
   catch (error) {
    res.status(404).json({message: error.message})
     
   }
}

export const getPostBySearch=async(req,res)=>{
    const {searchQuery,tags}=req.query
    try {
        const title =new RegExp(searchQuery,'i');

        const posts = await postMessage.find({or: [{title},{tags:{ $in: tags.split(',') }}]})

        res.json({data:posts});
        
    } catch (error) {
        res.status(404).json({message:error.message})
    }

}

export const getPost=async(req,res)=>{
    const {id}=rq.params;

    
    try{
           const post=await PostMessage.findById(id);
           res.status(200).json(post);
    }
    catch(error){
         res.status(404).json({ message: error.message});


    }
}

export const createPost=async(req,res)=>{
    const post=req.body;

    const newPost=new PostMessage({ ...post,creator: req.userId,createdAt: new Date().toISOString});
    try{
            await newPost.save();

            res.status(201).json(newPostMessage);
    }
    catch(error){
         res.status(409).json({ message: error.message});


    }
}



export const updatePost= async (req,res)=>{
    const {id: _id}=req.params;
    const post=req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('no post with that id');

    
    const updatePost= await PostMessage.findByIdAndUpdate(_id,{ ...post,_id},{ new:true});

    res.json(updatePost);

}

export const deletePost=async(req,res)=>{
    const {id} = req.params;
     if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('no post with that id');

     await PostMessage.findByIdAndRemove(id);


     res.json({message: 'post deleted succesfully'});
    
}
export const likesPost=async(req,res)=>{
    const {id} = req.params;

    if(!req.userid) return res.json({message: 'Unauthenticated'});

     if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('no post with that id');

     const post=await postMessage.findById(id);
      
     const index=post.likes.findIndex((id)=> id === String(req.userId));

     if(index ===-1){
        post.likes.push(req.userId);
     }else{
        post.likes.filter((id)=> id!==String(req,userId));

     }

     const updatedPost = await PostMessage.findByIdAndUpdate(id,post,{new:true})

     res.status(200).json(updatedPost);
}

export const commentPost=async(req,res)=>{
       const {id}=req.params;
       const {value} = req.body;

       const post=await PostMessage.findById(id);

       post.comments.push(value);

       const updatedPost=await PostMessage.findByIdAndUpdate(id,post,{new:true})

       res.json(updatedPost);
}

