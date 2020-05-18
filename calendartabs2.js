import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator, createBottomTabNavigator,createTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import React from 'react';
import { StyleSheet, Text, View,Button,Alert,ScrollView } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import calendar from './calendar2';


  const MainApp = createMaterialTopTabNavigator(
      {

          D: { screen: calendar },
      L: {screen:calendar} ,
      MA: {screen:calendar} ,
       ME: {screen:calendar} ,
       G: {screen:calendar} ,
       V: {screen:calendar} ,
       S: {screen:calendar} ,
     
    },
    {
      navigationOptions: ({ navigation }) => ({
          
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;

          
        },
      }),
      tabBarOptions: {
        activeTintColor: '#ffffff',
        inactiveTintColor: '#263238',
      },
    }
  );
   
   
  export default createAppContainer(MainApp);
  
 