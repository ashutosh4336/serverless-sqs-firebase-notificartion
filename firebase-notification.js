const serviceAccount = require('./config/firebase-notification.json'); // :TODO:
const admin = require('firebase-admin');

// const androidNotificationSound = 'sound.mp3';
// const androidChannelId = '001';
// const iconURL = 'https://i.imgur.com/IFKwDSM.png';

class FirebaseNotification {
  firebaseApp;

  constructor() {
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  /**
   *
   * @param {Array<string>} fcmToken
   * @param {Object<{ action: string; roomId: string; title: string }>} data
   * @param {Object<{ title: string; body: string }>} message
   * @returns
   */

  async sendNotification(fcmToken, data, message) {
    const response = await this.firebaseApp.messaging().sendMulticast({
      notification: {
        title: message.title,
        body: message.body,
      },

      apns: {
        payload: {
          aps: {
            sound: 'sound.aiff',
          },
        },
      },

      data: data,

      android: {
        notification: {
          //   channelId: androidChannelId,
          //   imageUrl: iconURL,
          //  const androidNotificationSound = 'sound.mp3';
        },
      },
      tokens: fcmToken,
    });

    return response;
  }
}

export default FirebaseNotification;
