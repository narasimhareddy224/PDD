import { Request, Response, NextFunction } from 'express';
import { verifyFirebaseToken } from '../config/firebase';
import { User, IUser } from '../models/User';
import { UserProfile } from '../models/UserProfile';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
  firebaseUid?: string;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'Authorization token missing or malformed', 401, 'UNAUTHORIZED');
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      sendError(res, 'Token not provided', 401, 'UNAUTHORIZED');
      return;
    }

    // Verify token with Firebase Admin or dev fallback
    const decoded = await verifyFirebaseToken(token);
    if (!decoded || !decoded.uid) {
      sendError(res, 'Invalid or expired authentication token', 401, 'INVALID_TOKEN');
      return;
    }

    req.firebaseUid = decoded.uid;

    let user: any = null;

    if (require('mongoose').connection.readyState === 1) {
      // Find or automatically create user in MongoDB when connected
      user = await User.findOne({ firebaseUid: decoded.uid });
      if (!user) {
        user = await User.create({
          firebaseUid: decoded.uid,
          email: decoded.email || `${decoded.uid}@nextfit.ai`,
          name: decoded.name || 'NextFit Fashionista',
          profileImage: decoded.picture || '',
          isActive: true,
        });

        // Create default user profile
        await UserProfile.create({
          userId: user._id,
          firebaseUid: decoded.uid,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          gender: 'prefer-not-to-say',
          preferredColors: ['Navy Blue', 'Black', 'White', 'Olive', 'Beige'],
          preferredStyles: ['Smart Casual', 'Casual'],
          preferredBrands: ['Zara', 'H&M', 'Nike', 'Levi\'s', 'Uniqlo'],
          budget: 'Under ₹5,000',
          preferredOccasions: ['Casual outings', 'College', 'Office', 'Parties'],
        });
        logger.info(`New user and profile synchronized in MongoDB for UID: ${decoded.uid}`);
      }
    } else {
      // Standalone memory mock user for offline test resilience
      user = {
        _id: '507f1f77bcf86cd799439011',
        firebaseUid: decoded.uid,
        email: decoded.email || `${decoded.uid}@nextfit.ai`,
        name: decoded.name || 'NextFit Fashionista',
        profileImage: '',
        isActive: true,
      };
    }

    req.user = user;
    next();
  } catch (error: any) {
    logger.error('Authentication Middleware Error:', error.message || error);
    sendError(res, 'Authentication failed', 401, 'AUTH_ERROR');
  }
};
