import multer from 'multer';
import { ApiError } from '@/utils/ApiError';

/** In-memory upload for small CSV files (max 2 MB). */
export const uploadCsv = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) cb(null, true);
    else cb(ApiError.badRequest('Only .csv files are accepted', 'INVALID_FILE'));
  },
}).single('file');
