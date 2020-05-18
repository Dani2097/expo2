import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator, createBottomTabNavigator,createTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import React from 'react';
import { StyleSheet, Text, View,Button,Alert,ScrollView } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import Ble from './Ble';
import ControlBLEDevice from './ControlBLEDevice';
import calendar from './calendar';


  
  const MainApp = createBottomTabNavigator(
    {
      Connect: {screen:Ble} ,
      Control: {screen:Ble} ,
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          
        },
      }),
      tabBarOptions: {
        activeTintColor: '#FF6F00',
        inactiveTintColor: '#263238',
      },
    }
  );
   
   
  export default createAppContainer(MainApp);
  
 