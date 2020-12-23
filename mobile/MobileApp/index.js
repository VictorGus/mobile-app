/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import NotificationHandler from './NotificationHandler';
import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onAction: function (notification) {
    NotificationHandler.onAction(notification);
  },
});

AppRegistry.registerComponent(appName, () => App);
