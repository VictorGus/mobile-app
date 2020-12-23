import PushNotification from 'react-native-push-notification';
import { NotificationIcon } from './UtilComponents';

class NotificationService {
  constructor() {
    PushNotification.getApplicationIconBadgeNumber(function (number) {
      if (number > 0) {
        PushNotification.setApplicationIconBadgeNumber(0);
      }
    });
  }

  channelExists(channelId) {
    return PushNotification.channelExists(channelId);
  }

  createChannel(channelId) {
    console.log('Creating channel: ' + channelId);
    PushNotification.createChannel({
      channelId: channelId,
      channelName: channelId,
    });
  }

  removeChannel(channelId) {
    PushNotification.deleteChannel(channelId);
  }

  scheduleNotification(notification, date, actions) {
    PushNotification.localNotificationSchedule({
      date: date,
      channelId: notification.id,
      title: notification.category,
      bigText: notification.n_action,
      subText: notification.n_action,
      actions: actions,
      invokeApp: false,
      message: notification.n_action,
    });
  }
}

const NOTIFICATION_SERVICE = new NotificationService(); 

export default NOTIFICATION_SERVICE 