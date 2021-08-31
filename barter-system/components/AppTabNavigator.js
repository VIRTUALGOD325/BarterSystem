import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import BookRequestScreen from '../Screens/bookRequestScreen';
import {AppStackNavigator} from './AppStackNavigator'


export const AppTabNavigator = createBottomTabNavigator({
  DonateBooks : {
    screen: AppStackNavigator,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/trade.jpg")} style={{width:20, height:20}}/>,
      tabBarLabel : "Trade",
    }
  },
  BookRequest: {
    screen: BookRequestScreen,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/Request Trade.PNG")} style={{width:20, height:20}}/>,
      tabBarLabel : "Reequest Trade",
    }
  }
});