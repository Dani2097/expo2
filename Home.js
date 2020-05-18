import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob'
import AsyncStorage from '@react-native-community/async-storage';
import BleManager from 'react-native-ble-manager';

import HttpService  from './HttpService'
var code
var session
var allowed = true
var disp = []
var customerID
var cookie
var schedule=[[1,2,2,2,2,2,1,1,1,1,1,1,1,2,2,2,2,2,2,2,1,1,1,3],[1,1,2,2,2,2,0,0,3,3,3,0,0,0,2,2,2,2,1,1,1,1,1,1],[3,3,0,0,1,1,1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3],[1,1,1,1,1,1,1,0,0,0,0,0,3,3,3,0,0,0,3,3,3,2,2,2],[0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,2,2,0,0,0,3,3],[1,2,3,0,3,2,1,2,3,0,3,2,1,2,3,0,3,2,1,2,3,0,3,2],[1,2,2,2,2,1,1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]]
   var logindata={
      username:'giuseppe',
      password:'12345678'
    }  
           
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: 0,
      scanning: false,
      peripherals: new Map(),
      appState: '',
      nome:'login'
    }

    //console.log(schedule[1]+'asd')
    this.GetData()
    
    //AsyncStorage.removeItem('groups')
    // this.onOkPromptPresed()
  }

  render() {
    return (<View>
      <Button
        title="Fast"
        type="outline"
        onPress={() => {
          this.GetData();

        }}
      />
       <Button
        title="delete"
        type="outline"
        onPress={() => {
          this.delete();

        }}
      />
     <Button
        title="Fast"
        type="outline"
        onPress={() => {
          this.GetDataDisp();

        }}
      />
       <Button
        title="Session"
        type="outline"
        onPress={() => {

          this.GetDataStored('Session')
        }}
      />
      <Button
        title={this.state.nome}
        type="outline"
        onPress={() =>

          new HttpService().PostCode('login',logindata).then((crfs)=>{
            console.log('dalla chiamata')
            console.log(crfs)
            this.setState({nome:crfs.session.user.fullname})
           })

        }
      />
      <Button
        title="Devices"
        type="outline"
        onPress={() => {
          this.Getdevices()
          // AsyncStorage.setItem('Session', 'false')
          //alert("logout")
        }} />
      <Button
        title="Logout"
        type="outline"
        onPress={() => {
          //this.Getdevices()
          AsyncStorage.setItem('Session', 'false')
         this.UpdateScheduler()
         //alert("logout")
        }}

      />

    </View>
    );
  }
  loginscreen = () => { this.props.navigation.navigate('LoginPage', allowed) }

  storeData = async (value) => {
    try {

      await AsyncStorage.setItem('Session', value)
    } catch (e) {
      // saving error
    }
  }
  Getdevices = () => {
    var Auth=cookie
    console.log(Auth)
    return RNFetchBlob.config({
      trusty: true,
      timeout:5000,
      
    }).fetch('GET', 'https://78.46.215.53:3000/devices/getUserDevices/48')
      .then((response) =>
        response.json())
      .then((responseJson) => {
        console.log(responseJson)

      })
      .catch((error) => {
        alert(error);
      });
  }
  GetUserDevices = () => {
    alert('proviamo')
    return fetch("https://jsonplaceholder.typicode.com/POSTs/1",{
      method: 'GET'
   })
      .then(response => response.json())
      .then((responseJson) => {
        alert('proviasmo')

        console.log(responseJson)

      })
      .catch(error => console.log(error)) //to catch the errors if any
    /*
        fetch('https://78.46.215.53:3000/devices/getUserDevices/0')
    
         RNFetchBlob.config({
          trusty: true
        }).fetch('GET', 'https://78.46.215.53:3000/devices/getUserDevices/0')
          .then((response) =>{
          console.log(responseJson)
            response.json()}).then((responseJson) => {
            console.log(responseJson)
    
          })
          .catch((error) => {
            console.log(error);
          });*/
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
GetDataDisp = () => {

    return RNFetchBlob.config({
      trusty: true
    }).fetch('GET', 'https://78.46.215.53:3000/groups/getDevices/48')
      .then((response) =>
         
        response.json())
      .then((responseJson) => {

        console.log(responseJson.data.lastHistory[0].result)
        //code = responseJson.csrfToken
       // cookie=JSON.stringify(responseJson)
        //console.log(cookie)
       // alert(code)

      })
      .catch((error) => {

        console.log(  error);
      });
  }
  delete = () => {

    return RNFetchBlob.config({
      trusty: true
    }).fetch('DELETE', 'https://78.46.215.53:3000/groups/delete/20')
      .then((response) =>
        
        response.json())
      .then((responseJson) => {

        console.log(responseJson)
   
    
        //console.log(cookie)
       // alert(code)

      })
      .catch((error) => {
        console.log(error);
      });
  }
  GetData = () => {

    return RNFetchBlob.config({
      trusty: true
    }).fetch('GET', 'https://78.46.215.53:3000/home')
      .then((response) =>
        
        response.json())
      .then((responseJson) => {

        console.log(responseJson)
        code = responseJson.csrfToken
        cookie=JSON.stringify(responseJson)
        //console.log(cookie)
       // alert(code)

      })
      .catch((error) => {
        console.log(error);
      });
  }
  ///devices/:deviceID --dettagli singolo dispositivo , inviare parametri di sessione

  LoginData = () => {
    let logindata={
  
      _csrf:code,
      username:'giuseppe',
      password:'12345678'
    }
    return RNFetchBlob.config({
      trusty: true
    }).fetch('POST', 'https://78.46.215.53:3000/login',
      { 'Content-Type': 'application/json'} ,
     JSON.stringify( logindata)).then(response => response.text())
      .then(text => {
        try {
          const data = JSON.parse(text)
          console.log(data)

          console.log(data.session.user.customerID)
          customerID = data.session.user.customerID
          //cookie=data.session.cookie
          session = data.response
          console.log(cookie)
        } catch (err) {
          alert(err)
        }
      });
  }

 zeros(dimensions) {
  var array = [];

  for (var i = 0; i < dimensions[0]; ++i) {
      array.push(dimensions.length == 1 ? 0 : this.zeros(dimensions.slice(1)));
  }

  return array;
}
UpdateScheduler = () => {
  
  return RNFetchBlob.config({
    trusty: true
  }).fetch('POST', 'https://78.46.215.53:3000/preset/create',
    {
    'Content-Type': 'application/x-www-form-urlencoded' },
      "_csrf=" + code +'&presetname=preset1'+'&schedule='+JSON.stringify(schedule)
      ).then(response => response.json())
    .then(text => {
      console.log(text)
    }).catch((error)=>console.log(error));
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
