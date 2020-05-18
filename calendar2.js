import * as React from 'react';
import { View, StyleSheet, Dimensions, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
    CheckBox, Button, Ionicons
} from 'react-native-elements'

import { NavigationEvents } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'

var radio_props = [

    { label: 'on     ', value: 0 },
    { label: 'off    ', value: 1 },
    { label: 'sleep     ', value: 2 },
    { label: 'turbo', value: 3 },
];
var temp;
var data;
var stored;
export default class calendarpage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            
            loadingdata: true
        }

        
        var pageName = this.props.navigation.state.routeName
        this.GetDataStored(pageName)
       // this.storeData(pageName, this.state.checked)
        data = this.state.checked
        
        
    }

 
    __handlechange = (index, value) => {
         data = this.state.checked
        data[index] = value

        this.setState({ checked: data });
       // console.log(this.state.checked)
    }

    render() {

        return (<View style={{ backgroundColor: '#102027'}}>
            <NavigationEvents
            onWillBlur={() => this.handleTabChange()}
        /><ScrollView>
                {this.state.checked.map((d, i) => <View>
                    <View style={{ flexDirection: 'row' }}>
                        {i < 10 ? <Text style={{ color: 'grey', marginLeft: Dimensions.get('window').width * 0.04 }}>0{i}</Text> : <Text style={{ color: 'grey', marginLeft: Dimensions.get('window').width * 0.04 }}>{i}</Text>}
                        <View style={{
                            margin: Dimensions.get('window').width * 0.02,
                            width:Dimensions.get('window').width*0.8,
                            borderBottomColor: 'lightgrey',
                            borderBottomWidth: 1,
                        }} />
                        {i < 10 ? <Text style={{ color: 'grey' }}>0{i}</Text> : <Text style={{ color: 'grey' }}>{i}</Text>}
                    </View>
                <RadioGroup style={{ flexDirection: 'row'  }}
                size={20}
                thickness={2}
                color='#9575b2'
                selectedIndex={this.state.checked[i]}
                onSelect={(index, value) => this.__handlechange(i,index)}
            >
                        <RadioButton
                            textColor='white'
                    style={{ alignItems: 'center' , color:'white',textColor:'white'}}
                    value='on'
                >
                        <Text>on</Text>
                </RadioButton>
                <RadioButton
                    value='off'
                >
                    <Text>off</Text>
                </RadioButton>
                <RadioButton
                    value='sleep'
                    color='red'
                >
                        <Text>sleep</Text>
                </RadioButton>
                <RadioButton
                    value='turbo'
                    color='green'
                >
                        <Text>turbo</Text>
                </RadioButton>

                <RadioButton
                    value='low'
                    color='blue'
                >
                    <Text>Blue Dot</Text>
                </RadioButton>
            </RadioGroup>
        </View>
            )}
                <Button title="sendData"
                    onPress={() => this.OnSend()}
                />
                </ScrollView>
        </View>
        )
    }
    OnSend = () => {
        this.handleTabChange()
        this.props.navigation.navigate('Template')
    }
    handleTabChange = () => {
        var pageName = this.props.navigation.state.routeName
        console.log('daved data for ' + pageName)

        this.storeData(pageName, this.state.checked)

    }

    storeData = async (key, value) => {
        try {
            
            await AsyncStorage.setItem(key, JSON.stringify(value))

        } catch (e) {
           

            // saving error
        }
    }
    GetDataStored =  (key) => {
       
            AsyncStorage.getItem(key, (errs, result) => {
                if (!errs) {
                    if (result !== null) {
                        //this.setState({ checked: result });
                        var str = JSON.parse(result)
                        console.log("rrrrrrrrr" + str)
                        this.setState({ checked: str })

                    }
                }
            })
            
            
            
            // value previously stored

    }

}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: Dimensions.get('window').width/60
    },
});
