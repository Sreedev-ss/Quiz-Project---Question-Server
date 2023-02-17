import mongoose from "mongoose";
import dotEnv from 'dotenv'
dotEnv.config()

const db = mongoose.createConnection(process.env.MONGODB_URL)

db.on('error', (error) => {
    console.log(error);
})

db.once('open', () => console.log('Database Connected') )

export const questions = db.model(
    "questions",
    new mongoose.Schema({
      qid: String, // question id
      question: String, // actual question to ask e.b.. what is the sum of 1 and 2
      title: String, // a title for question e.g.. apple and orange `SEO`
      type: String, // multiple choice,single option etc..
      score: Number, // how many score question contians
      language: String, // this question is focusd on which language
      options: [], // options to choose
      answer: [], // answer index or answer itself as the first index
      code: String, // actual code displayed to user as question
      tags: [String], // tags
      category: [String], // question category e.g.. array, linkedList
      addedBy:String
    })
  );
