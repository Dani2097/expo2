import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Switch, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import prompt from 'react-native-prompt-android';
import { NavigationEvents } from 'react-navigation';
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";
import { FAB } from 'react-native-paper';
import { Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob';
import TopTab from './TopTab';
import { NativeEventEmitter } from 'react-native';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
var alldata={
    co2: [],
    temp: [],
    hum: [],
    no2: [],
    pm1: [],
    pm2: [],
    pm10: [],
    pm4: [],
    date: [],
}
var listener=new NativeEventEmitter()
var id,date=new Date(1),prova=new Date(1588899976000),prova1=new Date(1588829976000)
class StatisticheDispositivo extends React.Component {

    constructor(props) {
        super(props);
        //serve per capire quando sono stati caricati i gruppi
        this.state = {
            isLoading: true,
            Name: PageName,
            fill: 30,

            datadevice: {
                co2: 0,
                temp: 0,
                hum: 0,
                no2: 0,
                pm1: 0,
                pm2: 0,
                pm10: 0,
                pm4: 0,
                date: 0,
            },
            temperatura: 27,
            umidita: 80,
            colorT: '#dce775',
            colorU: '#dce775',
            temp: 1,
            drawerOpen: false
        }
        PageName = this.props.navigation.state.params.name

    }
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Statistiche - ' + PageName,
        };
    };
    componentDidMount() {
        new NativeEventEmitter().addListener('asd', (data) => {
            this.setState({ tabselected: data })
        });


    }

    //da cambiare in start method
    checkSession() {
        AsyncStorage.getItem('theme').then(data=>{data ? valueTheme=JSON.parse(data):valueTheme=0})
        id = this.props.navigation.state.params.ID
        console.log(id)
        listener.removeAllListeners('changetheme')
        listener.addListener('changetheme',data=>{
            AsyncStorage.getItem('theme').then(data=>{valueTheme=JSON.parse(data)
            this.setState({darktheme:!!valueTheme})
        
            })
        })
        this.GetDataDisp()


    }
    render() {
        if (this.state.datadevice['temp'] > 30) tempAlert = true
        if (this.state.datadevice['hum'] > 67) humAlert = true
        return (

            <View>

                <View style={{ backgroundColor: bgColor[valueTheme], minHeight: Dimensions.get("window").height }}>

                    <NavigationEvents
                        onWillFocus={() => this.checkSession()}
                        onDidFocus={() => this.checkSession()}

                    />
                    <ScrollView contentContainerStyle={{ backgroundColor: bgColor[valueTheme], alignItems: "center", minHeight: Dimensions.get("window").height * 1.3 }}>
                        <Text style={{color: valueTheme==0? '#03256c':'white', fontWeight: 'bold', fontSize: 20, marginTop: Dimensions.get('window').height * 0.005 }}>Ultime rilevazioni</Text>
                        <Text style={{ color: valueTheme==0? '#03256c':'white',fontWeight: 'bold', fontSize: 10, marginTop: Dimensions.get('window').height * 0.005 }}>rilevazione delle {date.getHours()<10 ? '0'+ date.getHours():date.getHours()}{':'+date.getMinutes()+" del "+ date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear()}</Text>
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
                                            fill={this.state.datadevice['temp'] / 4 * 10}
                                            backgroundColor="#3d5875">
                                            {
                                                (fill) => (
                                                    <CopilotStep
                                                        text='cliccando su un indicatore ti portera` alla pagina per visualizzare le statistiche mensili'
                                                        order={2}

                                                        name='second'>
                                                        <WalkthroughableView>
                                                            <TouchableHighlight onPress={() => this.Changepage('Temperatura')} style={{ backgroundColor: this.state.colorT, width: Dimensions.get('window').width * 0.3, height: Dimensions.get('window').width * 0.3, alignItems: 'center', justifyContent: 'center' }} >
                                                                <Text>{this.state.datadevice['temp']} c{'\u00B0'}</Text>
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
                                            fill={this.state.datadevice['hum']}
                                            backgroundColor="#3d5875">
                                            {
                                                (fill) => (
                                                    <TouchableHighlight onPress={() => this.Changepage('Umidita')} style={{ backgroundColor: this.state.colorU, width: Dimensions.get('window').width * 0.3, height: Dimensions.get('window').width * 0.3, alignItems: 'center', justifyContent: 'center' }} >
                                                        <Text>{this.state.datadevice['hum']} %</Text>
                                                    </TouchableHighlight>
                                                )
                                            }
                                        </AnimatedCircularProgress>
                                    </View>
                                </View>
                                {tempAlert ? <Text style={{ color: 'red', fontWeight: 'bold', marginBottom: 10 }}>Temperatura rilevata troppo alta</Text> : <View style={{ marginBottom: 10 }} />}
                                {humAlert ? <Text style={{ color: 'red', fontWeight: 'bold', marginBottom: 10 }}>Umidita` rilevata troppo alta</Text> : <View style={{ marginBottom: 10 }} />}

                                {!humAlert && !tempAlert ? <Text style={{ color: 'green', fontWeight: 'bold', marginBottom: 10 }}>Valori nella norma</Text> : <View style={{ marginBottom: 10 }} />}

                            </WalkthroughableView></CopilotStep>
                        <CopilotStep
                            text='se l`indicatore e` rosso signifa che si e` sforato il valore massimo consigliato'
                            order={3}

                            name='fourth'>
                            <WalkthroughableView style={{ flexDirection: "row" }}>
                                {this.createCell(this.state.datadevice['co2'], 300, 'co2', 'ppm')}
                                {this.createCell(this.state.datadevice['no2'], 200, 'NO2', 'ppm')}

                            </WalkthroughableView></CopilotStep>
                        <View style={{ flexDirection: "row" }}>
                            {this.createCell(this.state.datadevice['pm1'], 2000, 'PM1', 'ppm')}
                            {this.createCell(this.state.datadevice['pm2'], 2000, 'PM2', 'ppm')}
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            {this.createCell(this.state.datadevice['pm4'], 2000, 'PM4', 'ppm')}
                            {this.createCell(this.state.datadevice['pm10'], 2000, 'PM10', 'ppm')}
                        </View>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate('BlueTooth')}><Text>Rilevazioni bluethoot</Text></TouchableOpacity>
                        <View style={styles.container}>
                        </View>
                    </ScrollView>
                </View></View>
        );

    }
    //todo: cambiare in go to chart
    Changepage(name) {
        var id
        id = name
        this.props.navigation.navigate('chart', { id,alldata })
    }
    createCell(value, valueMax, title, unita) {
        var color = '#ffffcf'

        if (value > valueMax) color = 'red'
        return <View style={{
            shadowColor: '#123456',
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 1,
            shadowRadius: 1, elevation: 3, width: Dimensions.get('window').width * 0.44, height: Dimensions.get('window').width * 0.45, backgroundColor: secondaryColor[valueTheme], margin: 5, borderRadius: 10, alignItems: 'center', borderColor:valueTheme==0?'#01579b':'white', borderWidth: 2
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
                        <TouchableHighlight onPress={() => this.Changepage(title)} style={{ backgroundColor: 'azure', width: Dimensions.get('window').width * 0.3, height: Dimensions.get('window').width * 0.3, alignItems: 'center', justifyContent: 'center' }} >
                            <Text>{value}{unita}</Text>
                        </TouchableHighlight>
                    )
                }
            </AnimatedCircularProgress>
            <Text style={{ marginTop: 10, color: 'white' }}>{title}</Text>
        </View>

    }

    //httprequest
    GetDataDisp = () => {

        return RNFetchBlob.config({
            trusty: true,
            timeout:1000
        }).fetch('GET', 'https://78.46.215.53:3000/devices/historicalData/'+id)
            .then((response) =>

                response.json())
            .then((responseJson) => {
                console.log(responseJson.data.deviceData)
                var data = responseJson.data.deviceData
                //console.log(data[data.length - 1].co2)
                alldata=data
                this.setState({ datadevice: data[data.length - 1] })
                console.log(this.state.datadevice['temp'])
                date = new Date();
                date.setTime(this.state.datadevice.date*1000)
                this.setState({ fill: 50 })
            })
            .catch((error) => {

                console.log(error);
            });
    }
}
//todo: prendere i dati online

var styles = StyleSheet.create({
    container: {

        backgroundColor: bgColor[valueTheme],
        alignItems: 'center',

    }, fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },

});

export default copilot({
    animated: true, // Can be true or false
    overlay: 'svg', // Can be either view or svg
    androidStatusBarVisible: true
})(StatisticheDispositivo);

var str = "co2:1234Temp:22.22Hum:44.4"
var int = []