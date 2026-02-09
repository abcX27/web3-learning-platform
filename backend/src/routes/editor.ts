import { Router } from 'express';
import { EditorController } from '../controllers/editorController';

const router = Router();

// Compile Solidity code
router.post('/compile', EditorController.compile);

// Execute JavaScript code
router.post('/execute', EditorController.execute);

export default router;
