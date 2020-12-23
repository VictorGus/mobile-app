import React from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Dimensions,
  View,
  Button,
  Text,
  TouchableOpacity,
  StatusBar,
  SectionList,
} from 'react-native';

import ToggleSwitch from 'toggle-switch-react-native'

import DateTimePicker from 'react-native-modal-datetime-picker';

import ConditionNotificationService from './ConditionNotificationService';

import { Picker } from '@react-native-picker/picker';

import { exractTime, normalizeDateTime, jsonFetch } from './Utils';

const SettingsScreen = () => {
    const [enableNotifications, setEnableNotifications] = React.useState(true);

    const [enableCondition, setEnableCondition] = React.useState(false);

    const [conditionCheckRate, setConditionCheckRate] = React.useState(360000);

    const [isDatePickerVisibleFrom, setDatePickerVisibilityFrom] = React.useState(false);

    const [isDatePickerVisibleTo, setDatePickerVisibilityTo] = React.useState(false);

    const [conditionCheckTimeFrom, setConditionCheckTimeFrom] = React.useState(false);

    const [conditionCheckTimeTo, setConditionCheckTimeTo] = React.useState(false);

    const showDatePickerFrom = () => {
        setDatePickerVisibilityFrom(true);
      };

    const showDatePickerTo = () => {
        setDatePickerVisibilityTo(true);
      };

    return (
        <View>
            <View style={{
                borderBottomWidth: 0.5,
                padding: 12 
            }}>
                <ToggleSwitch
                    isOn={enableNotifications}
                    onColor="#2396d9"
                    label="Enable notifications"
                    labelStyle={{ color: "black", fontWeight: "900", fontSize: 18, marginRight: "29%" }}
                    size="large"
                    onToggle={() => setEnableNotifications(!enableNotifications)}
                />
            </View>

            <View style={{
                borderBottomWidth: 0.5,
                padding: 12 
            }}>
                <ToggleSwitch
                    isOn={enableCondition}
                    onColor="#2396d9"
                    label="Enable condition check"
                    labelStyle={{ color: "black", fontWeight: "900", fontSize: 18, marginRight: "22%" }}
                    size="large"
                    onToggle={() => {
                        setEnableCondition(!enableCondition)
                        if (enableCondition == true) {
                            ConditionNotificationService.scheduleConditionNotification({
                                enable_condition_check: true,
                                notification_rate: 3600
                            })
                        } else {
                            ConditionNotificationService.disableConditionNotification();
                        }
                    }}
                />
            </View>
            <View>
                <Text style={{
                    fontWeight: 'bold',
                    marginBottom: 15,
                    fontSize: 16
                }}>
                    Condition check rate
                </Text>
                <Picker
                    style={styles.textInput}
                    onValueChange={(value) => setConditionCheckRate(value)}
                    mode={'dropdown'}
                    selectedValue={conditionCheckRate}>
                    <Picker.Item label={"Every hour"} value={36000000} />
                    <Picker.Item label={"Every 3 hours"} value={36000000 * 3} />
                    <Picker.Item label={"Every 30 minutes"} value={36000000 / 2} />
                    <Picker.Item label={"Every 5 minutes"} value={36000000 / 12} />
                    <Picker.Item label={"Every 30 seconds"} value={30000} />
                </Picker>
            </View>
            <View>
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 16
                }}>
                    Condition check start time
                </Text>
                <TouchableOpacity onPress={showDatePickerFrom} >
                    <View style={styles.dateInput}>
                        <Text style={{ fontSize: 18 }}>
                            {
                                conditionCheckTimeFrom != false ? exractTime(conditionCheckTimeFrom) : null
                            }
                        </Text>
                    </View>
                </TouchableOpacity>
                <DateTimePicker
                    isVisible={isDatePickerVisibleFrom}
                    value={Date.now()}
                    onCancel={() => { setDatePickerVisibilityFrom(false) }}
                    onConfirm={(date) => {
                        setConditionCheckTimeFrom(date);
                        setDatePickerVisibilityFrom(false);
                    }}
                    mode={"time"}
                    is24Hour={true}
                    display="default"
                />
            </View>
            <View>
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 16
                }}>
                    Condition check end time
                </Text>
                <TouchableOpacity onPress={showDatePickerTo} >
                    <View style={styles.dateInput}>
                        <Text style={{ fontSize: 18 }}>
                            {
                                conditionCheckTimeTo != false ? exractTime(conditionCheckTimeTo) : null
                            }
                        </Text>
                    </View>
                </TouchableOpacity>
                <DateTimePicker
                    isVisible={isDatePickerVisibleTo}
                    value={Date.now()}
                    onCancel={() => { setDatePickerVisibilityTo(false) }}
                    onConfirm={(date) => {
                        setConditionCheckTimeTo(date);
                        setDatePickerVisibilityTo(false);
                    }}
                    mode={"time"}
                    is24Hour={true}
                    display="default"
                />
                <Button title="Save" onPress={() => {
                    jsonFetch({
                        method: 'POST',
                        uri: '/settings',
                        body: JSON.stringify({
                            user_id: '123',
                            enable_condition_check: enableCondition,
                            condition_period_from: normalizeDateTime(conditionCheckTimeFrom),
                            condition_period_to: normalizeDateTime(conditionCheckTimeTo),
                            sync_rate: conditionCheckRate
                        }),
                    });
                }} />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    dateInput: {
        borderColor: '#CCCCCC',
        borderBottomWidth: 3,
        width: "100%",
        marginLeft: 6,
        marginRight: 6,
        marginTop: 15,
        height: 30
    }
})

export default SettingsScreen;