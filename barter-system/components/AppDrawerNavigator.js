import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer'
//Screens
import { AppTabNavigator } from './AppTabNavigator'
import CustomSideMenu  from './customSideMenu';
import NotificationSreen from '../Screens/NotificationScreen';
import SettingScreen from '../Screens/settingsScreen'
import MyTradeScreen from '../Screens/TradeScreen'
import MyTradeRecieveScreen from '../Screens/MyTradeReceiveScreen'


export const AppDrawerNavigator = createDrawerNavigator({
    Home : {
    screen : AppTabNavigator
      },
    MyDonations : {
      screen : MyTradeScreen
    },
    Notifications: {
      screen: NotificationSreen
    },
    MyTradeRecieve :{
      screen: MyTradeRecieveScreen
    },
    Setting: {
      screen:SettingScreen
    }
    },
    {
      contentComponent:CustomSideMenu
    },
    {
      initialRouteName : 'Home'
    })