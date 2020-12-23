import {jsonFetch, normalizeDateTime} from './Utils';

export default class ConditionNotificationService {
  constructor(notificationService) {
    console.log('Init condition notifications service');
    this.notificationService = notificationService;
    this.notificationActions = ['😃', '😐', '😷'];
    this.channelId = 'condition-notification-channel';
    jsonFetch({
      method: 'GET',
      uri: '/settings',
    }).then((data) => {
      this.scheduleConditionNotification(data);
    });
    console.log('Init condition notifications service complete');
  }

  // On Create
  scheduleConditionNotification(settings) {
    if (!settings.enable_notifications) {
      return;
    }
    if (!this.notificationService.channelExists(this.channelId)) {
      this.notificationService.createChannel(this.channelId);
    }
    let date;
    if (settings.notification_rate == null) {
      date = new Date();
      date.setSeconds(date.getSeconds() + 10);
    } else {
      date = new Date(new Date().getTime() + settings.notification_rate);
    }
    var notification = {
      id: this.channelId,
      category: 'How do you fell?',
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
    this.notificationService.removeChannel(this.channelId);
  }

  // On Enable
  enableConditionNotification(setting) {
    this.notificationService.createChannel(this.channelId);
    this.scheduleConditionNotification(setting);
  }

  handleConditionNotification(notification) {
    jsonFetch({
      method: 'POST',
      uri: '/condition-result',
      body: JSON.stringify({
        user_id: '123',
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
