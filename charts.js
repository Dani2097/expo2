import React from 'react';
import FlashMessage, { showMessage } from "react-native-flash-message";
import { Alert, Button, StyleSheet, ScrollView, View, Text, StatusBar, Dimensions, ActivityIndicator, NativeEventEmitter, } from 'react-native';
import { LineChart, } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationEvents } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ScrollPicker from 'react-native-wheel-scroll-picker';
import RangeSlider from 'rn-range-slider';
var listener = new NativeEventEmitter()
var allData, datadevice = []
var bgColor = ['white', '#2d383c', 'transparent']
var sensibility = 5
var namedata
var min = 0, rangeMax = 12
var fuse = 2
var hourlabel, valuedata
var pickerwidth = Dimensions.get("window").width / 6
var pickerheight = Dimensions.get("window").height / 10
var valueTheme, diffprecedente, difsucc, temp = false
export default class chart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            sensibility: 5,
            title: 'all',
            temp: 1,
            data: {
                labels: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
                datasets: [
                    {
                        data: [20, 40, 50, 200, 40, 50, 200, 40, 50, 200, 40, 50],
                        color: (opacity = 1) => 'rgba(58, 143, 255, 1)',
                    },

                ],

            }

        }
        datadevice = this.props.navigation.state.params.alldata
        allData = this.state.data
        sensibility = 5
    }
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'Chart',
            headerTitleStyle: { fontWeight: "bold", color: '#01379b' },
        };
    };
    componentDidMount() {

        AsyncStorage.getItem('fuse').then((data) => {
            data ? fuse = data : fuse = 2
            this.setState({ getfuse: true })
        }).catch((error) => fuse = 2)
        AsyncStorage.getItem('theme').then(data => { data ? valueTheme = JSON.parse(data) : valueTheme = 0 })
        listener.removeAllListeners('changetheme')
        listener.addListener('changetheme', data => {
            AsyncStorage.getItem('theme').then(data => {
                valueTheme = JSON.parse(data)
                this.setState({ darktheme: !!valueTheme })

            })
        })
        valueTheme = valueTheme || 0
        sensibility = 5
        this.onStart(5)
    }
    onStart(sensibility) {
        mapping = {
            temp: [],
            hum: [],
            no2: [],
            co2: [],
            pm1: [],
            pm2: [],
            pm10: [],
            pm4: [],
            date: [],
        }
        datadropDown.map((e, i) => {
            console.log(e)
            var name = this.props.navigation.state.params.id
            if (e.value == name) {
                namedata = e.value
                this.handleChange(i, sensibility)
            }
        }
        )



    }
    getTheme() {
        AsyncStorage.getItem('theme').then(data => { data ? valueTheme = JSON.parse(data) : valueTheme = 0 })
    }

    handleChange = (value, sensibilitya) => {
        temp = false
        const self = this;
        console.log('iniziooo log--------------')
        console.log('il value e`' + value)
        console.log(typeData[value - 1])
        console.log(mapping)
        console.log('lunghezza')

        console.log(mapping[typeData[value - 1]].length)
        console.log(mapping.temp)
        console.log('fine log--------------')

        var counter = 1
        var lastdata = new Date((datadevice[datadevice.length - 1].date - 3600 * fuse) * 1000)
        if (sensibility > 1) {
            datadevice.map((e, i) => {
                // console.log(mapping[typeData[value - 1]])
                var dataprecedente = new Date(1)
                var datarilevazioni = new Date((e.date - 3600 * fuse) * 1000)
                if (i > 0)
                    dataprecedente = new Date((datadevice[i - 1].date - 3600 * fuse) * 1000)
                if ((datarilevazioni.getDate() == dataprecedente.getDate())) {
                    counter++;
                    mapping[typeData[value - 1]][mapping[typeData[value - 1]].length - 1] = (mapping[typeData[value - 1]][mapping[typeData[value - 1]].length - 1] + JSON.parse(e[typeData[value - 1]]))
                    if (i >= datadevice.length - 1) {
                        console.log('sto dividendo ' + mapping[typeData[value - 1]][mapping[typeData[value - 1]].length - 1] + 'per ' + counter)
                        mapping[typeData[value - 1]][mapping[typeData[value - 1]].length - 1] = mapping[typeData[value - 1]][mapping[typeData[value - 1]].length - 1] / counter
                        counter = 1
                    }
                } else {
                    console.log('sto dividendo ' + mapping[typeData[value - 1]][mapping[typeData[value - 1]].length - 1] + 'per ' + counter)
                    mapping[typeData[value - 1]][mapping[typeData[value - 1]].length - 1] = mapping[typeData[value - 1]][mapping[typeData[value - 1]].length - 1] / counter
                    counter = 1
                    if ((datarilevazioni.getMonth() == lastdata.getMonth()) && (Math.abs(datarilevazioni.getDate() - lastdata.getDate()) <= sensibility)) {

                        mapping[typeData[value - 1]].push(JSON.parse(e[typeData[value - 1]]))
                        console.log(Math.abs(datarilevazioni.getDate() - lastdata.getDate()))
                        mapping.date.push('' + new Date(e.date * 1000).getDate() + '/' + new Date(e.date * 1000).getMonth())
                    }
                }

            })

            console.log(mapping[typeData[value - 1]] + 'il giorno' + lastdata.getDate())



            this.setData(value, mapping[typeData[value - 1]], mapping)

        } else {
            diffprecedente = NaN
            difsucc = NaN
            datadevice.map((e, i) => {
                var dataprecedente = new Date(1)
                var datarilevazioni = new Date((e.date - 3600 * fuse) * 1000)
                if (i > 0)
                    dataprecedente = new Date((datadevice[i - 1].date - 3600 * fuse) * 1000)
                if (datarilevazioni.getHours() == dataprecedente.getHours()) {
                    counter++;
                    mapping[typeData[value - 1]][mapping[typeData[value - 1]].length - 1] = (mapping[typeData[value - 1]][mapping[typeData[value - 1]].length - 1] + JSON.parse(e[typeData[value - 1]]))
                    if (i >= datadevice.length - 1) {
                        console.log('sto dividendo ' + mapping[typeData[value - 1]][mapping[typeData[value - 1]].length - 1] + 'per ' + counter)
                        mapping[typeData[value - 1]][mapping[typeData[value - 1]].length - 1] = mapping[typeData[value - 1]][mapping[typeData[value - 1]].length - 1] / counter
                        if (mapping[typeData[value - 1]][mapping[typeData[value - 1]].length - 1] != NaN)
                            hourData[datarilevazioni.getHours()] = mapping[typeData[value - 1]][mapping[typeData[value - 1]].length - 1]
                        counter = 1
                    }
                } else {
                    console.log('sto dividendo ' + mapping[typeData[value - 1]][mapping[typeData[value - 1]].length - 1] + 'per ' + counter)
                    mapping[typeData[value - 1]][mapping[typeData[value - 1]].length - 1] = mapping[typeData[value - 1]][mapping[typeData[value - 1]].length - 1] / counter
                    if (mapping[typeData[value - 1]][mapping[typeData[value - 1]].length - 1] != NaN)
                        hourData[datarilevazioni.getHours()] = mapping[typeData[value - 1]][mapping[typeData[value - 1]].length - 1]
                    counter = 1
                    if ((datarilevazioni.getDay() == lastdata.getDay()) && (Math.abs(datarilevazioni.getHours() - lastdata.getHours()) <= 24)) {





                        if (e[typeData[value - 1]] != NaN)
                            hourData[datarilevazioni.getHours()] = e[typeData[value - 1]]
                        console.log(hourData)
                        mapping[typeData[value - 1]].push(JSON.parse(e[typeData[value - 1]]))


                        console.log(Math.abs(datarilevazioni.getHours() - lastdata.getHours()))
                        mapping.date.push('' + new Date(e.date * 1000).getDate() + '/' + new Date(e.date * 1000).getMonth())
                    }
                }

            })

            console.log(mapping[typeData[value - 1]] + lastdata.getDate())
            for (var i = 0; i < hourData.length; i++) {
                hourData[i] = hourData[i] || 0
            }
            this.setData(value, hourData, 1, 0)

        }
    };
    setData(value, mapping, type, rangeMin, rangeMax) {
        rangeMin = rangeMin || 0
        rangeMax = rangeMax || 12
        var labels = []
        console.log(type)
        if (type == 1) {
            var hourDataToSee = []

            for (let index = rangeMin; index <= rangeMax; index++) {
                hourDataToSee.push(mapping[index])
                labels.push(index)
            }
            valuedata = value
            hourlabel = mapping
            mapping = hourDataToSee

        }
        else labels = type.date
        this.setState({

            title: datadropDown[value].value,
            data: {

                labels: labels,

                datasets: [{
                    data: [max[typeData[value - 1]], max[typeData[value - 1]], max[typeData[value - 1]], max[typeData[value - 1]], max[typeData[value - 1]], max[typeData[value - 1]], max[typeData[value - 1]], max[typeData[value - 1]], max[typeData[value - 1]]],
                    color: (opacity = 1) => 'rgba(255,0,0,1)',

                    withDots: false
                },
                {
                    data: mapping,
                    color: (opacity = 1) => 'rgba(0,0,255,1)'
                }],
                legend: [max[typeData[value - 1]] + " soglia", "Valore registrato"],

            }

        });

        this.setState({ isLoading: false })
    }
    render() {
        return (<View>
            <View style={{ backgroundColor: bgColor[valueTheme || 0], minHeight: Dimensions.get("window").height + 20 }}>
                <ScrollView style={{ maxHeight: Dimensions.get("window").height * 0.8 }} contentContainerStyle={{ backgroundColor: bgColor[valueTheme], alignItems: "center", minHeight: Dimensions.get("window").height * 0.8 }}>
                    {this.state.isLoading && <ActivityIndicator color={"#000"} />}
                    <NavigationEvents
                        onWillFocus={() => this.getTheme()}
                        onDidFocus={() => this.getTheme()}
                        onDidBlur={() => mapping = {
                            temp: [],
                            hum: [],
                            no2: [],
                            co2: [],
                            pm1: [],
                            pm2: [],
                            pm10: [],
                            pm4: [],
                            date: [],
                        }} />

                    <Text style={{ margin: 10, color: valueTheme == 0 ? 'blue' : 'azure', fontWeight: 'bold', fontSize: 20 }}>Statistiche - {this.state.title}(GMT {fuse > 0 ? '+' : ''}{fuse})</Text>
                    {this.Lchart()}
                    <View style={{ flexDirection: "row", width: Dimensions.get('window').width, elevation: 5, alignItems: "center" }}>
                        <Icon onPress={() => this.changesensibility(-1)} size={20} color={valueTheme == 0 ? 'black' : 'white'} name='chevron-left' style={{ marginLeft: 5, width: Dimensions.get("window").width / 4 }}></Icon>
                        <TouchableOpacity color='transparent' style={{ marginBottom: 10, justifyContent: 'center', alignItems: 'center', width: Dimensions.get("window").width / 2 }} onPress={() => this.SetSelectedTemplate()}>
                            <Text style={{ color: valueTheme == 0 ? 'black' : 'azure', marginTop: 8, fontWeight: 'bold' }}>Giorni considerati : {sensibility}</Text>
                        </TouchableOpacity>
                        <Icon size={20} onPress={() => this.changesensibility(1)} color={valueTheme == 0 ? 'black' : 'white'} name='chevron-right' style={{ textAlign: 'right', alignItems: "flex-end", width: Dimensions.get('window').width / 4.6 }}></Icon></View>
                    {sensibility == 1 && <Text>Imposta il range delle ore da voler vedere</Text>}
                    {sensibility == 1 && <Text>(dalle 00 alle 12 di default)</Text>}
                    {sensibility == 1 && 
                    <RangeSlider
                    initialHighValue={12}
                        style={{ width: 160, height: 80 }}
                        gravity={'center'}
                        min={0}
                        max={24}
                        step={1}
                        thumbColor='#88f'
                        selectionColor="#00f"
                        blankColor="#f618"
                        onValueChanged={(low, high, fromUser) => {
                            min=low
                            rangeMax=high
                            this.setData(valuedata, hourlabel, 1,low,high)

                        }} />}
 {sensibility == 1 && <Text>Dalle: {min} alle {rangeMax}</Text>}

            </ScrollView>

                <FlashMessage textStyle={{ textAlign: 'center', fontWeight: "bold" }} style={{ alignItems: "center" }} position='center' floating={true} duration={1000} />


            </View></View>
        );
    }

    changesensibility(i) {
        this.setState({ isLoading: true })
        var news = sensibility

        if (!(news + i <= 0)) news = news + i
        sensibility = news
        this.setState({ sensibility: news })
        console.log(news + 'la girna' + sensibility)
        this.onStart(sensibility)
    }

    Lchart() {
        return <View><LineChart
            fromZero={true}
            data={this.state.data}
            width={Dimensions.get("window").width * 0.9} // from react-native
            height={220}
            style={{ elevation: 5 }}

            yAxisInterval={1} // optional, defaults to 1
            onDataPointClick={({ value, dataset, index, getColor }) =>
                showMessage({
                    message: sensibility == 1 ? namedata + ' reggistrata alle ' + (parseInt(parseInt(index) + parseInt((min || 0)))) : namedata + ' reggistrata il ' + mapping.date[index],
                    description: `${value}`,
                    backgroundColor: "#01379b"
                })
            }
            chartConfig={{
                backgroundGradientTo: "white",
                backgroundGradientFrom: "#01379b",
                propsForLabels: { fontWeight: 'bold' },
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 16
                },
                propsForDots: {
                    r: "5",
                    strokeWidth: "1",
                    stroke: "#fff"
                }
            }}

            bezier
            style={{
                marginVertical: 8,
                borderRadius: 16
            }}

        />
        </View>
    }
   
}
var hourData = new Array(25).fill(0);

let texts
let datadropDown = [{
    value: 'All',
}, {
    value: 'Temperatura',
}, {
    value: 'Umidita',
}, {
    value: 'NO2',
}, {
    value: 'co2',
}, {
    value: 'PM1',
}, {
    value: 'PM2',
}, {
    value: 'PM10',
}];

let mapping = {

}
let max = {
    temp: 37,
    hum: 67,
    no2: 500,
    co2: 2000,
    pm1: 100,
    pm2: 200,
    pm10: 500,
    pm4: 300,
}
var typeData = [

    'temp',
    'hum',
    'no2',
    'co2',
    'pm1',
    'pm2',
    'pm10',
    'pm4',
    'date',
]
const styles = StyleSheet.create({
    container: {
        minHeight: Dimensions.get('window').height,
        backgroundColor: '#102027',
        alignItems: 'center',

    },
});

