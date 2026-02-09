import { Router } from 'express';
import { getLeads } from '../controllers/lead/getLeads.js';
import { postLead } from '../controllers/lead/postLead.js';
import { putLead } from '../controllers/lead/putLead.js';
import { getMatches } from '../controllers/lead/getMatches.js';

export const leadRouter = Router();

leadRouter.get('/', getLeads);
leadRouter.get('/matches', getMatches);
leadRouter.post('/create', postLead);
leadRouter.post('/update/:id', putLead);
