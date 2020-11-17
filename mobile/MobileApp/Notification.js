import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity} from 'react-native';
import { Card, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import IconFA from 'react-native-vector-icons/FontAwesome5'; 
import FileSystem from 'react-native-fs'
import SegmentedControlTab from 'react-native-segmented-control-tab'

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
    return 1;
}

const UpcomingNotifications = () => (
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
); 

const CreatedNotifications = () => (
    <View style={{
        alignItems: 'center',
        marginBottom: 15
    }}>
        <TouchableOpacity onPress={testG}>
            <Icon name="plus" size={49} color="#2396d9" />
        </TouchableOpacity>
    </View>
);

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

export default NotificationScreen;