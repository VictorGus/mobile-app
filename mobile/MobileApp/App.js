import React from 'react';
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

import NotificationScreen from './Notification';

import AnalyticsScreen from './Analytics';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { TabView, SceneMap } from 'react-native-tab-view';

const HistoryScreen = () => (
  <View style={[styles.scene, { backgroundColor: 'white' }]}>
    <Text style={styles.screenBody}>
      "Текст"
    </Text>
  </View>
);

const SettingsScreen = () => (
  <View style={[styles.scene, { backgroundColor: 'white' }]}>
    <Text style={styles.screenBody}>
      "Текст"
    </Text>
  </View>
);

const initialLayout = { width: Dimensions.get('window').width };

const App: () => React$Node = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'notifications', title: 'Notifications' },
    { key: 'history', title: 'History' },
    { key: 'settings', title: 'Settings' }
  ]);
 
  const renderScene = SceneMap({
    notifications: NotificationScreen,
    history: AnalyticsScreen,
    settings: SettingsScreen 
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  screenBody: {
    fontSize: 18,
    color: 'black',
    padding: 24,
  }
});

export default App;
