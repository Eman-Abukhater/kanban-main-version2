import { Router } from 'express';
import { authUser, getBoardlist, addBoard, editBoard } from '../controllers/projKanbanBoards.controller.js';

const r = Router();

r.get('/authuser', authUser);
r.get('/getBoardlist', getBoardlist);
r.post('/addboard', addBoard);
r.put('/editboard', editBoard);

export default r;
