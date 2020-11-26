import React from 'react';
import { LineChart, PieChart } from "react-native-chart-kit";

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

const WellbeingChart = () => {
    return (
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
  

const StatisticsChart = () => {
    return (
        <PieChart
            data={data}
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
    )
}

const AnalyticsScreen = () => {
    const [currentTab, switchTab] = React.useState(0);

    return (
        <View>
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