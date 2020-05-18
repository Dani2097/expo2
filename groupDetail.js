import * as React from 'react';
import { View, StyleSheet, Dimensions, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
    CheckBox, Button, Ionicons, Image
} from 'react-native-elements'
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel, RadioGroup } from 'react-native-simple-radio-button';
import { NavigationEvents } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';
import { TouchableHighlight } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import LinearGradient from 'react-native-linear-gradient';

const WalkthroughableText = walkthroughable(Text); //Making a WalkthroughableText
const WalkthroughableView = walkthroughable(View); //Making a WalkthroughableText
//const WalkthroughableInput = walkthroughable(Input); //Making a WalkthroughableImage
const WalkthroughableImage = walkthroughable(Image); //Making a WalkthroughableImage
var title, id
var valueTheme=0
var gradientColors = [['#004445', '#2C7873', '#2a7874'], ['#004445', '#2C7873'], ['#2C7873', '#ebcdc2', '#2C7873', '#2C7874']]
var bgColor = ['transparent', '#102027', 'transparent']
var containerColor = ['#fff', '#ffe082', '#fff']
var textColor = ['grey', '#fff', 'grey']
var secondaryTextColor = ['black', 'white', 'black']
var thirdTextColor = ['blue', 'white', 'blue']
 class groupDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    StartThing() {
        console.log('start')
        //this.props.copilotEvents.on('stepChange', this.handleStepChange);
        //setting a function to handle the step change event
        this.props.start();
     }
     componentDidMount() {
         valueTheme=this.props.navigation.state.params.theme
        id=this.props.navigation.state.params.id
         title = this.props.navigation.state.params.title
         AsyncStorage.getItem('tutorial').then((e) => {
             var tutorial= JSON.parse(e)
             if (tutorial)
                 this.StartThing()
         })
        
        this.props.navigation.setParams({ StartThing: this.props.start });
        //console.log(this.props.navigation.state.params.StartThing)
        //To start the step by step Walk through
    }
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: navigation.state.params.title,
            headerTitleStyle: { color: '#fff' },
            headerStyle: { backgroundColor: '#021c1e' },
            headerRight: () => <Icon style={{ color: '#fff', marginRight: 20 }} name={'question-circle'} size={25} onPress={() => { navigation.state.params.StartThing() }} />
        };
    };
    render() {
        return (<LinearGradient
                colors={gradientColors[valueTheme]}
                style={{ flex: 1 }}
            ><View style={{ alignItems: 'center', backgroundColor: bgColor[valueTheme], height: Dimensions.get('window').height }}>
            
            <TouchableHighlight style={{ width: Dimensions.get('window').width * 0.9, height: 200, backgroundColor: '#ffe082', borderRadius: 15, marginTop: 20, }} onPress={() => this.props.navigation.navigate('Statistics', { title, id,theme:valueTheme })}>
                <CopilotStep
                    text="Qui potrai visualizzare le statistiche relative al gruppo "
                    order={1}
                    name="firstUniqueKey">
                    <WalkthroughableView>

                        <Image borderRadius={10} style={{ alignItems: "center", width: Dimensions.get('window').width * 0.9, height: 200, borderRadius: 15, }} source={require('./stats.jpg')} ><Text style={{ color: 'white', fontSize: 20, fontWeight: "bold" }}>Statistiche</Text></Image>
                    </WalkthroughableView>
                </CopilotStep>
            </TouchableHighlight>

            <View style={{ flexDirection: "row", marginTop: Dimensions.get('window').height * 0.01 }}>
                <TouchableHighlight style={{ width: Dimensions.get('window').width * 0.425, height: 150, backgroundColor: '#718792', marginRight: Dimensions.get('window').width * 0.025, borderRadius: 15, alignContent: "center" }}
                        onPress={() => this.props.navigation.navigate('Dispositivi', { title, id, theme: valueTheme })}>
                    <CopilotStep
                        text="Cliccando qui potrai gestire i dispositivi assegnati al gruppo"
                        order={2}
                        name="secondUniqueKey">
                        <WalkthroughableView style={{ alignItem: 'center', width: Dimensions.get('window').width * 0.425, alignContent: "center" }}>
                            <Icon name='thermometer' size={Dimensions.get('window').width * 0.25} style={{ color: 'lightyellow', alignSelf: "center", marginTop: 10 }} />
                            <Text style={{ textAlign: "center", fontWeight: "bold", color: '#fff', fontSize: 15, marginTop: 10 }}> Gestisci gruppo</Text>
                        </WalkthroughableView>
                    </CopilotStep>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this.props.navigation.navigate('templ', { title, id,theme:valueTheme })} style={{ width: Dimensions.get('window').width * 0.425, height: 150, backgroundColor: '#718792', marginLeft: Dimensions.get('window').width * 0.025, borderRadius: 15 }}>
                    <CopilotStep
                        text="Mentre qui potrai assegnare i template per il gruppo o crearne altri"
                        order={3}
                        name="thirdUniqueKey">
                        <WalkthroughableView style={{ alignItem: 'center', width: Dimensions.get('window').width * 0.425, alignContent: "center" }}>
                            <Icon name='archive' size={Dimensions.get('window').width * 0.25} style={{ color: 'lightyellow', alignSelf: "center", marginTop: 10 }} />
                            <Text style={{ textAlign: "center", fontWeight: "bold", color: '#fff', fontSize: 15, marginTop: 10 }}> Gestisci template</Text>
                        </WalkthroughableView>
                    </CopilotStep>
                </TouchableHighlight>
                </View>
                
            </View>
        </LinearGradient>);
    };
}
export default copilot({
    animated: true, // Can be true or false
    overlay: 'svg', // Can be either view or svg
    androidStatusBarVisible: true
})(groupDetail)