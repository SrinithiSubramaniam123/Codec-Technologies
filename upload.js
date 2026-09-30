import multer from 'multer';
import path from 'path';
import { randomBytes } from 'crypto';
import { fileURLToPath } from 'url';
export const UPLOAD_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../uploads');
export const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) => cb(null, randomBytes(10).toString('hex') + path.extname(file.originalname).toLowerCase()),
  }),
  limits: { fileSize: 25 * 1024 * 1024, files: 4 },
  fileFilter: (_req, file, cb) =>
    /^(image|video)\//.test(file.mimetype) ? cb(null, true) : cb(new Error('Only images and videos can be uploaded.')),
});
export const mediaType = (file) => (file.mimetype.startsWith('video') ? 'video' : 'image');
