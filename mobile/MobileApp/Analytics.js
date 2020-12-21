import React from 'react';
import { LineChart, PieChart } from "react-native-chart-kit";
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { NotificationIcon } from './UtilComponents'
import { jsonFetch, formatDateTime, extractDate, exractTime } from './Utils'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Dimensions,
  View,
  Text,
  StatusBar,
  SectionList,
} from 'react-native';

import SegmentedControlTab from 'react-native-segmented-control-tab'

import lodash from 'lodash'

const demoData = [
    {
        notificationStatus: "rejected",
        action: "Have a glass of water",
        category: "water"
    },
    {
        notificationStatus: "overdue",
        action: "Take aspirin",
        category: "pills" 
    },
    {
        notificationStatus: "perfomed",
        action: "Have a long walk in the park",
        category: "walking"

    }
]

const WellbeingChart = () => {
    const [currentIndex, setIndex] = React.useState(0);

    return (
        <View>
            <LineChart
                data={{
                    labels: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
                    datasets: [
                        {
                            data: [
                                6,
                                7,
                                6,
                                6,
                                2,
                                4,
                                7,
                                8
                            ]
                        }
                    ]
                }}
                width={Dimensions.get("window").width} // from react-native
                height={220}
                fromZero={true}
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                    backgroundColor: "#0a6bcc",
                    backgroundGradientFrom: "#0a6bcc",
                    backgroundGradientTo: "#3d9dfc",
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "white"
                    }
                }}
                bezier
                style={{
                    marginVertical: 8,
                    margin: 8,
                    borderRadius: 16
                }}
            />
            <SegmentedControlTab tabStyle={{
                marginTop: 20,
            }
            }
                selectedIndex={currentIndex}
                onTabPress={setIndex}
                values={["Today", "Last week", "Last month", "Last year"]} />
        </View>
    )
}

const data = [
    {
      name: "Rejected",
      amount: 15,
      color: "#ff4a40",
      legendFontColor: "black",
      legendFontSize: 15
    },
    {
      name: "Overdue",
      amount: 18,
      color: "#fffc3d",
      legendFontColor: "black",
      legendFontSize: 15
    },
    {
      name: "Perfomed",
      amount: 52,
      color: "#4ec726",
      legendFontColor: "black",
      legendFontSize: 15
    }
  ];
  
function StatusIcon (props) {
    let iconColor;

    switch (props.status) {
        case "rejected":
            iconColor = '#ff4a40'
            break
        case "overdue":
            iconColor = '#fffc3d'
            break
        case "perfomed":
            iconColor = '#4ec726'
            break
    }

    return <Icon name='circle' size={32} style={{right: 0, position: 'absolute', margin: 8 }} color={iconColor}/>
}

const NotificationResultsGrid = () => {
    const [notificationResults, setNotificationResults] = React.useState([]);

    React.useEffect(() => {
        jsonFetch({
            method: 'GET',
            uri: '/notification-result'
        }).then((data) => {
            let entry = data.entry;

            return setNotificationResults(lodash.groupBy(entry, (el) => extractDate(new Date(el.date_time))))
        })
    }, [])

    return (
        <View style={{
            flex: 1
        }}>
            <ScrollView>
                {
                    Object.entries(notificationResults).map(([date, arr], i) => (
                        <View style={{
                            margin: 8
                        }}>
                            <Text style={{
                                fontWeight: 'bold'
                            }}>
                                {date}
                            </Text>
                            {
                                arr.map((el, i) => (
                                    <View
                                        key={i}
                                        style={{
                                            height: 50,
                                            margin: 8,
                                            borderWidth: 2,
                                            borderColor: '#c7c7c7'
                                        }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: 50 }}>
                                                <NotificationIcon category={el.category} style={{ margin: 8 }} />
                                            </View>
                                            <View style={{
                                                margin: 10,
                                                flexDirection: 'row'
                                            }}>
                                                <Text style={{
                                                    fontWeight: 'bold',
                                                    fontSize: 18
                                                }}>
                                                    {exractTime(new Date(el.date_time))}
                                                </Text>
                                                <Text style={{
                                                    marginLeft: 5,
                                                    fontSize: 16
                                                }}>
                                                    {el.n_action}
                                                </Text>
                                            </View>
                                        </View>
                                        <StatusIcon status={el.n_result} />
                                    </View>
                                ))
                            }
                        </View>
                    )
                    )
                }
            </ScrollView>
        </View>
    )

}

const StatisticsChart = () => {
    const [currentIndex, setIndex] = React.useState(0);
    const [analyticsData, setAnalyticsData] = React.useState([]);

    React.useEffect(()=> {
        jsonFetch({
            method: 'GET',
            uri: '/notification-result/$ratio'
        }).then((data) => { return setAnalyticsData(data.entry.map((el) =>  {
            el["name"] = el.n_result;
            el["amount"] = el.count;
            el["legendFontColor"] = "black";
            el["legendFontSize"] = 15;
            switch(el.n_result) {
                case "perfomed":
                    el["color"] = "#4ec726"
                    break
                case "rejected":
                    el["color"] = "#ff4a40"
                    break
                default:
                    el["color"] = '#fffc3d'
            }
            return el;
        })) })
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <PieChart
                data={analyticsData}
                height={220}
                width={400}
                chartConfig={{
                    backgroundColor: "#0a6bcc",
                    backgroundGradientFrom: "#0a6bcc",
                    backgroundGradientTo: "#3d9dfc",
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
            />
            <SegmentedControlTab tabStyle={{
                marginTop: 20,
            }
            }
                selectedIndex={currentIndex}
                onTabPress={setIndex}
                values={["Today", "Last week", "Last month", "Last year"]} />
            <NotificationResultsGrid />
        </View>
    )
}

const AnalyticsScreen = () => {
    const [currentTab, switchTab] = React.useState(0);

    return (
        <View style={{
            flex: 1
        }}>
            <SegmentedControlTab tabStyle={{
                marginTop: 20
            }}
                selectedIndex={currentTab}
                onTabPress={switchTab}
                values={["Statistics", "Wellbeing"]} />
        {currentTab === 0 ? <StatisticsChart/> : <WellbeingChart/>}
        </View>
    )
}

export default AnalyticsScreen;