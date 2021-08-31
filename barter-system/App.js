import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import {createAppContainer, createSwitchNavigator} from 'react-navigation'


export default function App() {
  return (
    <View>
      <AppContainer/>
    </View>
  );
}

const switchNavigator = createSwitchNavigator({
  welcomeScreen:{screen:welcomeScreen},
  Drawer:{screen:AppDrawerNavigator}
})

const AppContainer = createAppContainer(switchNavigator)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
