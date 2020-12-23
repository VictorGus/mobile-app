import React from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SectionList,
} from 'react-native';

import ToggleSwitch from 'toggle-switch-react-native'

import DateTimePicker from 'react-native-modal-datetime-picker';

const SettingsScreen = () => {
    const [enableNotifications, setEnableNotifications] = React.useState(true);
    const [enableCondition, setEnableCondition] = React.useState(true);

    const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
    const showDatePicker = () => {
        setDatePickerVisibility(true);
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
                    onToggle={() => setEnableCondition(!enableCondition)}
                />
            </View>
            <View>
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 16
                }}>
                    Test govna
                </Text>
                <TouchableOpacity onPress={showDatePicker} >
                    <View style={styles.dateInput}>
                        <Text style={{ fontSize: 18 }}>
                            Test
                        </Text>
                    </View>
                </TouchableOpacity>
                <DateTimePicker
                    isVisible={isDatePickerVisible}
                    value={Date.now()}
                    onCancel={() => { setDatePickerVisibility(false) }}
                    onConfirm={(date) => {
                        setDatePickerVisibility(false);
                    }}
                    mode={"time"}
                    is24Hour={true}
                    display="default"
                />
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