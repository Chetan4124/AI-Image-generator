import express from 'express'
import generateImage from '../controllers/imagecontroller.js'
import {registerUser,loginUser, userCredits} from '../controllers/userController.js'
import userAuth from '../middlewares/auth.js'

const userRouter =express.Router()
   

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/credits', userAuth ,userCredits)
 

export default userRouter;
