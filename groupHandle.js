import * as React from 'react';
import { View, StyleSheet, Dimensions, Text, Alert ,ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
    CheckBox, Button, Ionicons, Image
} from 'react-native-elements'
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel, RadioGroup } from 'react-native-simple-radio-button';
import { NavigationEvents } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';
import { TouchableHighlight } from 'react-native';
import { FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import { NativeEventEmitter } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import prompt from 'react-native-prompt-android';
import HttpService from './HttpService';
var httpHandle = new HttpService()
//JSON DA TESTAREW
const WalkthroughableView = walkthroughable(View); //Making a WalkthroughableText
var listener=new NativeEventEmitter()
var code
var valueTheme=0
var dispositivi=[]
var gruppi = []
var texttip=['cliccando qui potrai vedere i dettagli del template','tenendo premuto imposterai il template come attivo']
class groupHandle extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading:true
        }
    }
    StartThing() {
        console.log('start')
    }
    componentDidMount() {
      AsyncStorage.getItem('theme').then(data=>{data ? valueTheme=JSON.parse(data):valueTheme=0})
      listener.removeAllListeners('changetheme')
      listener.addListener('changetheme',data=>{
          AsyncStorage.getItem('theme').then(data=>{
            data ? valueTheme=JSON.parse(data):valueTheme=0
          this.setState({darktheme:!!valueTheme})
            console.log(valueTheme)
          })
      })
        this.getGroups()
        this.StartThing()
        this.props.navigation.setParams({ StartThing: this.props.start });
      this.setState({isLoading:true})
      
    }
    gettheme(){AsyncStorage.getItem('theme').then(data=>{data ? valueTheme=JSON.parse(data):valueTheme=0})
    listener.removeAllListeners('changetheme')
    listener.addListener('changetheme',data=>{
        AsyncStorage.getItem('theme').then(data=>{
          data ? valueTheme=JSON.parse(data):valueTheme=0
        this.setState({darktheme:!!valueTheme})
          console.log(valueTheme)
        })
    })}
    render() {
        return (<View style={{ justifyContent:"center", alignItems: 'center',  backgroundColor: valueTheme==0? 'white':'#2d383c', minHeight: Dimensions.get('window').height-100 }}>
            {this.state.isLoading && <ActivityIndicator color={"#000"} />}
            <NavigationEvents 
            onWillFocus={()=>{this.gettheme()}}
            onDidFocus={()=>{this.gettheme()}}/>
            <ScrollView style={{maxHeight:Dimensions.get('window').height-70}} contentContainerStyle={{ minHeight: Dimensions.get('window').height-70}}>
            
            {gruppi.map((e,i)=>
            <View style={{ flexDirection: "column", marginTop: Dimensions.get('window').height * 0.01 }}>
                    <TouchableHighlight onPress={() => this.props.navigation.navigate('Template',{selection: JSON.stringify( e.data)})} onLongPress={() => {}} style={{ width: Dimensions.get('window').width * 0.9, height: 65, backgroundColor: valueTheme==0?'white':'#718792', borderRadius: 5, alignContent: "center",borderColor:valueTheme==0?'blue':'white',borderWidth:1,elevation:5 }}
                   >
                    <CopilotStep
                            text={texttip[i]}
                            order={i + 2}
                            active={i<2}
                            name={i+'key'}>
                            <WalkthroughableView style={{ flexDirection:'row', alignItem: 'center', width: Dimensions.get('window').width * 0.9, alignContent: "center",justifyItem:'center' }}>
                                <Text style={{width:Dimensions.get("window").width*0.35,color:valueTheme==0? 'blue':'white',fontWeight:"bold",margin:20}}>{e.name}</Text>
            <Text style={{width:Dimensions.get("window").width*0.22,color:'black',fontWeight:"bold",margin:20}}>dispositivi:{dispositivi.filter(function(disp) {
                    return disp.groupID == e.ID;
                }).length}</Text>
                                <Icon onPress={()=>this.onDeletePress(e.ID)} size={30} color='red' style={{alignSelf:"center"}}name='remove'></Icon>
                             
                            </WalkthroughableView>
                    </CopilotStep>
                </TouchableHighlight>
                </View>)}
          
                
          </ScrollView>
          {this.state.isLoading && <ActivityIndicator color={"#000"} />}
          <FAB  
                
                color="white"
                style={styles.fab}
                small
                icon="plus"
                onPress={() => this.onAddPress('caltab')}
            />
        </View>);
    };
    onAddPress = () => {
        prompt(
            'Inserisci gruppo',
            'Inserisci il titolo del gruppo da aggiungere',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'OK', onPress: (value) =>  this.AddItemToGroup(value) },
            ],
            {

                cancelable: true,

                placeholder: 'title'
            }
        );
    };
    onDeletePress = (id) => {
        Alert.alert(
            'Attenzione',
            'Sei sicuro di voler eliminare il gruppo?',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'OK', onPress: () => this.delete(id,0) },
            ],
            {

                cancelable: true,

                placeholder: 'title'
            }
        );
    };
