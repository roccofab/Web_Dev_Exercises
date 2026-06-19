import express from 'express'
import { login } from '../controllers/authController'
import {loginLimiter} from '../middleware/auth'

const router = express.Router()

router.post('/login', loginLimiter, login)

export default router