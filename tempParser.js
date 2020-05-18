import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob'
import AsyncStorage from '@react-native-community/async-storage';
import BleManager from 'react-native-ble-manager';
var code
var session
//daeliminare
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: 0,
      scanning: false,
      peripherals: new Map(),
      appState: ''
    }
  }
  render() {
    return (<View><Button title='parse' onPress={()=>this.Handler()}/></View>
    );
  }

Handler=()=>{
    var res = str.split(':')
    res.map((d,i)=>{int[i]=parseFloat(d)})
    var string="il co2 e': "+int[1]+"ppm la temperatura e': "+int[2]+"° l`umidita e': "+int[3]+"%"
    alert(string)
}

  GetDataStored = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key)
      if (value !== null) {
        if (value == "success") alert('session true')
        else alert(value)
        // value previously stored
      }
    } catch (e) {
      alert('error')
      // error reading value
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
var str="co2:1234Temp:22.22Hum:44.4"
var int=[]
/*calendar handler=()=>{
        try {
            var pagetitle=this.props.navigation.state.params.title
        } catch (error) {
            var pagetitle=" "
        }
        alert(this.props.navigation.state.routeName+"    "+this.state.values +pagetitle)
    } */