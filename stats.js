import React from 'react';


import {
    Alert,
    Button,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Dimensions,
    
} from 'react-native';
import {
    LineChart,

} from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
var dataNumber = [100, 900, 800, 1000]
var allData
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { TouchableHighlight } from 'react-native';
import { create } from 'react-test-renderer';
import LinearGradient from 'react-native-linear-gradient';
//import 'react-circular-progressbar/dist/styles.css';
const WalkthroughableView = walkthroughable(View); //Making a WalkthroughableText
var tabColor = ['#021c1e', '#021c1e', '#2C7873']
var gradientColors = [['#004445', '#2C7873', '#2a7874'], ['#004445', '#2C7873'], ['#2C7873', '#ebcdc2', '#2C7873', '#2C7874']]
var bgColor = ['transparent', '#102027', 'transparent']
var containerColor = ['#8Fd99F', '#ffe082', '#fff']
var valueTheme = 0
var textColor = ['grey', '#fff', 'grey']
var buttonColor = ['#2C7873', 'lightyellow']

var secondaryColor = ['#021c1e', '#718792', 'black']
var thirdTextColor = ['#021c1e', '#ffffcf', 'blue']
var tempAlert = false
var humAlert = false
 class chart extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            temperatura: 27,
            umidita: 80,
            colorT: '#dce775',
            colorU: '#dce775',
            temp: 1,
            isLoading: true,


        }

        allData = this.state.data
    }
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'Statistics',
            headerTitleStyle: { color: '#fff' },
            headerStyle: { backgroundColor: '#021c1e' },
            headerRight:()=> <Icon style={{ color: '#fff' ,marginRight:20 }} name={'question-circle'} size={25} onPress={() => params.handleSave()} />
        };
    };
     componentDidMount() {
         valueTheme = this.props.navigation.state.params.theme

         this.props.navigation.setParams({ StartThing: this.props.start });
         this.props.start()
        if (this.state.temperatura > 30) {
            this.setState({ colorT: '#f4511e' })
            tempAlert = true
        }
        if (this.state.umidita > 80) {
            this.setState({ colorU: '#f4511e' })
            humAlert = true
        }
    }
    handleChange = (value) => {
        const self = this;
        this.dataNumber = [10, 10, 10, 10]
        dataNumber = allData
        if (value == 0) this.setState({
            data: allData
        })
        else
            this.setState({

                data: {
                    labels: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
                    datasets: [
                        {
                            data: dataNumber.datasets[value - 1].data,
                            color: dataNumber.datasets[value - 1].color
                        }
                    ]
                }

            });


    };
    createCell(value, valueMax, title, unita) {
        var color ='#ffffcf'
        if (value>valueMax) color='red'
        return <View style={{ width: Dimensions.get('window').width * 0.42, height: 150, backgroundColor:secondaryColor[valueTheme], margin: 10, borderRadius: 15, alignItems: 'center' }}>


            <AnimatedCircularProgress
                size={Dimensions.get('window').width * 0.25}
                width={3}
                style={{ marginTop:20 }}
                tintColor={color}
                fill={value / valueMax*100}
                backgroundColor="#3d5875">
                
                {
                    (fill) => (
                        <TouchableHighlight onPress={() => this.Changepage(title)} style={{ backgroundColor: this.state.colorU, width: Dimensions.get('window').width * 0.3, height: Dimensions.get('window').width * 0.3, alignItems: 'center', justifyContent: 'center' }} >
                            <Text>{value} {unita}</Text>
                        </TouchableHighlight>
                    )
                }
            </AnimatedCircularProgress>
            <Text style={{ marginTop: 10, color:'white'}}>{title}</Text>
        </View>
       
    }

    render() {

        return (
            <LinearGradient
                colors={gradientColors[valueTheme]}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{backgroundColor:bgColor[valueTheme], alignItems:"center"}}>

                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, marginTop: Dimensions.get('window').height * 0.005 }}>Ultime rilevazioni</Text>
                <Text style={{ color: '#fff', marginTop: 5, marginBottom: 5,textAlign:"center" }}>I valori si riferiscono ad una media dei dispositivi del gruppo</Text>

                <CopilotStep
                    text='qui potrai vedere le statistiche medie del gruppo selezionato in real time'
                    order={1}
                    
                    name='first'>
                    <WalkthroughableView style={{ width: Dimensions.get('window').width * 0.9, backgroundColor: containerColor[valueTheme], margin: 10, borderRadius: 15, alignItems: 'center' }}>

                    <View style={{
                        width: Dimensions.get('window').width * 0.8,
                        flexDirection: 'row'
                    }}>
                        <View style={{
                            width: Dimensions.get('window').width * 0.4,
                            alignItems: "center"
                        }}>
                            <Text style={{ color: thirdTextColor[valueTheme], fontWeight: 'bold', margin: 15 }}>Temperatura</Text>
                            <AnimatedCircularProgress
                                size={Dimensions.get('window').width * 0.3}
                                width={7}
                                fill={this.state.fill}
                                        tintColor={buttonColor[valueTheme]}
                                fill={this.state.temperatura / 4 * 10}
                                backgroundColor="#3d5875">

                                {
                                        (fill) => (
                                            <CopilotStep
                                                text='cliccando su un indicatore ti portera` alla pagina per visualizzare le statistiche mensili'
                                                order={ 2}
                                                
                                                name='second'>
                                        <WalkthroughableView>
                                        <TouchableHighlight onPress={() => this.Changepage('Temperatura')} style={{ backgroundColor: this.state.colorT, width: Dimensions.get('window').width * 0.3, height: Dimensions.get('window').width * 0.3, alignItems: 'center', justifyContent: 'center' }} >
                                            <Text>{this.state.temperatura} c{'\u00B0'}</Text>
                                        </TouchableHighlight></WalkthroughableView></CopilotStep>
                                    )
                                }
                            </AnimatedCircularProgress>
                        </View>
                        <View style={{
                            width: Dimensions.get('window').width * 0.4,
                            alignItems: "center"
                        }}>
                                    <Text style={{  color: thirdTextColor[valueTheme], fontWeight: 'bold', margin: 15 }}>Umidita`</Text>
                            <AnimatedCircularProgress
                                size={Dimensions.get('window').width * 0.3}
                                width={7}

                                        tintColor={buttonColor[valueTheme]}
                                fill={this.state.umidita}
                                backgroundColor="#3d5875">

                                {
                                    (fill) => (
                                        <TouchableHighlight onPress={() => this.Changepage('Umidita')} style={{ backgroundColor: this.state.colorU, width: Dimensions.get('window').width * 0.3, height: Dimensions.get('window').width * 0.3, alignItems: 'center', justifyContent: 'center' }} >
                                            <Text>{this.state.umidita} %</Text>
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
                    {this.createCell(2200,2000,'CO2','ppm')}
                    {this.createCell(1500,2000,'PM1','ppm')}
                
                </WalkthroughableView></CopilotStep>
                <View style={{ flexDirection: "row" }}>
                    {this.createCell(1500, 2000, 'PM2', 'ppm')}
                    {this.createCell(1500, 2000, 'PM10', 'ppm')}

                </View>
                <Text>Usage statistics</Text>


                <View style={styles.container}>

                </View>
            </ScrollView>
                </LinearGradient>
        );
    }








    Lchart() {
        return <View> <LineChart
            data={this.state.data}
            width={Dimensions.get("window").width} // from react-native
            height={220}

            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
                backgroundColor: "#1F3B51",
                backgroundGradientFrom: "#1F3B51",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(0, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 16
                },
                propsForDots: {
                    r: "6",
                    strokeWidth: "1",
                    stroke: "#ffa726"
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
    Changepage(name) {
        var id
        console.log(name)
        datadropDown.map((e, i) => {
            console.log(e)
            if (e.value == name) {
                
                id = i
                this.props.navigation.navigate('chart', { id })
            }
        })
        
           
    }
}

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
    value: 'CO2',
}, {
    value: 'PM1',
}, {
    value: 'PM2',
}, {
    value: 'PM10',
}];
export default copilot({
    animated: true, // Can be true or false
    overlay: 'svg', // Can be either view or svg
    androidStatusBarVisible: true
})(chart);
const styles = StyleSheet.create({
    container: {
        
        backgroundColor: '#102027',
        alignItems: 'center',
        
    },
});

/* data: {
          labels: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
          datasets: [
              {
                  data: dataNumber
              },
              {
                  data: [20, 40, 50, 200,40, 50, 200, 40, 50, 200,40, 50],
                 color: (opacity = 1) => 'rgba(58, 143, 255, 1)',

              },
              {
                  data: [300, 600, 800, 1000, 300, 600, 800, 1000, 300, 600, 800, 1000],
                 color: (opacity = 1) => 'rgba(58, 0, 255, 1)',
              },
              {
                 data: [50,100,200,600],
                 color: (opacity = 1) => 'rgba(58, 143, 0, 1)',
              },
              {
                 data: [300,200,10,1000],
                 color: (opacity = 1) => 'rgba(0, 0, 255, 1)',
              },
              {
                 data: [10,100,6000,1000],
                 color: (opacity = 1) => 'rgba(58, 0, 0, 1)',
              },
              {
                 data: [6000,1000,1000,1000],
                 color: (opacity = 1) => 'rgba(0, 143, 0, 1)',
              }
          ]
      }*/