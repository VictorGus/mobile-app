import {jsonFetch, normalizeDateTime} from './Utils';
import NotificationService from './NotificationService';
import DEVICE_ID from './Global';

class ConditionNotificationService {
  constructor(notificationService) {
    console.log('Init condition notifications service');
    this.notificationService = notificationService;
    this.notificationActions = ['😃', '😐', '😷'];
    this.channelId = 'condition-notification-channel';
    jsonFetch({
      method: 'GET',
      uri: '/settings/' + DEVICE_ID,
    }).then((data) => {
      this.scheduleConditionNotification(data.entry);
    });
    console.log('Init condition notifications service complete');
  }

  // On Create
  scheduleConditionNotification(settings) {
    if (!settings.enable_condition_check) {
      return;
    }
    if (!this.notificationService.channelExists(this.channelId)) {
      this.notificationService.createChannel(this.channelId);
    }
    let date;
    if (settings.sync_rate == null) {
      date = new Date();
      date.setSeconds(date.getSeconds() + 10);
    } else {
      date = new Date(new Date().getTime() + settings.sync_rate);
    }
    var notification = {
      id: this.channelId,
      category: 'How do you feel?',
      n_action: 'Rate your current condition.',
    };
    this.notificationService.scheduleNotification(
      notification,
      date,
      this.notificationActions,
    );
  }

  // On Disable
  disableConditionNotification() {
    console.log('Disabling channel ' + this.channelId);
    this.notificationService.removeChannel(this.channelId);
  }

  // On Enable
  enableConditionNotification(setting) {
    this.notificationService.createChannel(this.channelId);
    this.scheduleConditionNotification(setting);
  }

  handleConditionNotification(notification) {
    jsonFetch({
      method: 'GET',
      uri: '/settings/' + DEVICE_ID,
    }).then((data) => {
      this.scheduleConditionNotification(data.entry);
    });

    jsonFetch({
      method: 'POST',
      uri: '/condition',
      body: JSON.stringify({
        user_id: DEVICE_ID,
        date_time: normalizeDateTime(new Date()),
        result: this.parseResult(notification.action),
      }),
    });
  }

  parseResult(action) {
    if (action === '😃') {
      return 2;
    }
    if (action === '😐') {
      return 1;
    }

    return 0;
  }
}

const CONDITION_NOTIFICATION_SERVICE = new ConditionNotificationService(
  NotificationService,
);

export default CONDITION_NOTIFICATION_SERVICE;
