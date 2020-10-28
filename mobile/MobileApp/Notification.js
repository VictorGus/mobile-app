
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Card} from 'react-native-elements'

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
            <Card>
                <Card.Title>
                    {el.title + ", 25.10.2020 16:35"}
                </Card.Title>
                <Card.Divider/>
                <Text>
                    {el.message}
                </Text>
            </Card>
        ))
        }
  </View>
);

export default NotificationScreen;