import { Router } from 'express';
import { driveController } from '../controllers'

const router = Router();

router.get('/' , driveController.rootDrive);


export const driveRouter = router;