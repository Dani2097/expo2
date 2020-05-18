import React from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Dimensions, TouchableOpacity, NativeEventEmitter,NativeEventSubscription } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationEvents } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { EventEmitter } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import HttpService from './HttpService';
var groups = []
var tabwidth,scrollView,userid,httpHandler=new HttpService()
export default class TopTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      dataSource: 0,
      scanning: false,
      peripherals: new Map(),
      tabselected: 0,
      aggiorna: false
    }
  }
  GetDataStored = () => {
     console.log( 'eventi: ' +new NativeEventEmitter().listeners('InitialTab').length)
    new NativeEventEmitter().once('update', (data) => {
     
      this.GetDataStored()

    });new NativeEventEmitter().addListener('newGroup', (data) => {
      this.AddItemToGroup(data)

    });
    scrollView ? scrollView.scrollTo({x:0,y:0}):{}
    AsyncStorage.getItem('groups2')
      .then((group) => {
        var c = []
        group ? c.push(JSON.parse(group)) : c = [];
        console.log(c[0])
        groups = c
        groups = groups[0]
        console.log(groups[0].length)
        if (groups.length == 0) tabwidth = Dimensions.get("window").width
        else tabwidth = groups.length < 3 ? Dimensions.get("window").width / (groups.length + 1) : Dimensions.get("window").width / 3
        // console.log("arrivo qui qual' e` il problema"+tabwidth)
        new NativeEventEmitter().removeAllListeners('InitialTab')
        new NativeEventEmitter().addListener('InitialTab', (data) => {
          this.Tabchanged(0)

        });
        var temp = this.state.isLoading
        this.setState({ isLoading: !temp })
      }).catch(()=> this.GetSessionData())
  }
  GetdevicesGroups = () => {
    return RNFetchBlob.config({
        trusty: true,
        timeout: 5000,

    }).fetch('GET', 'https://78.46.215.53:3000/devices/getUserDevices/' + userid)
        .then((response) =>
            response.json())
        .then((responseJson) => {
            console.log(responseJson)

            AsyncStorage.setItem('dispositivi', JSON.stringify(responseJson));
            groups=responseJson.data.groups
        this.setState({ isLoading: false })
        

            AsyncStorage.setItem('groups2', JSON.stringify(responseJson.data.groups)).then(()=>this.GetDataStored())

        })
        .catch((error) => {
            console.log(error)
        });
}
  AddItemToGroup(newGroup){
    AsyncStorage.getItem('groups2').then((data)=>{
      var c=[]
      data ? c.push(JSON.parse(data)) : c = [];
      c.push(newGroup)
      AsyncStorage.setItem('groups2',c)
      this.GetDataStored()

    })
    
  }
  
  GetSessionData = () => {
    httpHandler.getRequest('getSession',' ').then((responseJson)=>{
        

        userid = responseJson.data.id
        this.GetdevicesGroups()
        AsyncStorage.setItem('UserId', responseJson.data.id + '')
        if (!responseJson.data.id) {
            console.log("SESSIONE SCADUTA")
        } else console.log("SESSIONE toptab")
      
    

    }      ).catch(e=>{console.log(e)})

}
  render() {

    return (<View >
      {this.renderTab()}
    </View>);
  }
  Tabchanged(i) {
    
    
    new NativeEventEmitter().emit('asd', i);
    new NativeEventEmitter().emit('page1', i);
    console.log(this.state.tabselected)
    this.setState({ tabselected: i })
    this.setState({change:true})

  }
  renderTab() {
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        colors={['#039be5', '#4fc3f7',]}

      >
        <NavigationEvents
          onWillFocus={() => this.GetDataStored()}
          onDidFocus={() => this.GetDataStored()}

        />
        <ScrollView  showsHorizontalScrollIndicator={false}   ref={(ref) => {scrollView=ref}}  horizontal={true} contentContainerStyle={{ flexDirection: 'row' }}>

          <TouchableOpacity style={{ alignItems: "center", width: tabwidth, minHeight: 35, borderRadius: 0, backgroundColor: 'transparent', borderBottomWidth: 2, borderBottomColor: this.state.tabselected == 0 ? "#01379b" : "transparent", }}
            onPress={() => { this.Tabchanged(0) }}
          >
            <Text style={{ fontWeight: this.state.tabselected == 0 ? "bold" : 'normal', color: this.state.tabselected == 0 ? "#01379b" : "white", margin: Dimensions.get("window").width / 90 }}>no group</Text>
          </TouchableOpacity>

          {groups&&groups.map((d, i) =>
            <TouchableOpacity style={{ alignItems: "center", width: tabwidth, borderRadius: 0, backgroundColor: 'transparent', borderBottomWidth: 2, borderBottomColor: this.state.tabselected == d.ID ? "#01379b" : "transparent" }}
              onPress={() => { this.Tabchanged(d.ID) }}
            >
              <Text style={{ fontWeight: this.state.tabselected == d.ID  ? "bold" : 'normal', color: this.state.tabselected == d.ID ? "#01379b" : "#fff", margin: Dimensions.get("window").width / 90, }}>{d.name}</Text>
            </TouchableOpacity>
          )
          }</ScrollView>
      </LinearGradient>
    )
  }
}

