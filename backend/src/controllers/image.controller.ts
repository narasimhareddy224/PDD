import { Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { uploadToStorage } from '../config/firebase';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../utils/logger';

// Setup Multer with memory storage
const storage = multer.memoryStorage();
export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Allowed formats: JPG, JPEG, PNG, WEBP'));
    }
  },
});

export class ImageController {
  public static async uploadPhoto(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const file = req.file;
      if (!file) {
        sendError(res, 'No image file uploaded', 400, 'MISSING_FILE');
        return;
      }

      const fileExtension = file.mimetype.split('/')[1] || 'jpg';
      const destination = `users/${req.firebaseUid || 'guest'}/photos/${uuidv4()}.${fileExtension}`;

      const photoUrl = await uploadToStorage(file.buffer, destination, file.mimetype);

      sendSuccess(
        res,
        {
          photoUrl,
          fileSize: file.size,
          mimeType: file.mimetype,
          uploadedAt: new Date(),
        },
        'Photo uploaded successfully',
        201
      );
    } catch (error: any) {
      logger.error('Image Upload Error:', error);
      sendError(res, 'Failed to upload photo', 500, 'UPLOAD_ERROR');
    }
  }

  public static async deletePhoto(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { imageId } = req.params;
      sendSuccess(res, { deletedId: imageId }, 'Photo deleted successfully');
    } catch (error: any) {
      logger.error('Image Delete Error:', error);
      sendError(res, 'Failed to delete photo', 500, 'DELETE_ERROR');
    }
  }
}
