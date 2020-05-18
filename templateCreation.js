import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import { Card } from 'react-native-elements'
import { View, Text, Dimensions, StyleSheet, Button, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import prompt from 'react-native-prompt-android';
import RNFetchBlob from 'rn-fetch-blob';
var datas = []
var selection,code
var mode = ['off', 'on', 'sleep', 'turbo', 'low']
//trasformato in json da testare
export default class templateCreation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            days: ['L', 'MA', 'ME', 'G', 'V', 'S', 'D'],
            daysInt: ['Lunedi', 'Martedi', 'Mercoledi', 'Giovedi', 'Venerdi', 'Sabato', 'Domenica'],
            loadingdata: true
        }
        selection= JSON.parse( this.props.navigation.state.params.selection)
        tot=[]

        this.state.days.map((d, i) => { /*console.log(selection[i][0])*/this.dataZipp(selection[i])})
        
        
    }
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'dettagli',
            headerTitleStyle: { color: '#fff' },
            headerStyle: { backgroundColor: '#455a64' },
            headerRight: () => <Icon style={{ color: '#fff', marginRight: 20 }} name={'question-circle'} size={25} onPress={() => { navigation.state.params.StartThing() }} />
        };
    };
    render() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <ScrollView>

                    <Card title='Riepilogo'
                        wrapperStyle={{ width: Dimensions.get('window').width * 0.8 }}
                        containerStyle={{
                            alignSelf: 'center', margin: Dimensions.get('window').width * 0.055, justifyContent: 'center'
                        }}
                    >
                        <View >

                            {!this.state.loadingData ?
                                tot.map((e, i) => <Card title={this.state.daysInt[i]}>
                                    {e.map((elemnt, index) => <Text > {elemnt}</Text>)}
                                </Card>)

                                : <Text />}
                        </View>
                    </Card>
                    <Button title='Crea il template' onPress={() => this.onButtonPress()}></Button>
                </ScrollView>
            </View>
        )
    }


    dataZipp = (data) => {
            temp = data[0]
            inithour = 0
            stringZip = []
            counter = 0   
            data.map((h, index) => {

                hour = index

                if (temp != h || index >= 23) {


                    stringZip[counter] = "Dalle " + inithour + " alle " + hour + " : " + mode[temp]
                    counter++

                    temp = h
                    inithour = hour
                }

            })
            //console.log(this.state.days[i] + i)

            tot.push(stringZip)
       
        console.log(tot)
        this.setState({ loadingdata: false })
        return (<Text>asd</Text>);
    }


    storeData = async (key, value) => {
        try {

            await AsyncStorage.setItem(key, JSON.stringify(value))

        } catch (e) {
            alert(e);

            // saving error
        }
    }
    GetDataStored = async (key, i) => {
        try {
            const value = await AsyncStorage.getItem(key)
            datas[i] = JSON.parse(value)
            if (i == 6) {

                this.dataZipp(datas)
            }
            // value previously stored

        } catch (e) {
            alert('error')
            // error reading value
        }
    }
    onOkPromptPresed = (value) => {
            //AsyncStorage.removeItem('groups');
            return RNFetchBlob.config({
                trusty: true
              }).fetch('GET', 'https://78.46.215.53:3000/home')
                .then((response) =>
                  
                  response.json())
                .then((responseJson) => {
          
                  console.log(responseJson)
                  code = responseJson.csrfToken
                this.addNewTemplate(value);
          
                })
                .catch((error) => {
                  console.log(error);
                });
            
        
    }
    addNewTemplate = (title) => {
  let postData={
      _csrf:code,
      presetname:title,
      schedule:JSON.stringify(selection)
  }
        return RNFetchBlob.config({
          trusty: true
        }).fetch('POST', 'https://78.46.215.53:3000/preset/create',
          {
          'Content-Type': 'application/json' },
           JSON.stringify(postData)
            ).then(response => response.json())
          .then(text => {
            console.log(text)
          }).catch((error)=>console.log(error));
      }
      
    onButtonPress = () => {
        prompt(
            'Enter title',
            'Enter the title of the template',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'OK', onPress: value => this.onOkPromptPresed(value) },
            ],
            {

                cancelable: true,

                placeholder: 'title'
            }
        );
    };

}
var temp
var hour
var inithour
var counter
var stringZip = []
var tot = []
