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
import { FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';

const WalkthroughableText = walkthroughable(Text); //Making a WalkthroughableText
const WalkthroughableView = walkthroughable(View); //Making a WalkthroughableText
//const WalkthroughableInput = walkthroughable(Input); //Making a WalkthroughableImage
const WalkthroughableImage = walkthroughable(Image); //Making a WalkthroughableImage
var active='nessuno'
var title, id
var template = []
var texttip=['cliccando qui potrai vedere i dettagli del template','tenendo premuto imposterai il template come attivo']
class groupDetail extends React.Component {
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
        id =1// this.props.navigation.state.params.id
        title ='as'// this.props.navigation.state.params.title
        this.StartThing()
        this.props.navigation.setParams({ StartThing: this.props.start });
        //console.log(this.props.navigation.state.params.StartThing)
        //To start the step by step Walk through
    }
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'asd',//navigation.state.params.title,
            headerTitleStyle: { color: '#fff' },
            headerStyle: { backgroundColor: '#455a64' },
            headerRight: () => <Icon style={{ color: '#fff', marginRight: 20 }} name={'question-circle'} size={25} onPress={() => { navigation.state.params.StartThing() }} />
        };
    };
    render() {
        return (<View style={{ alignItems: 'center', backgroundColor: '#102027', minHeight: Dimensions.get('window').height }}><ScrollView style={{ minHeight: Dimensions.get('window').height}}>
           
            <TouchableHighlight style={{ width: Dimensions.get('window').width * 0.9, height: 100, backgroundColor: '#ffe082', borderRadius: 15, marginTop: 20, }} >
                <CopilotStep
                    text="Qui potrai visualizzare il template attivo "
                    order={1}
                    name="firstUniqueKey">
                    <WalkthroughableView>
                        <Text style={{ textAlign: 'center', color: 'white', fontWeight: "bold", fontSize: 20, borderBottomColor: 'white', borderBottomWidth:1 }}>Template attivo </Text>
                        <Text style={{ textAlign: 'center', color: 'white', fontWeight: "bold", fontSize: 20, margin:10 }}>{active} </Text>
                    </WalkthroughableView>
                </CopilotStep>
            </TouchableHighlight>
            {template.map((e,i)=>
            <View style={{ flexDirection: "column", marginTop: Dimensions.get('window').height * 0.01 }}>
                    <TouchableHighlight onPress={() => this.props.navigation.navigate('Template')} onLongPress={() => this.beActive(e)} style={{ width: Dimensions.get('window').width * 0.9, height: 65, backgroundColor: '#718792', borderRadius: 15, alignContent: "center" }}
                   >
                    <CopilotStep
                            text={texttip[i]}
                            order={i + 2}
                            active={i<2}
                            name={i+'key'}>
                            <WalkthroughableView style={{ alignItem: 'center', width: Dimensions.get('window').width * 0.9, alignContent: "center",justifyItem:'center' }}>
                                <Text style={{textAlign:'center',color:'white',fontWeight:"bold",margin:20}}>{e.title}</Text>
                            </WalkthroughableView>
                    </CopilotStep>
                </TouchableHighlight>
                    
                </View>)}
            <FAB
                style={styles.fab}
                small
                icon="plus"
                onPress={() => this.props.navigation.navigate('caltab')}
            />
          </ScrollView>
        </View>);
    };
    beActive(value) {
        active = value.title
        this.setState({activeT:active})
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
}
export default copilot({
    animated: true, // Can be true or false
    overlay: 'svg', // Can be either view or svg
    androidStatusBarVisible: true
})(groupDetail)
const styles = StyleSheet.create({
    container: {

        backgroundColor: '#102027',
        alignItems: 'center',

    }, fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});