import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Modal, Keyboard} from 'react-native';
import { Picker } from '@react-native-picker/picker'
import { Card, Button, Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import IconFA from 'react-native-vector-icons/FontAwesome5'; 
import FileSystem from 'react-native-fs'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import DateTimePicker from 'react-native-modal-datetime-picker';

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
    const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
    const showDatePicker = () => {
        setDatePickerVisibility(true);
      };

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
                                {/* <TouchableOpacity style={{
                                position: 'absolute',
                                right: -20,
                                zIndex: 999,
                                bottom: 35
                            }} onPress={testG}>
                                <Icon onPress={() => { alert('You tapped the button!'); }} name="close" size={24} color="red" />
                            </TouchableOpacity> */}
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
                        <Text>
                            {"Action"}
                        </Text>
                        <Input
                            style={styles.textInput}
                            placeholder="Enter action"
                            maxLength={20}
                            onBlur={Keyboard.dismiss}
                        />
                        <Text>
                            {"Category"}
                        </Text>
                        <Picker style={styles.textInput} label={"Category"}>
                            <Picker.Item label="Nutrition order" value="nutrition-order" />
                            <Picker.Item label="Pills" value="pills" />
                            <Picker.Item label="Water consumption" value="water" />
                            <Picker.Item label="Walks" value="walking" />
                            <Picker.Item label="Acitivities" value="activities" />
                            <Picker.Item label="Medical services" value="medical-services" />
                        </Picker>
                        <Button title="Show Date Picker" onPress={showDatePicker} />
                        <DateTimePicker
                            isVisible={isDatePickerVisible}
                            testID="dateTimePicker"
                            value={Date.now()}
                            onConfirm={()=>{}}
                            mode={"datetime"}
                            is24Hour={true}
                            display="default"
                            // onChange={onChange}
                        />
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
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      textInput: {
        borderColor: '#CCCCCC',
        borderBottomWidth: 1,
        width: "100%",
        height: 50,
        fontSize: 18,
      }
})

export default NotificationScreen;