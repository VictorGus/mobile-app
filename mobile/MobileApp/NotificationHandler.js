import BasicNotificationService from './BasicNotificationService'

import ConditionNotificationService from './ConditionNotificationService'

class NotificationHandler {
  constructor(basicNotificationService, conditionNotificationService) {
    this.basicNotificationService = basicNotificationService;
    this.conditionNotificationService = conditionNotificationService;
  }

  onAction(notification) {
    let action = notification.action;
    if (action == 'No' || action == 'Yes') {
      this.basicNotificationService.handleBasicNotification(notification);
    }

    this.conditionNotificationService.handleConditionNotification(notification);
  }
}

const NOTIFICATION_HANDLER = new NotificationHandler(BasicNotificationService, ConditionNotificationService);

export default NOTIFICATION_HANDLER;