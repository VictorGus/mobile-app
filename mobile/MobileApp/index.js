/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import NotificationService from './NotificationService';
import ConditionNotificationService from './ConditionNotificationService';
import BasicNotificationService from './BasicNotificationService';
import NotificationHandler from './NotificationHandler';
import PushNotification from 'react-native-push-notification';

const notificationService = new NotificationService();
const conditionNotificationService = new ConditionNotificationService(
  notificationService,
);
const basicNotificationService = new BasicNotificationService(
  notificationService,
);
const handler = new NotificationHandler(
  basicNotificationService,
  conditionNotificationService,
);

PushNotification.configure({
  onAction: function (notification) {
    handler.onAction(notification);
  },
});

AppRegistry.registerComponent(appName, () => App);
