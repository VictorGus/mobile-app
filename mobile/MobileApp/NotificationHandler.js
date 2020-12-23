export default class NotificationHandler {
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
