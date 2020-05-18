import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob'
const url = 'https://78.46.215.53:3000'
//rimuovi gruppo,rimuovi template, statistiche, change preset,getpreset
let getTypes={
  getSession:url+'/home',
  getDevices:url+'/devices/getUserDevices/',
  getGroupsData:url+'/groups/getDevices/',
  addShedule:url+'/devices/getUserDevices/',
  getPresetList:url+'/preset/list/',
  
}
let postTypes={
  login:url+'/login',
  addShedule:url+'',
  setSchedule:url+'/device/updateSchedule',
  changeGroup:url+'/device/updateGroupMulti',
  newGroup:url+'/device/newGroup/'
}
//daeliminare
export default class HttpService extends React.Component {
  render() {

  }

  PostCode = (postType , bodydata) => {
   
    return RNFetchBlob.config({
      trusty: true
    }).fetch('GET', url + '/home')
      .then((response) =>        
        response.json()
      )
      .then((responseJson) => {
        console.log('post da')
        var code = responseJson.csrfToken
        bodydata['_csrf']=code
        console.log(postTypes[postType])
        var result=this.post(postTypes[postType],bodydata)
        console.log('csrfcode'+code)
        return result
      })
      .catch((error) => {
        console.log(error);
      });
  }

  post=(url,postData)=>{

    return RNFetchBlob.config({
      trusty: true
    }).fetch('POST', url,
      { 'Content-Type': 'application/json'} ,
     JSON.stringify( postData)).then(response => response.text())
      .then(text => {
        try {
          const data = JSON.parse(text)
          console.log(data)
          return data
        } catch (err) {
          alert(err)
        }
      });
  }
  getRequest=(getType,getparam)=>{var getUrl
if (getparam!=undefined) getUrl=getTypes[getType]+getparam
else  getUrl=getTypes[getType]
    return RNFetchBlob.config({
      trusty: true
    }).fetch('GET', getUrl)
      .then((response) =>    
     
        response.json()
      )
      .then((responseJson) => {
        console.log('da http:'+ getUrl)
        console.log(responseJson)
        return responseJson
      })
      .catch((error) => {
        console.log('error da http:'+ getUrl)
        console.log(error);
      });
  }
}

var str = "co2:1234Temp:22.22Hum:44.4"
var int = []
