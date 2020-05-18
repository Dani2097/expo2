import { createAppContainer } from 'react-navigation';


import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import React from 'react';
import Home from './Home';
import Picker from './templateTimePicker';
import template from './TemplateDetail';
import chart from './stats';
import charts from './charts';
import dettagli from './groupDetail';
import Parser from './HomeScreen';
import Login from './LoginScreen';
import caltabs from './calendartabs2';
import dispositivi from './dispositivi';
import templateCreation from './templateCreation';
import modification from './modification';
import template2 from './template2';
import DrawerMenu from "./DraweComponentLayout";
import Icon from 'react-native-vector-icons/FontAwesome';
import setting from './settings'
import LinearGradient from 'react-native-linear-gradient';
import StatisticheDispositivo from './Statistiche dispositivo'
import BlueTooth from './Tabsble'
import groupHandle from './groupHandle';

const MenuStackNavigator = createStackNavigator({
    Groups: {
        screen: Parser,
    },
    Dispositivi: {
        screen: dispositivi,

    },
    templ: {
        screen: template,
    },
    GroupsMod: {
        screen: modification,
       
    },
    chart: { screen: charts, },
    Home: { screen: Home },
    LoginPage: {
        screen: Login,
        navigationOptions: {

            header: false

        },
    },
    picker: { screen: Picker },
    Template2: { screen: template2, },
    Template: {
        screen: templateCreation,

    },  BlueTooth: {
        screen: BlueTooth,

    },
    StatisticheDispositivo: { screen: StatisticheDispositivo, },
    groupHandle: { screen: groupHandle, },
}, {
    defaultNavigationOptions: ({ navigation }) => {
        return {

            title: 'DLGTek - configure',
            headerTitleStyle: { fontWeight: "bold", color: '#01379b' },
            drawerLockMode:"locked-open",
            headerBackground: (
                <LinearGradient
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    colors={['#039be5', '#4fc3f7',]}
                    style={{ flex: 1, height: 800 }}
                ></LinearGradient>
                
            ),
            

            headerRight: () => <Icon style={{ color: '#fff', marginRight: 20 }} name={'bars'} size={25} onPress={() => { console.log(navigation.openDrawer()) }}>{} </Icon>,
            
        }
    }
});
let TabScreen = createDrawerNavigator(
    {
        MenuStack: { screen: MenuStackNavigator,
        navigationOptions: ({ navigation }) => {
           if(navigation.state.routes[navigation.state.index].routeName=="LoginPage")
            return {
                drawerLockMode:"locked-closed"
                    }
            else return {
                drawerLockMode: "unlocked"}
             }
        }   
    }, 
    {
        drawerPosition: 'right',
        contentComponent: DrawerMenu,  
    },
);
let App = createStackNavigator({
    drawer: {
        screen: TabScreen,

    },
    TabScreen: {
        screen: Parser,
    },

    Statistics: { screen: chart, },
    dettagli: { screen: dettagli, },
    setting: { screen: setting, },
    caltab: {
        screen: caltabs,
        navigationOptions: {

            headerStyle: {
                backgroundColor: '#1F3B51',
            },
            headerTintColor: '#FFFFFF',

        },


    },

}, { headerMode: "none",
 });
export default createAppContainer(App);


