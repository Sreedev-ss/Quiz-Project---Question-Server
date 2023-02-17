import {Request,Response} from 'express';
import {addQuestion} from '../services/question.js'

export const getHome = (req:Request, res:Response) => {
    res.send('Hi from server2')
}

export const addQuestionPost = async (req:Request, res:Response) => {
    try {
        await addQuestion(req.body)
    } catch (error) {
        
    }
}
    


    



