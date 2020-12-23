import {jsonFetch, normalizeDateTime} from './Utils';
import NotificationService from  './NotificationService'
import DEVICE_ID from "./Global";

class BasicNotificationService {
  constructor(notificationService) {
    console.log('Init basic notifications service');
    this.notificationService = notificationService;
    this.notificationActions = ['Yes', 'No'];
    jsonFetch({
      method: 'GET',
      uri: '/notification',
    }).then((data) => {
      this.scheduleNotifications(data.entry);
    });
  }

  scheduleNotifications(notifications) {
    notifications.forEach((notification) =>
      this.scheduleBasicNotification(notification),
    );
  }

  // On Create
  scheduleBasicNotification(notification) {
    let date;
    if (notification.notification_rate) {
      date = new Date(new Date().getTime() + notification.notification_rate);
    } else {
      date = new Date(notification.date_time);
    }
    if (date < new Date()) {
      return;
    }
    if (!this.notificationService.channelExists(notification.id)) {
      this.notificationService.createChannel(notification.id);
    }
    this.notificationService.scheduleNotification(
      notification,
      date,
      this.notificationActions,
    );
    console.log('complete schedule basic notificaton: ' + notification.id);
  }

  // On Delete
  deleteBasicNotification(notificationId) {
    this.notificationService.removeChannel(notificationId);
  }

  handleBasicNotification(notification) {
    jsonFetch({
      method: 'GET',
      uri: '/notification/' + notification.channelId,
    }).then((data) => {
      let notif = data.entry;

      this.createNotificationResult(notif, notification.action);
      notif.date_time = normalizeDateTime(new Date());
      this.updateNotificationInfo(notif);
      if (notif.notification_rate) {
        this.scheduleBasicNotification(notif);
        return;
      }
      this.deleteBasicNotification(notif.id);
    });
  }

  updateNotificationInfo(notification) {
    jsonFetch({
      method: 'PUT',
      uri: '/notification/' + notification.id,
      body: JSON.stringify({
        user_id: DEVICE_ID,
        n_action: notification.n_action,
        category: notification.category,
        notification_rate: notification.notification_rate,
        date_time: notification.date_time,
      }),
    });
  }

  createNotificationResult(notification, action) {
    jsonFetch({
      method: 'POST',
      uri: '/notification-result',
      body: JSON.stringify({
        notification_id: notification.id,
        n_result: this.parseResult(action, new Date(notification.date_time)),
        category: notification.category,
        n_action: notification.n_action,
        date_time: normalizeDateTime(new Date()),
      }),
    });
  }

  parseResult(action, date) {
    if (new Date().getTime() - date.getTime() <= 1800000) {
      return 'overdue';
    }
    if (action === 'Yes') {
      return 'performed';
    }
    if (action === 'No') {
      return 'rejected';
    }
  }
}

const BASIC_NOTIFICATION_SERVICE = new BasicNotificationService(NotificationService);

export default BASIC_NOTIFICATION_SERVICE;
