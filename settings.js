import * as React from 'react';
import { View, StyleSheet, Dimensions, Text, Alert,Switch,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
    CheckBox, Button, Ionicons, Image, Card
} from 'react-native-elements'
import { NavigationEvents } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';
import { TouchableHighlight } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import RadioForm, { RadioButton, RadioButtonLabel, RadioButtonInput } from 'react-native-simple-radio-button';
import LinearGradient from 'react-native-linear-gradient';
import Drawer from 'react-native-drawer'

const WalkthroughableText = walkthroughable(Text); //Making a WalkthroughableText
const WalkthroughableView = walkthroughable(View); //Making a WalkthroughableText
//const WalkthroughableInput = walkthroughable(Input); //Making a WalkthroughableImage
const WalkthroughableImage = walkthroughable(Image); //Making a WalkthroughableImage
var tabColor = ['#021c1e', '#021c1e','#2C7873']
var gradientColors = [['#004445', '#2C7873','#2a7874'], ['#004445', '#2C7873'], ['#2C7873', '#ebcdc2', '#2C7873','#2C7874']]
var bgColor = ['transparent', '#102027', 'transparent']
var containerColor = ['#fff', '#ffe082', '#fff']
var valueTheme=0
var textColor = ['grey', '#fff', 'grey']
var secondaryTextColor = ['black', 'white', 'black']
var thirdTextColor = ['blue', 'white', 'blue']
let radio_props = ['Classico', 'Tema a contrasto elevato']
var _drawer
class settings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: 0,
            theme: 9,
            switch:true,
        }
    }
    setvalue(i) {
        valueTheme = i
        AsyncStorage.setItem('theme',JSON.stringify( valueTheme))
        this.setState({ value: i})
        this.changetheme()
     
    }
    changetheme() {
       
      // console.log(i)
        if (valueTheme == 1) {
         
            this.setState({ theme : '#fff' })
        }
        
        else {
       
            this.setState({ theme:'#000' })

            }
        
    
        console.log(this.state.value+this.state.theme)
    }
    StartThing() {
        this.props.navigation.setParams({ theme: valueTheme })
        this.props.navigation.setParams({ title: 'sett' });
        console.log('start')
        AsyncStorage.getItem('theme').then((v) => {
            valueTheme = JSON.parse(v)
            console.log('valuetheme' + valueTheme)
            this.setState({ value:valueTheme})
            this.changetheme()

        })
     
       // textColor='#000'
        //this.props.copilotEvents.on('stepChange', this.handleStepChange);
        //setting a function to handle the step change event
        //this.props.start();
    }
 
    componentDidMount() {
        this.props.navigation.setParams({ title: 'sett' });
        //id=this.props.navigation.state.params.id
        // title = this.props.navigation.state.params.title
        this.StartThing()
        this.props.navigation.setParams({ StartThing: this.props.start });
       
        console.log(this.props.navigation.state.params)
        //To start the step by step Walk through
    }
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'settings',
            headerTitleStyle: { color: '#fff' },
            headerStyle: { backgroundColor: '#021C1E' },
            headerLeft: () => <Icon style={{ color: '#fff', marginLeft: 20 }} name={'menu'} size={25} onPress={() => { navigation.state.params.StartThing() }} />
        ,
            tabBarOptions: {

                activeTintColor: '#6FB98F',
                inactiveTintColor: '#FFF',
                style: {
                    backgroundColor: tabColor[valueTheme],
                }
            },
            
        }
    };
    render() {
        return (<Drawer
            style={{bacgroundColor:'transparent'}}
            ref={(ref) => _drawer = ref}
            type="overlay"
            content={<ScrollView style={styles.container}>
                <Text style={styles.controlText}>Control Panel</Text>
                <TouchableOpacity style={styles.button}>
                    <Text>Close Drawer</Text>
                </TouchableOpacity>
            </ScrollView>}
            tapToClose={true}
            panOpenMask={0.01}
            openDrawerOffset={0.2} // 20% gap on the right side of drawer
            panCloseMask={0.2}
            closedDrawerOffset={-3}
            styles={drawerStyles}
            side='left'
       captureGestures= { true}
            acceptPan={true}
            tweenHandler={(ratio) => ({
                main: { opacity: (2 - ratio) / 2 }
            })}
        >

        
            
            <LinearGradient
                colors={['#004445', '#2C7873', '#2a7874']}
                style={{ flex: 1 }}
            >
            <NavigationEvents
                onWillFocus={() => this.StartThing()}
                onDidFocus={() => console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiii')}
                onWillBlur={() => this.props.navigation.setParams({theme:valueTheme})}
            />
            <Card containerStyle={{
                
                margin: 0,
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                    backgroundColor: bgColor[valueTheme],
                    borderColor: bgColor[valueTheme],
                }} titleStyle={{ borderBottomColor: secondaryTextColor[valueTheme], fontSize: 20, color: 'white'}} title='Settings'><View style={{

            }}>
                        <View style={{ backgroundColor: containerColor[valueTheme], height: Dimensions.get('window').height / 20, borderTopStartRadius: 10, borderTopEndRadius: 10 }}>
                        <View style={{ borderBottomWidth: 2, margin: 10, borderBottomColor: textColor[valueTheme] }}>
                            <Text style={{ margin: 0, fontWeight: "bold", color: textColor[valueTheme], marginBottom: 6, marginLeft: 40 }}>Account</Text>

                        </View>
                        
                    </View>
                        <View style={{ backgroundColor: containerColor[valueTheme],  }}>
                            <View style={{ flexDirection: "row" }}><Text style={{ margin: 0, fontWeight: "bold", color: thirdTextColor[valueTheme], marginBottom: 6, marginLeft: 10, }}>Username:</Text>
                                <Text style={{ flexDirection: "row-reverse", width: Dimensions.get("window").width * 0.66, fontWeight: "bold", color: secondaryTextColor[valueTheme], marginBottom: 6,textAlign:'right'  }}>Mario Giancola</Text></View>
                        <View style={{ flexDirection: "row" }}>
                                <Text style={{ margin: 0, fontWeight: "bold", color: thirdTextColor[valueTheme], marginBottom: 6, marginLeft: 10 }}>Logout</Text><Icon style={{ width: Dimensions.get("window").width * 0.7, textAlign: "right" }} name="logout" color={secondaryTextColor[valueTheme]} size={30}/></View>
                    </View>
                        <View style={{ backgroundColor: containerColor[valueTheme], height: Dimensions.get('window').height / 20 }}>
                        <View style={{ borderBottomWidth: 2, margin: 10, borderBottomColor: textColor[valueTheme] }}>
                            <Text style={{ margin: 0, fontWeight: "bold", color: textColor[valueTheme], marginBottom: 6, marginLeft: 40 }}>Tema</Text>
                         


                        </View>
                        
                    </View>
                        <View style={{ backgroundColor: containerColor[valueTheme], height:100}}>
                        <View style= {{height:100,marginTop:5}}>
                            <RadioForm
                                formHorizontal={false}
                                animation={true}
                            >
                                {/* To create radio buttons, loop through your array of options */}
                                {
                                    radio_props.map((obj, i) => (
                                        <RadioButton labelHorizontal={true} key={i} >
                                            
                                            <RadioButtonLabel
                                                obj={{ label: obj }}
                                                index={i}
                                                labelHorizontal={true}
                                                onPress={(v, i) => {
                                                    
                                                    this.setvalue(i)
                                                }}
                                                labelStyle={{ marginTop: 5, color: thirdTextColor[valueTheme], fontWeight:'bold',width:Dimensions.get("window").width*0.745 }}
                                                labelWrapStyle={{}}
                                            />
                                            <RadioButtonInput
                                                obj={{ value: i }}
                                                index={i}
                                                isSelected={this.state.value=== i}
                                                onPress={(v, i) => {
                                                    
                                                    this.setvalue(v)
                                                }}
                                                borderWidth={1}
                                                buttonInnerColor={'#e74c3c'}
                                                buttonOuterColor={this.state.value === i ? '#2196f3' : textColor[valueTheme]}
                                                buttonSize={10}
                                                buttonOuterSize={20}
                                                buttonStyle={{}}
                                                buttonWrapStyle={{ marginLeft: 10 }}
                                            />
                                            
                                        </RadioButton>
                                    ))
                                }
                            </RadioForm>
                        </View>
                    </View>
                        <View style={{ backgroundColor: containerColor[valueTheme], height: Dimensions.get('window').height / 20 ,}}>
                            <View style={{ borderBottomWidth: 1, margin: 10, borderBottomColor: textColor[valueTheme] }}>
                                <Text style={{ margin: 0, fontWeight: "bold", color: textColor[valueTheme], marginBottom: 6, marginLeft: 40 }}>Tutorial</Text>

                            </View>

                        </View>
                        <View style={{ backgroundColor: containerColor[valueTheme], borderBottomEndRadius: 10, borderBottomStartRadius: 10 }}>
                            <View style={{ flexDirection: "row", marginTop:10}}><Text style={{ margin: 0, fontWeight: "bold", color: thirdTextColor[valueTheme], marginLeft: 10}}>Start al caricamento della pagina:</Text>
                                <Switch style={{marginLeft:Dimensions.get("window").width*0.1}}
                                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                                    thumbColor={this.state.switch ? thirdTextColor[valueTheme] : "#f4f3f4"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => this.toggleSwitch()}
                                    
                                    value={this.state.switch}></Switch></View>
                            <Button title='press' onPress={() => _drawer.open()} />
                            <Text style={{fontSize:9, margin: 0, fontWeight: "bold", color: thirdTextColor[valueTheme], marginBottom: 6, marginLeft: 10 }}>(lo potrai sempre attivare premendo il tasto '?' in alto nelle pagine)</Text>
                        </View>
                    </View>
                </Card>
             
               

            </LinearGradient>
            <Button title='press' onPress={() => this._drawer.open()} />
          
            </Drawer>);
    };

    toggleSwitch() {
        AsyncStorage.setItem('tutorial',JSON.stringify( !this.state.switch))
        var temp = this.state.switch
        this.setState({ switch:!temp })
    }
}
var isEnabled = true;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'black',
    },
    controlText: {
        color: 'white',
    },
    button: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
    }
})
const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
    main: { paddingLeft: 3 },
}
export default copilot({
    animated: true, // Can be true or false
    overlay: 'svg', // Can be either view or svg
    androidStatusBarVisible: true
})(settings)