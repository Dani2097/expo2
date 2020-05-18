import * as React from 'react';
import { View, StyleSheet, Dimensions, Text, Alert,ActivityIndicator, NativeEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationEvents } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';
import { TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import RNFetchBlob from 'rn-fetch-blob';
//TODO:daskdoaskldp[a]
//far andare il visualizza riepilogo template asdasdasdas ogni load bianco nel tema scuro, far reinderizzare ad ogni login, aggiungere allert ad ogni rimozione/cambio gruppo, logout
const WalkthroughableView = walkthroughable(View); //Making a WalkthroughableText
//const WalkthroughableInput = walkthroughable(Input); //Making a WalkthroughableImage
var valueTheme=0
var listener=new NativeEventEmitter()
var active='nessuno'
var template = []
var texttip=['cliccando qui potrai vedere i dettagli del template','tenendo premuto imposterai il template come attivo']
class groupDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeT:active,
            isLoading:true
        }
    }
    StartThing() {
       AsyncStorage.getItem('theme').then(data=>{data ? valueTheme=JSON.parse(data):valueTheme=0})
        listener.removeAllListeners('changetheme')
        listener.addListener('changetheme',data=>{
            AsyncStorage.getItem('theme').then(data=>{
              data ? valueTheme=JSON.parse(data):valueTheme=0
            this.setState({darktheme:!!valueTheme})
              console.log(valueTheme)
            })
        })
    }
    componentDidMount() {
        this.StartThing()
        this.getTemplate() 
     
        this.props.navigation.setParams({ StartThing: this.props.start });
        this.setState({isLoading:true})
    }
    render() {
        return (<View style={{ alignItems: 'center', backgroundColor: valueTheme==0? 'white':'#2d383c', minHeight: Dimensions.get('window').height }}><ScrollView style={{ minHeight: Dimensions.get('window').height}}>
            {this.state.isLoading && <ActivityIndicator color={"#000"} />}
            <NavigationEvents onWillFocus={()=>{this.StartThing()}}
            onDidFocus={()=>{this.StartThing()}}/>
            {template ? template.map((e,i)=>
            <View style={{ flexDirection: "column", marginTop: Dimensions.get('window').height * 0.01 }}>
                    <TouchableHighlight onPress={() => this.props.navigation.navigate('Template',{selection: JSON.stringify( e.value)})} onLongPress={() => this.beActive(e)} style={{ width: Dimensions.get('window').width * 0.9, height: 65, backgroundColor: valueTheme==0?'white':'#718792', borderRadius: 5, alignContent: "center",borderColor:valueTheme==0?'blue':'white',borderWidth:1,elevation:5 }}
                   >
                    <CopilotStep
                            text={texttip[i]}
                            order={i + 2}
                            active={i<2}
                            name={i+'key'}>
                            <WalkthroughableView style={{ flexDirection:'row', alignItem: 'center', width: Dimensions.get('window').width * 0.9, alignContent: "center",justifyItem:'center' }}>
                                <Text style={{width:Dimensions.get("window").width*0.6,color:valueTheme==0?'black':'white',fontWeight:"bold",margin:20}}>{e.name}</Text>
                                <Icon onPress={()=>{this.onDeletePress(e.ID)}} size={30} color='red' style={{alignSelf:"center"}}name='remove'></Icon>
                                <Icon size={30} color='blue' style={{alignSelf:"center",marginLeft:5}}name='file-text-o'></Icon>
                            </WalkthroughableView>
                    </CopilotStep>
                </TouchableHighlight>
                </View>):<View></View>}
          </ScrollView>
        </View>);
    };
    beActive(value) {
        active = value.title
        this.setState({activeT:active})
    }
    getTemplate(){
        this.setState({isLoading:true})
        AsyncStorage.getItem('UserId').then((data)=>{
            if(data)
            this.GetScheduling(data)
            else
            console.log('vado alla login ')
        })
    }


    onDeletePress = (id) => {
        Alert.alert(
            'Attenzione',
            'Sei sicuro di voler eliminare il preset?',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'OK', onPress: value => this.deleteScheduling(id) },
            ],
            {

                cancelable: true,

                placeholder: 'title'
            }
        );
    };
   GetScheduling= (id) => {

        return RNFetchBlob.config({
          trusty: true
        }).fetch('GET', 'https://78.46.215.53:3000/preset/list/'+id)
          .then((response) =>
             
            response.json())
          .then((responseJson) => {
            template=responseJson.data
            console.log(responseJson.data)
            if (!template)  console.log('vado alla login ')
            this.setState({isLoading:false})
            //code = responseJson.csrfToken
           // cookie=JSON.stringify(responseJson)
            //console.log(cookie)
           // alert(code)
    
          })
          .catch((error) => {
            console.log('vado alla login ')
            console.log(  error);
          });
      }
  
      deleteScheduling= (id) => {
        this.setState({isLoading:true})
        return RNFetchBlob.config({
          trusty: true
        }).fetch('DELETE', 'https://78.46.215.53:3000/preset/delete/'+id)
          .then((response) =>
             
            response.json())
          .then((responseJson) => {
            //template=responseJson.data
            console.log(responseJson)
            this.getTemplate()
            //code = responseJson.csrfToken
           // cookie=JSON.stringify(responseJson)
            //console.log(cookie)
           // alert(code)
    
          })
          .catch((error) => {
    
            console.log(  error);
          });
      }
}
export default copilot({
    animated: true, // Can be true or false
    overlay: 'svg', // Can be either view or svg
    androidStatusBarVisible: true
})(groupDetail)
const styles = StyleSheet.create({
    container: {

        backgroundColor: '#102027',
        alignItems: 'center',

    }, fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});