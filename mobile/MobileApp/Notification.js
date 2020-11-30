import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Modal, TextInput} from 'react-native';
import { Picker } from '@react-native-picker/picker'
import { Card, Button, Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import IconFA from 'react-native-vector-icons/FontAwesome5'; 
import SegmentedControlTab from 'react-native-segmented-control-tab'
import DateTimePicker from 'react-native-modal-datetime-picker';
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

        case "medical-service":
            return <IconFA name="briefcase-medical" size={29} color="#2396d9" />

        case "walking":
            return <IconFA name="walking" size={29} color="#2396d9" />

        case "activities":
            return <Icon name="soccer-ball-o" size={29} color="#2396d9" />
    }
}

function testG() {
    alert('You tapped the button!')
    return 1;
}

const UpcomingNotifications = () => (
    <View style={{
        flex: 1
    }}>
        <ScrollView style={{
            margin: 10,
            marginTop: 5,
            marginBottom: 15
        }}>
            {
                demoData.map((el, i) => (
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
                                    fontSize: 19
                                }}>
                                    {"Today 16:35"}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={testG}>
                                <Icon style={{ marginRight: 10 }} name="check-circle" size={36} color="green" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={testG}>
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
                                    {el.message}
                                </Text>
                            </View>
                        </View>
                    </Card>
                ))
            }
        </ScrollView>
    </View>
);

const CreatedNotifications = () => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [dateTimeValue, setDateTime] = React.useState(null);
    const [pickerValue, setPickerValue] = React.useState(null);

    const handleConfirm = (date) => {
        setDateTime(date);
    }

    const handlePickerConfirm = (itemValue, itemIndex) => {
        setPickerValue(itemValue);
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{
                margin: 10,
                marginTop: 5,
                marginBottom: 15
            }}>
                {
                    demoData.map((el, i) => (
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
                                        {"Today 16:35"}
                                    </Text>
                                    <Icon style={{
                                        marginRight: 10,
                                        marginLeft: 2
                                    }} name="repeat" size={14} color="#2396d9" />
                                </View>
                                <TouchableOpacity onPress={testG}>
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
                                        {el.message}
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    ))
                }
            </ScrollView>
            <Modal animationType='slide' transparent={true} visible={modalVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <InputForm fields={
                            [
                                {
                                    type: "text",
                                    label: "Action",
                                    onChange: () => { },
                                    initialValue: "Enter action"
                                },
                                {
                                    type: "select",
                                    label: "Category",
                                    onChange: setPickerValue,
                                    initialValue: pickerValue,
                                    items: [
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
                                // setDatePickerVisibility(false);
                                setModalVisible(false);
                            }} />
                        <Button title="Cancel"
                            onPress={() => {
                                // setDatePickerVisibility(false);
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
                <TouchableOpacity onPress={() => { setModalVisible(!modalVisible) }}>
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