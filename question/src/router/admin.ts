import express from 'express'
import * as questionController from '../controller/questionController.js'

const router = express.Router()

router.get('/', questionController.getHome)

router.post('/add-question', questionController.addQuestionPost)

export default router;