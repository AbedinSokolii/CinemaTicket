import { Router } from 'express'
import { me, updateMe } from './controller'

const router = Router()

router.get('/', me)
router.put('/', updateMe)

export default router