import { Router } from "express";
import {
  createApiKeyController,
  deleteApiKeyController,
  getAllApiKeysController,
} from '../../controllers/apiKey.controller';

const apikeyRouter = Router();

apikeyRouter.post('/create', createApiKeyController);
apikeyRouter.get('/all', getAllApiKeysController);
apikeyRouter.delete('/:id', deleteApiKeyController);

export default apikeyRouter;