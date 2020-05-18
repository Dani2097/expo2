
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    NativeEventEmitter,
    NativeModules,
    Platform,
    PermissionsAndroid,
    ScrollView,
    AppState,
    FlatList,
    Dimensions,
    Button,
    SafeAreaView
} from 'react-native';
const DeviceWidth=Dimensions.get('window').width
import BleManager from 'react-native-ble-manager';
import { stringToBytes } from 'convert-string';
import AsyncStorage from '@react-native-community/async-storage';


const window = Dimensions.get('window');

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
var TEMP
var temp2 = " "
var led = stringToBytes("led-off")
export default class Ble extends Component {
    constructor() {
        super()

        this.state = {
            temp: [],
            itemConnected: '',
            scanning: false,
            peripherals: new Map(),
            appState: ''
        }
        this.RetriveId('peripheral')
        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        this.handleStopScan = this.handleStopScan.bind(this);
        this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
        this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
        this.handleAppStateChange = this.handleAppStateChange.bind(this);
    }

    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);

        BleManager.start({ showAlert: false });

        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan);
        this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral);
        this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic);



        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                    console.log("Permission is OK");
                } else {
                    PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                        if (result) {
                            console.log("User accept");
                        } else {
                            console.log("User refuse");
                        }
                    });
                }
            });
        }

    }
    sendSignal(Signal, peripheral) {
        var signal = stringToBytes(Signal)
        if(!this.state.itemConnected)
           this.RetriveId('peripheral')
        
        var service = '0000FFE0-0000-1000-8000-00805F9B34FB';
        var Characteristic = '0000FFE1-0000-1000-8000-00805F9B34FB';
        setTimeout(() => {
            BleManager.startNotification(this.state.itemConnected, service, Characteristic).then(() => {
                console.log('Started notification on ' + this.state.itemConnected);
                setTimeout(() => {
                    BleManager.write(this.state.itemConnected, service, Characteristic, signal).then((ads) => {
                        console.log(ads)

                    }).then(data => console.log(data));

                }, 500);
            }).catch((error) => {
                console.log('Notification error', error);
            });
        }, 200);
    }
    handleAppStateChange(nextAppState) {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!')
            BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
                console.log('Connected peripherals: ' + peripheralsArray.length);
            });
        }
        this.setState({ appState: nextAppState });
    }

    componentWillUnmount() {
        this.handlerDiscover.remove();
        this.handlerStop.remove();
        this.handlerDisconnect.remove();
        this.handlerUpdate.remove();
    }

    handleDisconnectedPeripheral(data) {
        let peripherals = this.state.peripherals;
        let peripheral = peripherals.get(data.peripheral);
        if (peripheral) {
            peripheral.connected = false;
            peripherals.set(peripheral.id, peripheral);
            this.setState({ peripherals });
        }
        console.log('Disconnected from ' + data.peripheral);
    }
    bin2string(array) {
        var result = "";
        for (var i = 0; i < array.length; ++i) {
            result += (String.fromCharCode(array[i]));

        }
        return result;
    }
    handleUpdateValueForCharacteristic(data) {
        TEMP = this.bin2string(data.value)
        temp2 += TEMP
        this.setState({ temp: temp2 })
        console.log(TEMP)

        console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
    }

    handleStopScan() {
        console.log('Scan is stopped');
        this.setState({ scanning: false });
    }

    startScan() {
        if (!this.state.scanning) {
            //this.setState({peripherals: new Map()});
            BleManager.scan([], 3, true).then((results) => {
                console.log('Scanning...');
                this.setState({ scanning: true });
            });
        }
    }

    retrieveConnected() {
        BleManager.getConnectedPeripherals([]).then((results) => {
            if (results.length == 0) {
                console.log('No connected peripherals')
            }
            console.log(results);
            var peripherals = this.state.peripherals;
            for (var i = 0; i < results.length; i++) {
                var peripheral = results[i];
                peripheral.connected = true;
                peripherals.set(peripheral.id, peripheral);
                this.setState({ peripherals });
            }
        });
    }

    handleDiscoverPeripheral(peripheral) {
        var peripherals = this.state.peripherals;
        //console.log('Got ble peripheral', peripheral);
        if (!peripheral.name) {
            peripheral.name = 'NO NAME';
        }
        peripherals.set(peripheral.id, peripheral);
        this.setState({ peripherals });
    }
    RetriveId = async (key) => {
        try {
          const value = await AsyncStorage.getItem(key)
          if (value !== null) {
            this.setState({itemConnected:value})
            // value previously stored
          }
        } catch (e) {
          alert('error')
          // error reading value
        }
      }
    
    storeData = async (value) => {
        try {
    
          await AsyncStorage.setItem('peripherals', value)
        } catch (e) {
          // saving error
        }
      }
    renderItem(item) {
        const color = item.connected ? 'green' : '#fff';
        return (
            <TouchableHighlight onPress={() => this.test(item)}>
                <View style={[styles.row, { backgroundColor: color }]}>
                    <Text style={{ fontSize: 12, textAlign: 'center', color: '#333333', padding: 10 }}>{item.name}</Text>
                    <Text style={{ fontSize: 10, textAlign: 'center', color: '#333333', padding: 2 }}>RSSI: {item.rssi}</Text>
                    <Text style={{ fontSize: 8, textAlign: 'center', color: '#333333', padding: 2, paddingBottom: 20 }}>{item.id}</Text>
                </View>
            </TouchableHighlight>
        );
    }


    render() {
       

        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    

                    <ScrollView style={styles.scroll}>
                        
                       <View style={styles.firstrowStyle}>
                        <Button style title={"particles"} onPress={() => this.sendSignal("particles", this.state.itemConnected)} />
                        <Button style title={"led-on"} onPress={() => this.sendSignal("led-on", this.state.itemConnected)} />
                        <Button style title={"led-off"} onPress={() => this.sendSignal("led-off", this.state.itemConnected)} />
                       </View>
                      
                        <Text>{this.state.temp}</Text>
                    </ScrollView>

                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    firstrowStyle: { width: DeviceWidth, height: DeviceWidth * 0.08, marginLeft: 5, marginBottom: 1, backgroundColor: 'skyblue', textAlign: 'center', alignItems: 'center', flexDirection: 'row' },
    containerStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap'
    },
    numberStyle: {
        flex: 1,
        flexDirection: 'column'
    },
    textContainerStyle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        width: window.width,
        height: window.height
    },
    scroll: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        margin: 10,
    },
    row: {
        margin: 10
    },
});
let datadropDown = [{
    value: '0',
}, {
    value: '50',
}, {
    value: '100',
}, {
    value: '150',
}, {
    value: '200',
}, {
    value: '255',
}];



