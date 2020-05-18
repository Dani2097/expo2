import React from 'react';
import {  Text, View, TouchableOpacity, ScrollView, Alert, NativeEventEmitter } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import { NavigationEvents } from 'react-navigation';
import { Card, ListItem, Icon, Button } from 'react-native-elements'
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";

import { Dimensions } from 'react-native';

import HttpService from './HttpService';
//cambiato in json da testare aggiungere alert
var listener = new NativeEventEmitter()
var containerColor = ''
let groups = []
var PageName
var containerColor = ['#fff', '#718792']
var valueTheme = 0
var textColor = ['grey', '#fff']
var httpHandler = new HttpService()
const CopilotText = walkthroughable(Text);
export default class Home extends React.Component {

  constructor(props) {
    super(props);
    //serve per capire quando sono stati caricati i gruppi
    this.state = {
      isLoading: true,
      Name: PageName,
      tabselected: 0,
    }
    //carica i gruppi
    this.GetDataStored()
    //si salva la routeName, la utilizzo per sapere se sto in modifica gruppo o nella home page
    PageName = this.props.navigation.state.routeName

    console.log(this.state.Name)
    //AsyncStorage.removeItem('groups')
  }
  checkSession() {
    AsyncStorage.getItem('theme').then(data => { data ? valueTheme = JSON.parse(data) : valueTheme = 0 })
    listener.removeAllListeners('changetheme')
    listener.addListener('changetheme', data => {
      AsyncStorage.getItem('theme').then(data => {
        data ? valueTheme = JSON.parse(data) : valueTheme = 0
        this.setState({ darktheme: !!valueTheme })
        console.log(valueTheme)
      })
    })
    AsyncStorage.getItem('Session')
      .then((dispositivi) => {
        var t = JSON.parse(dispositivi)
        if (t == true) {
          console.log(t)
          this.setState({ Name: this.props.navigation.state.routeName })
        }
        else this.props.navigation.navigate("LoginPage", false)

      });
  }
  // se si clicca in un gruppo controlla la pageName e si comporta di conseguenza
  HandlerManager = (title, id) => {
    this.HandlerModification(this.props.navigation.state.params, title, id)
  }

  HandlerModification = (Idprecedente, title, idgroup) => {
    try {
      var Id = []
      id = Id.concat(Idprecedente.idPressed)
      console.log('try' + id + Idprecedente.idPressed)
    } catch (e) { alert(e) }
    this.UpdateGroup(id, idgroup)

  }
  createAllert(title, idgroup, c) {
    Alert.alert(
      'Cambiare gruppo?',
      'Cambiare il gruppo dei dispositivi in quello selezionato?',
      [

        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK', onPress: () => this.HandlerManager(title, idgroup)


        },
      ],

    );
  }
  changeGroup(title, idgroup, c) {
    AsyncStorage.setItem('dispositivi', JSON.stringify(c))
    this.HandlerHomePage(title, idgroup)
  }
  render() {
    return (
      <View style={{ backgroundColor: valueTheme == 0 ? 'white' : '#2d383c' }}>
        <ScrollView contentContainerStyle={{ minHeight: Dimensions.get("window").height }}>
          <NavigationEvents
            onWillFocus={() => this.checkSession()}
            onDidFocus={() => this.checkSession()}
          />
          {groups.map((d, i) =>
            <View>
              <TouchableOpacity title={d.nome} onPress={() => this.createAllert(d.name, d.ID)}>
                <Card title={d.name} titleStyle={{ color: textColor[valueTheme] }} containerStyle={{ elevation: 3, borderColor: valueTheme == 0 ? 'blue' : 'white', width: Dimensions.get('window').width * 0.9, borderRadius: 10, backgroundColor: containerColor[valueTheme] }}>

                  <Text style={{ textAlign: "center" }}>Clicca qui per aggiungere il dispositivo al gruppo </Text>
                </Card>
              </TouchableOpacity>
            </View>)}
        </ScrollView>
        <View style={{ height: 300 }}></View>
      </View>

    );

  }


  GetDataStored = () => {
    AsyncStorage.getItem('groups2')
      .then((group) => {
        const c = group ? JSON.parse(group) : [];
        console.log(c)
        groups = c
        this.setState({ isLoading: false })
      })
  }
  UpdateGroup = (disp, group) => {

    console.log('l`id e` ' + disp + 'il; gruppo e`' + group)
    let postData = {
      devices: JSON.stringify(disp),
      groupid: group
    }
    httpHandler.PostCode('changeGroup', postData).then((data) => {
      console.log(data)
      this.props.navigation.navigate('Groups')
    }).catch((error) => console.log(error))
  }
}
var str = "co2:1234Temp:22.22Hum:44.4"
var int = []