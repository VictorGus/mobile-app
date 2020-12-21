import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Modal, TextInput} from 'react-native';
import { Picker } from '@react-native-picker/picker'
import { Card, Button, Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import IconFA from 'react-native-vector-icons/FontAwesome5'; 
import SegmentedControlTab from 'react-native-segmented-control-tab'
import DateTimePicker from 'react-native-modal-datetime-picker';
import { jsonFetch, convertRateToMills, clearFormState, normalizeDateTime } from './Utils'
import { InputForm } from './UtilComponents';
// import { formatDateTime } from './Utils'

function formatDateTime(date) {
    if (date != null) {
        let month = '' + (date.getMonth() + 1).toString()
        let day = '' + date.getDate().toString()
        let year = date.getFullYear().toString()
        let hour = date.getHours().toString()
        let minute = date.getMinutes().toString()

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        if (hour.length < 2)
            hour = '0' + hour;
        if (minute.length < 2)
            minute = '0' + minute;

        return [hour, minute].join(':') + " " + [day, month, year].join('.');
    }
}

const rateRegex = /(every ([0-9][0-9]|[0-9]) (months|days|weeks|years|minutes|hours))|(every year)|(every month)|(every day)|(every week)|(every hour)|(every minute)/;

const demoData = [
    {
        message: "Take aspirin",
        category: "pills"
    },
    {
        message: "Have a fat free meal",
        category: "nutrition-order"
    },
    {
        message: "Have a glass of water",
        category: "water"
    },
    {
        message: "Have a walk in the park",
        category: "walking"
    },
    {
        message: "Do neck exercises",
        category: "activities"
    },
    {
        message: "Visit a doctor",
        category: "medical-service"
    }
]

function NotificationIcon(props) {
    switch (props.category) {
        case "pills":
            return <IconFA name="pills" size={29} color="#2396d9" />

        case "nutrition-order":
            return <Icon name="spoon" size={29} color="#2396d9" />

        case "water":
            return <IconFA name="glass-whiskey" size={29} color="#2396d9" />

        case "medical-services":
            return <IconFA name="briefcase-medical" size={29} color="#2396d9" />

        case "walking":
            return <IconFA name="walking" size={29} color="#2396d9" />

        case "activities":
            return <Icon name="soccer-ball-o" size={29} color="#2396d9" />

        default:
            return <Icon name="exclamation" size={29} color="#2396d9" />
    }
}

function testG() {
    alert('You tapped the button!')
    return 1;
}

const UpcomingNotifications = () => {

    const [notifications, setNotifications] = React.useState([]);
    let today = new Date();
    let tomorrow = new Date(today);
    today.setHours(0, 0, 0, 0);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    React.useEffect(()=> {
        jsonFetch({
            method: 'GET',
            uri: '/notification/$upcoming',
            params: {
                date_from: normalizeDateTime(today),
                date_to: normalizeDateTime(tomorrow)
            }
        }).then((data) => { return setNotifications(data.entry) })
    }, [])

    return (
        <View style={{
            flex: 1
        }}>
            <ScrollView style={{
                margin: 10,
                marginTop: 5,
                marginBottom: 15
            }}>
                {
                    notifications.map((el, i) => (
                        <Card key={i}>
                            <View style={{
                                flexDirection: 'row',
                                flexGrow: 2,
                                marginBottom: 10,
                                alignContent: 'space-between'
                            }}>
                                <Text>
                                    <NotificationIcon category={el.category} />
                                </Text>
                                <View style={{
                                    marginLeft: 5,
                                    marginTop: 5,
                                    flex: 1
                                }}>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        color: new Date().getTime() - new Date(el.date_time).getTime() >= 1800000 ? "#e0e305" : "black",
                                        fontSize: 19
                                    }}>
                                        {formatDateTime (new Date(el.date_time))}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => {
                                    jsonFetch({
                                        method: 'POST',
                                        uri: '/notification-result',
                                        body: JSON.stringify({
                                            notification_id: el.id,
                                            n_result: new Date().getTime() - new Date(el.date_time).getTime() <= 1800000 ? "perfomed" : "overdue",
                                            category: el.category,
                                            date_time: normalizeDateTime(new Date(el.date_time)) 
                                        })
                                    })
                                    setNotifications(notifications.filter(i => i.id != el.id));
                                }}>
                                    <Icon style={{ marginRight: 10 }} name="check-circle" size={36} color="green" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    jsonFetch({
                                        method: 'POST',
                                        uri: '/notification-result',
                                        body: JSON.stringify({
                                            notification_id: el.id,
                                            n_result: "rejected",
                                            category: el.category,
                                            date_time: normalizeDateTime(new Date(el.date_time)) 
                                        })
                                    })
                                    setNotifications(notifications.filter(i => i.id != el.id));
                                }}>
                                    <Icon name="times-circle" size={36} color="red" />
                                </TouchableOpacity>
                            </View>
                            <Card.Divider />
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <View>
                                    <Text style={{
                                        fontSize: 24,
                                    }}>
                                        {el.n_action}
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    ))
                }
            </ScrollView>
        </View>
    )
};


