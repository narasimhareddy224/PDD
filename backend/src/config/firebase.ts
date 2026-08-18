import * as admin from 'firebase-admin';
import { ENV } from './environment';
import { logger } from '../utils/logger';

let isFirebaseInitialized = false;

try {
  if (ENV.FIREBASE.PROJECT_ID && ENV.FIREBASE.CLIENT_EMAIL && ENV.FIREBASE.PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: ENV.FIREBASE.PROJECT_ID,
        clientEmail: ENV.FIREBASE.CLIENT_EMAIL,
        privateKey: ENV.FIREBASE.PRIVATE_KEY,
      }),
      storageBucket: ENV.FIREBASE.STORAGE_BUCKET || `${ENV.FIREBASE.PROJECT_ID}.appspot.com`,
    });
    isFirebaseInitialized = true;
    logger.info('Firebase Admin SDK initialized successfully.');
  } else {
    logger.warn('Firebase credentials not fully provided. Fallback authentication & simulated storage/FCM mode enabled.');
  }
} catch (error) {
  logger.error('Error initializing Firebase Admin SDK:', error);
}

export const firebaseAdmin = admin;
export const isFirebaseConfigured = (): boolean => isFirebaseInitialized;

/**
 * Verify Firebase ID Token or fallback to simulated dev verification
 */
export const verifyFirebaseToken = async (idToken: string): Promise<{ uid: string; email?: string; name?: string; picture?: string }> => {
  if (isFirebaseInitialized) {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
    };
  }

  // Fallback dev mode / Mock Firebase token verification
  if (idToken.startsWith('mock-token-') || idToken.startsWith('eyJ')) {
    try {
      // Decode JWT payload without verification in mock mode
      const parts = idToken.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
        return {
          uid: payload.uid || payload.sub || 'user_demo_123',
          email: payload.email || 'user@nextfit.ai',
          name: payload.name || 'NextFit Fashionista',
          picture: payload.picture || '',
        };
      }
    } catch {
      // ignore
    }
  }

  // Standard mock token format: "mock-token-USERID"
  const uid = idToken.replace('mock-token-', '') || 'user_demo_123';
  return {
    uid,
    email: `${uid}@nextfit.ai`,
    name: 'NextFit Fashionista',
    picture: '',
  };
};

/**
 * Upload file buffer to Firebase Storage or return local storage URL
 */
export const uploadToStorage = async (
  fileBuffer: Buffer,
  destinationPath: string,
  contentType: string
): Promise<string> => {
  if (isFirebaseInitialized && ENV.FIREBASE.STORAGE_BUCKET) {
    const bucket = admin.storage().bucket();
    const file = bucket.file(destinationPath);
    await file.save(fileBuffer, {
      metadata: { contentType },
      public: true,
    });
    return `https://storage.googleapis.com/${ENV.FIREBASE.STORAGE_BUCKET}/${destinationPath}`;
  }

  // Fallback: Convert to Base64 data URL for instant display/local dev
  const base64 = fileBuffer.toString('base64');
  return `data:${contentType};base64,${base64}`;
};

/**
 * Send Firebase Cloud Messaging push notification
 */
export const sendFCMNotification = async (
  fcmToken: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<{ success: boolean; messageId?: string }> => {
  if (isFirebaseInitialized && fcmToken) {
    try {
      const response = await admin.messaging().send({
        token: fcmToken,
        notification: { title, body },
        data: data || {},
      });
      return { success: true, messageId: response };
    } catch (error) {
      logger.error('FCM Send Error:', error);
      return { success: false };
    }
  }

  logger.info(`[Simulated FCM Notification] To: ${fcmToken || 'Dev-Device'} | Title: "${title}" | Body: "${body}"`);
  return { success: true, messageId: `mock_fcm_${Date.now()}` };
};
