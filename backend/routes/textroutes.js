import express from 'express'
import generateText from '../controllers/textcontroller.js'
import userAuth from '../middlewares/auth.js'

const textRouter = express.Router()

textRouter.post('/generate-text', userAuth, generateText)

export default textRouter
