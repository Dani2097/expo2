import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Switch, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import prompt from 'react-native-prompt-android';
import { NavigationEvents } from 'react-navigation';
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";

import { Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import RNFetchBlob from 'rn-fetch-blob';
import TopTab from './TopTab';
import { NativeEventEmitter } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation'
import httpService from './HttpService'
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
//cambiato col service
const WalkthroughableView = walkthroughable(View); //Making a WalkthroughableText
let groups = []
var userid
var PageName
var bgColor = ['transparent', '#102027']
var valueTheme = 0
var bgColor = ['white', '#2d383c', 'transparent']
var containerColor = ['azure', '#b3e5fc', '#ffe082',]
var buttonColor = ['#2C7873', 'lightyellow']
var secondaryColor = ['#039be5', '#718792', 'black']
var thirdTextColor = ['#fff', '#0288d1', 'blue']
var tempAlert = false
var humAlert = false
var httpHandler= new httpService()
//add alert temp hum ecc
var listener = new NativeEventEmitter()
class Home extends React.Component {

    constructor(props) {
        super(props);
        //serve per capire quando sono stati caricati i gruppi
        this.state = {
            isLoading: true,
            Name: PageName,
            tabselected: 0,
            temperatura: 27,
            umidita: 80,
            colorT: '#dce775',
            colorU: '#dce775',
            temp: 1,
            drawerOpen: false,
            loading: true
        }
        PageName = this.props.navigation.state.routeName


    }
    componentDidMount() {

        listener.removeAllListeners('changetheme')
        listener.addListener('changetheme', data => {
            AsyncStorage.getItem('theme').then(data => {
                data ? valueTheme = JSON.parse(data) : valueTheme = 0
                this.setState({ darktheme: !!valueTheme })

            })
        })

    }

    //da cambiare in start method
    checkSession() {
        listener.removeAllListeners('changetheme')
        listener.addListener('changetheme', data => {
            AsyncStorage.getItem('theme').then(data => {
                valueTheme = JSON.parse(data)
                this.setState({ darktheme: !!valueTheme })

            })
        })
        AsyncStorage.getItem('theme').then(data => { data ? valueTheme = JSON.parse(data) : valueTheme = 0 })
        datadevice = {
            co2: 0,
            temp: 0,
            hum: 0,
            no2: 0,
            pm1: 0,
            pm2: 0,
            pm10: 0,
            pm4: 0,
            date: 0,
        }
        this.setState({ tabselected: 0 })
        listener.removeAllListeners('page1')

        event = listener.addListener('page1', (data) => {
            this.setState({ tabselected: data })
            this.GetDataDispGroup(data)
            console.log(this.state.tabselected)

        });
        this.GetSessionData()
        this.GetDataDispGroup(0)
        console.log('should see')
        new NativeEventEmitter().emit('InitialTab', 0);

        var title = 'asd'
        this.props.navigation.setParams({ title: title })
        //todo: cambiare il controllo sessione con il controllo online
        AsyncStorage.getItem('Session')
            .then((dispositivi) => {
                var t = JSON.parse(dispositivi)
                if (t == true) {
                    console.log(t)
                    this.setState({ Name: this.props.navigation.state.routeName })
                    // this.resetStack()
                }
                else this.props.navigation.navigate("LoginPage", false)

            });
    }
    bluroperation() {
        listener.emit('InitialTab')
        listener.removeAllListeners('page1')
        this.setState({ tabselected: 0 })
    }
    render() {
        return (

            <View>
                <TopTab />
                <View style={{ backgroundColor: bgColor[valueTheme], minHeight: Dimensions.get("window").height }}>
                    {this.state.loading && <ActivityIndicator color={valueTheme == 0 ? "#000" : '#fff'} />}

                    <NavigationEvents
                        onWillFocus={() => this.checkSession()}
                        onDidFocus={() => this.checkSession()}
                        onDidBlur={() => { this.bluroperation() }}
                        onWillBlur={() => { this.bluroperation() }}
                    />
                    <ScrollView contentContainerStyle={{ backgroundColor: bgColor[valueTheme], alignItems: "center", minHeight: Dimensions.get("window").height * 1.6 }}>
                        <Text style={{ color: valueTheme == 0 ? '#03256c' : 'white', fontWeight: 'bold', fontSize: 20, marginTop: Dimensions.get('window').height * 0.005 }}>Ultime rilevazioni</Text>
                        <Text style={{ color: valueTheme == 0 ? '#03256c' : 'white', marginTop: 5, marginBottom: 5, textAlign: "center" }}>I valori si riferiscono ad una media dei dispositivi del gruppo</Text>
                        <CopilotStep
                            text='qui potrai vedere le statistiche medie del gruppo selezionato in real time'
                            order={1}
                            name='first'>
                            <WalkthroughableView style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 1, height: 2 },
                                shadowOpacity: 1,
                                shadowRadius: 1,
                                elevation: 3, width: Dimensions.get('window').width * 0.9, backgroundColor: containerColor[valueTheme], margin: 10, borderRadius: 15, alignItems: 'center', borderColor: '#0288d1', borderWidth: 2
                            }}>
                                <View style={{
                                    width: Dimensions.get('window').width * 0.8,
                                    flexDirection: 'row',
                                }}>
                                    <View style={{
                                        width: Dimensions.get('window').width * 0.4,
                                        alignItems: "center"
                                    }}>
                                        <Text style={{ color: thirdTextColor[valueTheme], fontWeight: 'bold', margin: 15 }}>Temperatura</Text>
                                        <AnimatedCircularProgress
                                            size={Dimensions.get('window').width * 0.3}
                                            width={7}
                                            tintColor={buttonColor[valueTheme]}
                                            fill={datadevice['temp'] / 4 * 10}
                                            backgroundColor="#3d5875">
                                            {
                                                (fill) => (
                                                    <CopilotStep
                                                        text='cliccando su un indicatore ti portera` alla pagina per visualizzare le statistiche mensili'
                                                        order={2}

                                                        name='second'>
                                                        <WalkthroughableView>
                                                            <TouchableHighlight style={{ backgroundColor: this.state.colorT, width: Dimensions.get('window').width * 0.3, height: Dimensions.get('window').width * 0.3, alignItems: 'center', justifyContent: 'center' }} >
                                                                <Text>{datadevice['temp']} c{'\u00B0'}</Text>
                                                            </TouchableHighlight></WalkthroughableView></CopilotStep>
                                                )
                                            }
                                        </AnimatedCircularProgress>
                                    </View>
                                    <View style={{
                                        width: Dimensions.get('window').width * 0.4,
                                        alignItems: "center"
                                    }}>
                                        <Text style={{ color: thirdTextColor[valueTheme], fontWeight: 'bold', margin: 15 }}>Umidita`</Text>
                                        <AnimatedCircularProgress
                                            size={Dimensions.get('window').width * 0.3}
                                            width={7}
                                            tintColor={buttonColor[valueTheme]}
                                            fill={datadevice['hum']}
                                            backgroundColor="#3d5875">
                                            {
                                                (fill) => (
                                                    <TouchableHighlight style={{ backgroundColor: this.state.colorU, width: Dimensions.get('window').width * 0.3, height: Dimensions.get('window').width * 0.3, alignItems: 'center', justifyContent: 'center' }} >
                                                        <Text>{datadevice['hum']} %</Text>
                                                    </TouchableHighlight>
                                                )
                                            }
                                        </AnimatedCircularProgress>
                                    </View>
                                </View>
                                {tempAlert ? <Text style={{ color: 'red', fontWeight: 'bold', marginBottom: 10 }}>Temperatura della settimana troppo alta</Text> : <View style={{ marginBottom: 10 }} />}
                                {humAlert ? <Text style={{ color: 'red', fontWeight: 'bold', marginBottom: 10 }}>Umidita` della settimana troppo alta</Text> : <View style={{ marginBottom: 10 }} />}

                                {!humAlert && !tempAlert ? <Text style={{ color: 'green', fontWeight: 'bold', marginBottom: 10 }}>Valori nella norma</Text> : <View style={{ marginBottom: 10 }} />}

                            </WalkthroughableView></CopilotStep>
                        <CopilotStep
                            text='se l`indicatore e` rosso signifa che si e` sforato il valore massimo consigliato'
                            order={3}

                            name='fourth'>
                            <WalkthroughableView style={{ flexDirection: "row" }}>
                                {this.createCell(datadevice['co2'], 2000, 'CO2', 'ppm')}
                                {this.createCell(datadevice['no2'], 2000, 'No2', 'ppm')}

                            </WalkthroughableView></CopilotStep>
                        <View style={{ flexDirection: "row" }}>
                            {this.createCell(datadevice['pm1'], 2000, 'PM1', 'ppm')}
                            {this.createCell(datadevice['pm2'], 2000, 'PM2', 'ppm')}
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            {this.createCell(datadevice['pm4'], 2000, 'PM4', 'ppm')}
                            {this.createCell(datadevice['pm10'], 2000, 'PM10', 'ppm')}
                        </View>
                        <Text>Usage statistics</Text>
                        <View style={styles.container}>
                        </View>
                    </ScrollView>
                </View></View>
        );

    }
 

    createCell(value, valueMax, title, unita) {
        var color = '#ffffcf'
        if (value > valueMax) color = 'red'
        return <View style={{
            shadowColor: '#123456',
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 1,
            shadowRadius: 1, elevation: 3, width: Dimensions.get('window').width * 0.44, height: Dimensions.get('window').width * 0.45, backgroundColor: secondaryColor[valueTheme], margin: 5, borderRadius: 10, alignItems: 'center', borderColor: valueTheme == 0 ? '#01579b' : '#fff', borderWidth: 2
        }}>
            <AnimatedCircularProgress
                size={Dimensions.get('window').width * 0.25}
                width={3}
                style={{ marginTop: 20 }}
                tintColor={color}
                fill={value / valueMax * 100}
                backgroundColor="#01579b">

                {
                    (fill) => (
                        <TouchableHighlight style={{ backgroundColor: 'azure', width: Dimensions.get('window').width * 0.3, height: Dimensions.get('window').width * 0.3, alignItems: 'center', justifyContent: 'center' }} >
                            <Text>{value} {unita}</Text>
                        </TouchableHighlight>
                    )
                }
            </AnimatedCircularProgress>
            <Text style={{ marginTop: 10, color: 'white' }}>{title}</Text>
        </View>

    }

    //httprequest
    GetSessionData = () => {
        httpHandler.getRequest('getSession',' ').then((responseJson)=>{
            
            this.props.navigation.setParams({ user: responseJson.data.fullname })
            userid = responseJson.data.id
            this.Getdevices()
            AsyncStorage.setItem('UserId', responseJson.data.id + '')
            if (!responseJson.data.id) {
                console.log("SESSIONE SCADUTA")
            } else console.log("SESSIONE ATTIVA")
          
            code = responseJson.csrfToken

        }      ).catch(e=>this.props.navigation.navigate("LoginPage", false))

    }
    Getdevices = () => {
        return RNFetchBlob.config({
            trusty: true,
            timeout: 5000,

        }).fetch('GET', 'https://78.46.215.53:3000/devices/getUserDevices/' + userid)
            .then((response) =>
                response.json())
            .then((responseJson) => {
                console.log(responseJson)

                AsyncStorage.setItem('dispositivi', JSON.stringify(responseJson));
                AsyncStorage.setItem('groups2', JSON.stringify(responseJson.data.groups)).then(new TopTab().GetDataStored());

            })
            .catch((error) => {
                console.log(error)
            });
    }
    GetDataDispGroup = (data) => {
        this.setState({ loading: true })
        datadevice = {
            co2: 0,
            temp: 0,
            hum: 0,
            no2: 0,
            pm1: 0,
            pm2: 0,
            pm10: 0,
            pm4: 0,
            date: 0,
        }
        httpHandler.getRequest('getGroupsData',data).then((responseJson)=>{
            console.log(responseJson)
                if (responseJson.data) {
                    //  console.log(responseJson.data.lastHistory)
                    var counter = 0
                    responseJson.data.lastHistory.map((e, i) => {
                        // console.log(e)
                        counter++
                        console.log(e.result[0]['temp'])
                        dataname.map((string) => {
                            datadevice[string] = parseInt(datadevice[string]) + parseInt(e.result[0][string])
                            // console.log(e.result[0]['co2'])
                        })
                    })
                    dataname.map((string) => datadevice[string] = parseInt(datadevice[string] / counter))
                }
                this.setState({ loading: false })
                console.log(datadevice)
                     })
            .catch((error) => {

                console.log(error);
            });
      
    }
}
let datadevice = {
    co2: 0,
    temp: 0,
    hum: 0,
    no2: 0,
    pm1: 0,
    pm2: 0,
    pm10: 0,
    pm4: 0,
    date: 0,
}
let dataname = [
    'co2',
    'temp',
    'hum',
    'no2',
    'pm1',
    'pm2',
    'pm10',
    'pm4',
    'date',
]
//todo: prendere i dati online

var styles = StyleSheet.create({
    container: {

        backgroundColor: bgColor[valueTheme],
        alignItems: 'center',

    }, 

});

export default copilot({
    animated: true, // Can be true or false
    overlay: 'view', // Can be either view or svg
    androidStatusBarVisible: true
})(Home);

var str = "co2:1234Temp:22.22Hum:44.4"
var int = []