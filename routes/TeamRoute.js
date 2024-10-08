import express from "express";
import { getTeams, getTeamsById, createTeams, updateTeams, deleteTeams } from "../controllers/Teams.js";

const router = express.Router();

router.get('/teams', getTeams);
router.get('/teams/:id', getTeamsById);
router.post('/teams', createTeams);
router.patch('/teams/:id', updateTeams);
router.delete('/teams/:id', deleteTeams);

export default router;