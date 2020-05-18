import * as React from 'react';
import { View, StyleSheet, Dimensions, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
    CheckBox, Button, Ionicons, Image
} from 'react-native-elements'
import { TouchableHighlight } from 'react-native';
import { FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import LinearGradient from 'react-native-linear-gradient';
//daa eliminare
//const WalkthroughableInput = walkthroughable(Input); //Making a WalkthroughableImage
const WalkthroughableImage = walkthroughable(Image); //Making a WalkthroughableImage
var active='nessuno'
var title, id
var days=['Lunedi','Martedi','Mercoledi','Giovedi', 'Venerdi','Sabato','Domenica']
var selection=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
              ]
var texttip=['cliccando qui potrai vedere i dettagli del template','tenendo premuto imposterai il template come attivo']
class template2 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeT:active
        }
    }
    StartThing() {
        console.log('start')
        //this.props.copilotEvents.on('stepChange', this.handleStepChange);
        //setting a function to handle the step change event
       // this.props.start();
    }
    componentDidMount() {
        this.getTemplate()
        id = this.props.navigation.state.params.id
        title = this.props.navigation.state.params.title
        this.StartThing()
        this.props.navigation.setParams({ StartThing: this.props.start });
        //console.log(this.props.navigation.state.params.StartThing)
        //To start the step by step Walk through
    }
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'Dispositivo',
            headerTitleStyle: { fontWeight: "bold", color: '#01379b' },
            headerBackground: (
                <LinearGradient
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    colors={['#039be5', '#4fc3f7',]}
                    style={{ flex: 1, height: 800 }}
                ></LinearGradient>
            ),
            headerRight: () => <Icon style={{ color: '#fff', marginRight: 20 }} name={'question-circle'} size={25} onPress={() => { navigation.state.params.StartThing() }} />
        };
    };
    render() {
        return (<View><Text>asdadasdadsa</Text>
            {days.map((e,i)=><TouchableHighlight style={{margin: 10,height:60, borderRadius:10,backgroundColor:'white',elevation:5,justifyContent:"center",borderWidth:1,borderColor: '#0288d1'}}
        onPress={()=>{ this.props.navigation.navigate('picker',i,selection)}}>
            <Button title='asd'onPress={()=>{ this.props.navigation.navigate('picker')}}></Button>
            <Text style={{margin:15}}>{e}asdfghjkl;'</Text>
            </TouchableHighlight>)}
            </View>);
    };
    
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