AddGroup=(title,mode,IDs,idgroup)=>{
    this.setState({isLoading:true})
    return RNFetchBlob.config({
        trusty: true
      }).fetch('GET', 'https://78.46.215.53:3000/home')
        .then((response) =>
          
          response.json())
        .then((responseJson) => {
  
          console.log(responseJson)
          code = responseJson.csrfToken
          if (mode==1){
            this.AddItemToGroup(title);
          console.log('add')
          }
          
        })
        .catch((error) => {
          console.log(error);
        });
    }
    AddItemToGroup=(value)=>{
let postdata={
  _csrf:code,
  groupname:value
}
this.setState({isLoading:true})
httpHandle.PostCode('newGroup',postdata).then((data)=>{
  console.log(data)
  this.getGroups()
}).catch((error)=>console.log(error))
/*
        return RNFetchBlob.config({
            trusty: true
          }).fetch('POST', 'https://78.46.215.53:3000/device/newGroup',
            {
            'Content-Type': 'application/json' },
              JSON.stringify(postdata)
              ).then(response => response.json())
            .then(text => {
               
                console.log(text)  
                 
                this.getGroups()
               
              
        
            }).catch((data)=>console.log(data));*/
    }
    getGroups=()=> {
        AsyncStorage.getItem('UserId').then((data)=>{this.getGroupData(data)})
       
    }
    getGroupData(user){
      httpHandle.getRequest('getDevices',user) .then((responseJson) => {
        console.log(responseJson)
        dispositivi = responseJson.data.devices
      
       gruppi=responseJson.data.groups 
        AsyncStorage.setItem('groups2', JSON.stringify(gruppi));
              this.setState({isLoading:false})

      })
      .catch((error) => {
        console.log('vado alla login')
        console.log(error)
      });/*
        return RNFetchBlob.config({
            trusty: true,
            timeout:5000,
            
          }).fetch('GET', 'https://78.46.215.53:3000/devices/getUserDevices/'+user)
            .then((response) =>
              response.json())
            .then((responseJson) => {
              console.log(responseJson)
              dispositivi = responseJson.data.devices
            
             gruppi=responseJson.data.groups 
              AsyncStorage.setItem('groups2', JSON.stringify(gruppi));
                    this.setState({isLoading:false})
      
            })
            .catch((error) => {
              console.log('vado alla login')
              console.log(error)
            });*/
        }

        delete = (id) => {
            this.setState({isLoading:true})
            var groupdisp= dispositivi.filter(function(disp) {
              return disp.groupID == id;
          })
          var IDs=[]
          groupdisp.map((e,i)=> IDs.push(e.ID))
          console.log(IDs)
         
          this.deleteDispGroup(IDs,id)
          
          
            return RNFetchBlob.config({
              trusty: true
            }).fetch('DELETE', 'https://78.46.215.53:3000/groups/delete/'+id)
              .then((response) =>
                
                response.json())
              .then((responseJson) => {
        
                console.log(responseJson)
                this.getGroups()
                //new NativeEventEmitter().emit('update')
            
                //console.log(cookie)
               // alert(code)
        
              })
              .catch((error) => {
                console.log(error);
              });
          }
          deleteDispGroup = (disp,group) => {
            let postdata={
              _csrf:code,
              devices:JSON.stringify( disp),
              groupid:0
            }
            httpHandle.PostCode('changeGroup',postdata).then((data)=>console.log(data)).catch((error)=>console.log(error))/*
            console.log('l`id e` '+disp+'il; gruppo e`'+ group)
                  return RNFetchBlob.config({
                    trusty: true
                  }).fetch('POST', 'https://78.46.215.53:3000/device/updateGroupMulti',
                    {
                    'Content-Type': 'application/x-www-form-urlencoded' },
                     JSON.stringify(postdata)
                      ).then(response => response.text())
                    .then(text => {
                      try {
                          console.log('giusto')
                        console.log(text)
                        //this.props.navigation.navigate('Groups')
                      } catch (err) {
                        console.log(err)
                        console.log('err')
                      }
                    });*/
                }
           
}
export default copilot({
    animated: true, // Can be true or false
    overlay: 'svg', // Can be either view or svg
    androidStatusBarVisible: true
})(groupHandle)
const styles = StyleSheet.create({
    container: {

        backgroundColor: '#102027',
        alignItems: 'center',

    }, fab: {
        backgroundColor:'#76da1b',
        flex:1,
        position: "absolute",
        margin: 16,
        right: 10,
        bottom: 10,
        justifyContent: 'space-between',
    },
});