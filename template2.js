import * as React from 'react';
import { View, StyleSheet, Dimensions, Text, Alert, NativeEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationEvents } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';
import { TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import RNFetchBlob from 'rn-fetch-blob';

//cambiato in json da testare

const WalkthroughableView = walkthroughable(View); //Making a WalkthroughableText
var listener=new NativeEventEmitter()
var active = 'nessuno'
var days = ['Lunedi', 'Martedi', 'Mercoledi', 'Giovedi', 'Venerdi', 'Sabato', 'Domenica']
var template = ['a']
var valueTheme
var selection = [[1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3], [1, 1, 2, 2, 2, 2, 0, 0, 3, 3, 3, 0, 0, 0, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1], [3, 3, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3], [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 3, 3, 3, 2, 2, 2], [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 2, 2, 0, 0, 0, 3, 3], [1, 2, 3, 0, 3, 2, 1, 2, 3, 0, 3, 2, 1, 2, 3, 0, 3, 2, 1, 2, 3, 0, 3, 2], [1, 2, 2, 2, 2, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]]
var texttip = ['cliccando qui potrai vedere i dettagli del template', 'tenendo premuto imposterai il template come attivo']
class template2 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            templateselected:0,
            activeT: active
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
      this.getUserId()
    }
    GetDataSchedule = () => {
      AsyncStorage.getItem('theme').then(data=>{data ? valueTheme=JSON.parse(data):valueTheme=0})
      listener.removeAllListeners('changetheme')
      listener.addListener('changetheme',data=>{
          AsyncStorage.getItem('theme').then(data=>{
            data ? valueTheme=JSON.parse(data):valueTheme=0
          this.setState({darktheme:!!valueTheme})
            console.log(valueTheme)
          })
      })
        return RNFetchBlob.config({
            trusty: true
        }).fetch('GET', 'https://78.46.215.53:3000/devices/schedule/' + this.props.navigation.state.params.ID)
            .then((response) =>

                response.json())
            .then((responseJson) => {
                console.log(responseJson)
                var temp = JSON.parse(responseJson.data.schedule)
                selection = temp
                console.log((temp))
             })
            .catch((error) => {
                console.log(error);
            });
    }
    GetSelection(i) {
        this.props.navigation.navigate('picker', [i, JSON.stringify(selection), this.props.navigation.state.params.ID])
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
       
        this.StartThing()

        this.props.navigation.setParams({ StartThing: this.props.start });
    }
    render() {
        return (<View style={{backgroundColor:valueTheme==0?'white':'#102027'}}>

            <NavigationEvents
                onWillFocus={() => this.GetDataSchedule()}
            onDidFocus={() => this.StartThing()}
            />
            <View style={{flexDirection:"row", width:Dimensions.get('window').width ,elevation:5, backgroundColor:'#021c1e',alignItems:"center"}}>
                        <Icon onPress={()=>this.changetemplateselected(-1)} color='white' name='chevron-left' style={{ marginLeft:5, width:Dimensions.get("window").width/4}}></Icon>
                         <TouchableHighlight color='transparent' style={{ marginBottom: 10,  justifyContent: 'center',      alignItems: 'center',width : Dimensions.get("window").width/2}}onPress={() =>this.SetSelectedTemplate()}>
                             <Text style={{color:'white',marginTop:8}}>Template {template[this.state.templateselected].name} </Text>
                         </TouchableHighlight> 
                   <Icon onPress={()=>this.changetemplateselected(1)} color='white' name='chevron-right' style={{textAlign:'right', alignItems:"flex-end", width:Dimensions.get('window').width/4.6}}></Icon>
                    </View>
                    <ScrollView contentContainerStyle={{minHeight:Dimensions.get("window").height}}>
            {days.map((e, i) =><TouchableHighlight style={{ margin: 10, height: 60, borderRadius: 10, backgroundColor:valueTheme==0? 'white':'#718792', elevation: 5, justifyContent: "center", borderWidth: 1, borderColor: valueTheme==0?'#0288d1':'white' }}
                onPress={() => {
                    this.GetSelection(i)
                }}><View style={{ flexDirection: "row",width:500 }}>
                    <Text style={{ color:valueTheme==0?'black':'white',fontWeight:"bold",margin: 15, width:Dimensions.get("window").width/4 }}>{e}</Text>
                    <Icon size={20} color='#76da1b' name={'arrow-right'} style={{textAlign:"right",alignSelf:"stretch", margin: 15,width:Dimensions.get("window").width*0.5 }}></Icon>
                </View>
            </TouchableHighlight>)}
            <TouchableHighlight onPress={()=>this.props.navigation.navigate('Template', {selection:JSON.stringify(selection)})} style={{ margin: 0, height: 60, borderRadius: 0, backgroundColor: valueTheme==0?'white':'#718792', justifyContent: "center", borderWidth: 1, borderColor: valueTheme==0? '#0288d1':'white' }}
            ><Text style={{  color:valueTheme==0?'black':'white', textAlign: "center" }}>Visualizza riepilogo totale del dispositivo</Text></TouchableHighlight></ScrollView>
        </View>);
    };
    getUserId(){
        AsyncStorage.getItem('UserId').then((data)=>{
           // this.Getdevices(data)
            this.GetScheduling(data)
        })
    }
    SetSelectedTemplate(){
        
        this.GetCsrfcode(this.props.navigation.state.params.ID)
      }
    settemplate(IDdisp){
     
        selection= JSON.parse(template[this.state.templateselected].value)
        var selection2= template[this.state.templateselected].value
        //console.log(JSON.stringify(selection)) 
        let postData={
        _csrf:code,
        deviceid:IDdisp,
        schedule:selection2
    }
        return RNFetchBlob.config({
            trusty: true,
            
          }).fetch('POST', 'https://78.46.215.53:3000/device/updateSchedule',
            {
            'Content-Type': 'application/json' },
             JSON.stringify(postData)
              ).then(response => response.text())
            .then(text => {
              try {
               // console.log(text)
                const data = JSON.parse(text)
              } catch (err) {
                console.log(err)
              }
            });
    }
    GetCsrfcode = (deviceID) => {

        return RNFetchBlob.config({
          trusty: true
        }).fetch('GET', 'https://78.46.215.53:3000/home')
          .then((response) =>
            
            response.json())
          .then((responseJson) => {
    
            //console.log(responseJson)
            code = responseJson.csrfToken
            this.settemplate(deviceID)
            //console.log(cookie)
           // alert(code)
    
          })
          .catch((error) => {
            console.log(error);
          });
      }
      changetemplateselected=(i)=>{
        var temp=this.state.templateselected
        temp=temp+i
        if(temp<0)temp=0
        if(temp>template.length-1)temp=template.length-1
        
        console.log(template[temp].name)
        this.setState({templateselected:temp})
    }
    GetScheduling= (id) => {

        return RNFetchBlob.config({
          trusty: true
        }).fetch('GET', 'https://78.46.215.53:3000/preset/list/'+id)
          .then((response) =>
             
            response.json())
          .then((responseJson) => {
            template=responseJson.data
            this.setState({isLoading:false})
            console.log(template)
            //console.log(responseJson.data)
            //code = responseJson.csrfToken
           // cookie=JSON.stringify(responseJson)
            //console.log(cookie)
           // alert(code)
    
          })
          .catch((error) => {
    
            console.log(  error);
          });
      }
    getTemplate() {
        AsyncStorage.getItem('template')
            .then((contacts) => {
                const c = contacts ? JSON.parse(contacts) : [];

                template = c
                console.log(template)
                this.setState({ isLoading: false })
            });
    }
}
export default copilot({
    animated: true, // Can be true or false
    overlay: 'svg', // Can be either view or svg
    androidStatusBarVisible: true
})(template2)
const styles = StyleSheet.create({
    container: {

        backgroundColor: '#102027',
        alignItems: 'center',

    },
});