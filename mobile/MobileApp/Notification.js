
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {ListItem} from 'react-native-elements'

const demoData = [
    {
        title: "Test",
        message: "Test message for notification list"
    },
    {
        title: "Another test",
        message: "Yet another test message for notification list"
    }
]

const NotificationScreen = () => (
  <View>
        {
        demoData.map((el) => (
        <ListItem bottomDivider>
            <ListItem.Content>
                <ListItem.Title>{el.title}</ListItem.Title>
                <Text>
                    {el.message}
                </Text>
            </ListItem.Content>
        </ListItem>
    ))
        }
  </View>
);

export default NotificationScreen;