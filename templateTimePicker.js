import * as React from 'react';
import { View, StyleSheet, Dimensions, Text, Alert, NativeEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
    CheckBox, Button, Ionicons, Image
} from 'react-native-elements'
import ScrollPicker from 'react-native-wheel-scroll-picker';
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationEvents } from 'react-navigation';
import RNFetchBlob from 'rn-fetch-blob';
var listener=new NativeEventEmitter()
var valueTheme
var pickerwidth=Dimensions.get("window").width/6
var pickerheight=Dimensions.get("window").height/10
//trasformato in json le post, da testare
//const WalkthroughableInput = walkthroughable(Input); //Making a WalkthroughableImage
const WalkthroughableImage = walkthroughable(Image); //Making a WalkthroughableImage
var mode=[0]
var modetype = ['off', 'on', 'mode2', 'sleep','asd']
var text=[]
var settedvalue=0
var IDdisp
var template = []
var dalleValue=0,alleValue=0
var schedule,day
//fixare il dalle alle ogni elemento e` un intervallo
class template2 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            string: [],
            update:false,
        }
        schedule=JSON.parse( this.props.navigation.state.params[1])
        day=this.props.navigation.state.params[0]
        console.log( schedule[day])
        mode=schedule[day]
        this.dataFormal()
    }
    StartThing() {
        dalleValue=0
        alleValue=0
        settedvalue=0
        schedule=JSON.parse( this.props.navigation.state.params[1])
        day=this.props.navigation.state.params[0]
        IDdisp=this.props.navigation.state.params[2]
        console.log( schedule[day])
        mode=schedule[day]
        this.GetData()
     
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
        this.getTemplate()
    }
 
    render() {
        return (<View style={{backgroundColor:valueTheme==0?'white':'#2d383c'/*'#718792'*/}}>
            <ScrollView style={{height:Dimensions.get("window").height*0.75}} contentContainerStyle={{ alignItems: "center", backgroundColor: valueTheme==0?'white':'#2d383c',}}> 
                
                {console.log(this.state.string)}
                {text.map((e,i)=><View style={{justifyContent:"center", margin:10, backgroundColor:valueTheme==0?'white':'#718792', width:Dimensions.get("window").width,height:40, elevation:3}}>
                    <Text style={{color:valueTheme==0?'black':'white'}}>{e}</Text></View>)}
                
                </ScrollView>
                {this.timePickerMode()}
                </View>
        );
    };
    timePickerMode() {
        return (<View style={{ margin:10, alignItems: "center", flexDirection: "row", backgroundColor: '#039be5', elevation: 5, borderRadius: 10 }}>
            <NavigationEvents
                            onWillFocus={() => this.StartThing()}
                            onDidFocus={() => this.StartThing()}
                        />
            <Text style={{color:'white',marginLeft:5}}>Dalle: </Text>
            <View style={{ width: pickerwidth, height: pickerheight}}>
                <ScrollPicker
                    dataSource={['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
                    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00','24:00']}
                    selectedIndex={0}
                    renderItem={(data, index, isSelected) => {
                        return (
                            <View>
                                <Text>{data}</Text>
                            </View>
                        )
                    }}
                    onValueChange={(data, selectedIndex) => {
                       dalleValue=selectedIndex
                    }}

                    wrapperHeight={pickerheight}
                    wrapperWidth={pickerwidth}
                    wrapperBackground={'#039be5'}
                    itemHeight={pickerwidth*0.9}
                    highlightColor={'white'}
                    highlightBorderWidth={2}
                    activeItemColor={'white'}
                    itemColor={'white'}
                />
            </View>
            <Text style={{color:'white',marginLeft:5}}>Alle: </Text>
            <View style={{ width: pickerwidth, height: pickerheight }}>
                <ScrollPicker

                    dataSource={['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
                    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00','24:00']}
                    selectedIndex={0}
                   
                    onValueChange={(data, selectedIndex) => {
                        alleValue=selectedIndex
                        this.setState({update:false})
                    }}
                    
                    wrapperHeight={pickerheight}
                    wrapperWidth={pickerwidth}
                    wrapperBackground={'#039be5'}
                    itemHeight={pickerwidth*0.9}
                    highlightColor={'white'}
                    highlightBorderWidth={2}
                    activeItemColor={'#fff'}
                    itemColor={'#fff'}

                />

            </View>
            <Text style={{color:'white'}}>Modalita':</Text>
            <View style={{ width: pickerwidth*0.8, height: pickerheight }}>
                <ScrollPicker

                    dataSource={['off', 'on', 'low', 'turbo']}
                    selectedIndex={0}
                    renderItem={(data, index, isSelected) => {
                        return (
                            <View>
                                <Text>{data}sdfghjkl;{isSelected}</Text>
                            </View>
                        )
                    }}
                    onValueChange={(data, selectedIndex) => {
                        console.log(data)
                        
                        settedvalue=selectedIndex
                    }}

                    wrapperHeight={pickerheight}
                    wrapperWidth={pickerwidth*0.8}
                    wrapperBackground={'#039be5'}
                    itemHeight={pickerwidth*0.9}
                    highlightColor={'#fff'}
                    highlightBorderWidth={2}
                    activeItemColor={'#fff'}
                    
                    itemColor={'#fff'}

                />

            </View>
            <MaterialIcon  onPress={()=>this.addHour()} name='plus-circle' style={{ elevation:10, fontSize: 35 }} color='white' />
        </View>)
    }
    addHour(){
       
        mode.map((e,i)=>{
            
            if(i>=dalleValue && i<=alleValue){ mode[i]=settedvalue
                console.log((i>dalleValue && i<alleValue)+mode[i] +i)
            }
            if (i+1==mode.length){
                console.log('finito')
                schedule[day]=mode
             
            }
        }
        
        )
   this.dataFormal() 
   this.updateScheduleRequest()
   console.log('added'+dalleValue+ 'alle'+alleValue+mode+schedule[day])
    }
   updateScheduleRequest(){
    let postData={
        _csrf:code,
        deviceid:IDdisp,
        schedule:JSON.stringify( schedule)
    }
    return RNFetchBlob.config({
      trusty: true
    }).fetch('POST', 'https://78.46.215.53:3000/device/updateSchedule',
      {
      'Content-Type': 'application/json' },
        JSON.stringify(postData)
        ).then(response => response.text())
      .then(text => {
        try {
          console.log(text)
        } catch (err) {
          console.log(err)
        }
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
       // cookie=JSON.stringify(responseJson)
        //console.log(cookie)
       // alert(code)

      })
      .catch((error) => {
        console.log(error);
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
    dataFormal() {
        
        var temp=mode[0]
        var inithour = 0
        var hours=0

        var stringZip = []
        var counter=0
        console.log(mode.length+'lunghezza')
        mode.map((h, index) => {

            hours = index
            
            if (temp != h || index >= 23) {

                
                stringZip[counter] = "Dalle " + inithour + " alle " + hours + " : " + modetype[temp]
                
                temp = h
                inithour = hours
                console.log(stringZip[counter])
                counter++
                this.setState({string:stringZip})
                text=stringZip
            }

        })
        
       
        console.log(this.state.string)
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