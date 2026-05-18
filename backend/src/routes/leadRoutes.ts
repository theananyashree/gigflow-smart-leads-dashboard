import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
  getLeadStats,
} from '../controllers/leadController';
import { authenticate } from '../middleware/auth';
import { createLeadValidator, updateLeadValidator } from '../validators/leadValidators';
import { validate } from '../middleware/validate';

const router = Router();

router.use(authenticate);

router.get('/stats', getLeadStats);
router.get('/export/csv', exportLeadsCSV);
router.get('/', getLeads);
router.get('/:id', getLeadById);
router.post('/', createLeadValidator, validate, createLead);
router.put('/:id', updateLeadValidator, validate, updateLead);
router.delete('/:id', deleteLead);

export default router;