const CreatedNotifications = () => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [dateTimeValue, setDateTime] = React.useState(null);
    const [pickerValue, setPickerValue] = React.useState(null);
    const [textInputValue, setTextInputValue] = React.useState(null);
    const [responseValue, setResponseValue] = React.useState(null);
    const [notificationRate, setNotificationRate] = React.useState(null);
    const [editFormVisible, setEditFormVisible] = React.useState(false);
    const [props, setEditFormData] = React.useState(false);
    const [notifications, setNotifications] = React.useState(null);

    React.useEffect(()=> {
        jsonFetch({
            method: 'GET',
            uri: '/notification'
        }).then((data) => { return setNotifications(data) })
    }, [])

    const handleConfirm = (date) => {
        setDateTime(date);
    }

    const handlePickerConfirm = (itemValue, itemIndex) => {
        setPickerValue(itemValue);
    }

    let entry = notifications != null ? notifications.entry : []

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{
                margin: 10,
                marginTop: 5,
                marginBottom: 15
            }}>
                {
                    entry.map((el, i) => (
                        <Card key={i}>
                            <View style={{
                                position: 'relative',
                                flexDirection: 'row',
                                flexGrow: 2,
                                marginBottom: 10,
                                alignContent: 'space-between'
                            }}>
                                <Text>
                                    <NotificationIcon category={el.category} />
                                </Text>
                                <View style={{
                                    marginLeft: 5,
                                    marginTop: 5,
                                    flex: 1,
                                    flexDirection: 'row'
                                }}>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        fontSize: 19
                                    }}>
                                        {formatDateTime(new Date(el.date_time))}
                                    </Text>
                                    {
                                        el.notification_rate != null ? <Icon style={{
                                            marginRight: 10,
                                            marginLeft: 2
                                        }} name="repeat" size={14} color="#2396d9" /> : null
                                    }
                                </View>
                                <TouchableOpacity onPress={() => {
                                    setEditFormVisible(true)

                                    setEditFormData({
                                        id: el.id,
                                        dateTimeValue: new Date(el.date_time),
                                        pickerValue: el.category,
                                        notificationRate: el.notification_rate,
                                        textInputValue: el.n_action,
                                    })
                                }}>
                                    <Icon style={{ marginRight: 0 }} name="pencil" size={36} color="#2396d9" />
                                </TouchableOpacity>
                            </View>
                            <Card.Divider />
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <View>
                                    <Text style={{
                                        fontSize: 24,
                                    }}>
                                        {el.n_action}
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    ))
                }
            </ScrollView>

            <Modal animationType='slide' transparent={true} visible={editFormVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {
                            props.notificationRate != null ? <Icon style={{
                                marginRight: 10,
                                marginLeft: 2,
                                position: 'absolute',
                                right: 0,
                                top: 6
                            }} name="repeat" size={14} color="#2396d9" /> : null
                        }
                        <InputForm fields={
                            [
                                {
                                    type: "text",
                                    label: "Action",
                                    onChange: (event) => {

                                        let _text = event.nativeEvent.text;
                                        let rate = _text.match(rateRegex);
                                        let replacement = rate != null ? rate[0] : '';
                                        let text = _text.replace(replacement, '');

                                        if (rate != null) {
                                            setNotificationRate(convertRateToMills(rate[0]))
                                        }
                                        setTextInputValue(text);
                                    },
                                    placeholder: "Enter action",
                                    initialValue: props.textInputValue
                                },
                                {
                                    type: "select",
                                    label: "Category",
                                    onChange: setPickerValue,
                                    initialValue: pickerValue != null ? pickerValue : props.pickerValue,
                                    items: [
                                        {
                                            display: "Select category",
                                            value: null
                                        },
                                        {
                                            display: "Nutrition order",
                                            value: "nutrition-order"
                                        },
                                        {
                                            display: "Pills",
                                            value: "pills"
                                        },
                                        {
                                            display: "Water consumption",
                                            value: "water"
                                        },
                                        {
                                            display: "Walks",
                                            value: "walking"
                                        },
                                        {
                                            display: "Activities",
                                            value: "activities"
                                        },
                                        {
                                            display: "Medical services",
                                            value: "medical-services"
                                        }
                                    ]
                                },
                                {
                                    type: "datetime",
                                    label: "Date and time",
                                    onChange: handleConfirm,
                                    initialValue: dateTimeValue != null ? dateTimeValue : props.dateTimeValue
                                }
                            ]
                        } />
                        <Button title="Delete"
                            buttonStyle={{
                                backgroundColor: 'red',
                                marginTop: 25,
                                marginBottom: 15
                            }}
                            onPress={() => {
                                jsonFetch({
                                    method: 'DELETE',
                                    uri: '/notification/' + props.id
                                })
                                setEditFormVisible(false);
                            }} />


                        <Button title="Save"
                            buttonStyle={{
                                marginTop: 25
                            }}
                            onPress={() => {
                                jsonFetch({
                                    method: 'PUT',
                                    uri: '/notification/' + props.id,
                                    body: JSON.stringify({
                                        user_id: "123",
                                        n_action: textInputValue != null ? textInputValue : props.textInputValue,
                                        category: pickerValue != null ? pickerValue : props.pickerValue,
                                        notification_rate: props.notificationRate != null ? String(props.notificationRate) : null,
                                        date_time: normalizeDateTime(dateTimeValue != null ? dateTimeValue : props.dateTimeValue)
                                    })

                                });
                                setEditFormVisible(false);
                            }} />
                        <Button title="Cancel"
                            onPress={() => {
                                setEditFormVisible(false);
                            }}
                            titleStyle={{
                                color: "#919190",
                            }}
                            buttonStyle={{
                                marginTop: 10,
                                borderStyle: 'solid',
                                borderColor: '#babab8',
                                borderWidth: 2,
                                backgroundColor: 'white'
                            }} />
                    </View>
                </View>
            </Modal>
            <Modal animationType='slide' transparent={true} visible={modalVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {
                            notificationRate != null ? <Icon style={{
                                marginRight: 10,
                                marginLeft: 2,
                                position: 'absolute',
                                right: 0,
                                top: 6
                            }} name="repeat" size={14} color="#2396d9" /> : null
                        }
                        <InputForm fields={
                            [
                                {
                                    type: "text",
                                    label: "Action",
                                    onChange: (event) => {
                                        setNotificationRate(null);

                                        let _text = event.nativeEvent.text;
                                        let rate = _text.match(rateRegex);
                                        let replacement = rate != null ? rate[0] : '';
                                        let text = _text.replace(replacement, '');

                                        if (rate != null) {
                                            setNotificationRate(convertRateToMills(rate[0]))
                                        }
                                        setTextInputValue(text);
                                    },
                                    placeholder: "Enter action",
                                    initialValue: textInputValue
                                },
                                {
                                    type: "select",
                                    label: "Category",
                                    onChange: setPickerValue,
                                    initialValue: pickerValue,
                                    items: [
                                        {
                                            display: "Select category",
                                            value: null 
                                        },
                                        {
                                            display: "Nutrition order",
                                            value: "nutrition-order"
                                        },
                                        {
                                            display: "Pills",
                                            value: "pills"
                                        },
                                        {
                                            display: "Water consumption",
                                            value: "water"
                                        },
                                        {
                                            display: "Walks",
                                            value: "walking"
                                        },
                                        {
                                            display: "Activities",
                                            value: "activities"
                                        },
                                        {
                                            display: "Medical services",
                                            value: "medical-services"
                                        }
                                    ]
                                },
                                {
                                    type: "datetime",
                                    label: "Date and time",
                                    onChange: handleConfirm,
                                    initialValue: dateTimeValue 
                                }
                            ]
                        } />
                        <Button title="Save"
                            buttonStyle={{
                                marginTop: 25
                            }}
                            onPress={() => {
                                jsonFetch({
                                    method: 'POST',
                                    uri: '/notification',
                                    body: JSON.stringify({
                                        user_id: "123",          
                                        n_action: textInputValue,         
                                        category: pickerValue,        
                                        notification_rate: notificationRate != null ? String(notificationRate) : null,
                                        date_time: normalizeDateTime(dateTimeValue)        
                                    })

                                });
                                clearFormState([setNotificationRate, setTextInputValue, setDateTime, setPickerValue]);

                                setModalVisible(false);
                            }} />
                        <Button title="Cancel"
                            onPress={() => {
                                clearFormState([setNotificationRate, setTextInputValue, setDateTime, setPickerValue]);
                                setModalVisible(false);
                            }}
                            titleStyle={{
                                color: "#919190",
                            }}
                            buttonStyle={{
                                marginTop: 10,
                                borderStyle: 'solid',
                                borderColor: '#babab8',
                                borderWidth: 2,
                                backgroundColor: 'white'
                            }} />
                    </View>
                </View>
            </Modal>
            <View style={{
                alignItems: 'center',
                marginBottom: 10
            }}>
                <TouchableOpacity onPress={() => {
                    setModalVisible(!modalVisible)
                    }}>
                    <Icon name="plus" size={49} color="#2396d9" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const NotificationScreen = () => {
    const [selectedIndex, handleIndexChange] = React.useState(0);

    return (
        <View style={{
            flex: 1
        }}>
            <SegmentedControlTab tabStyle={{
                marginTop: 20,
            }}
                selectedIndex={selectedIndex}
                onTabPress={handleIndexChange}
                values={["Upcoming", "Created"]} />
            {
               selectedIndex === 0 ? <UpcomingNotifications /> : <CreatedNotifications />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        width: 300,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        // alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      
      dateInput: {
        borderColor: '#CCCCCC',
        borderBottomWidth: 3,
        width: "100%",
        marginLeft: 6,
        marginRight: 6,
        marginTop: 15,
        height: 30
      },

      textInput: {
        borderColor: '#CCCCCC',
        borderBottomWidth: 3,
        marginBottom: 10,
        width: "100%",
        fontSize: 18,
      }
})

export default NotificationScreen;