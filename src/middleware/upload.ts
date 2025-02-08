import multer from 'multer';

const upload = multer({ dest: 'uploads/', storage: multer.memoryStorage() });

export default upload;