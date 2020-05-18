//Example to make Step by Step App Introduction in React Native
import React, { Component } from 'react';
//Import React

import {
    StyleSheet,
    Text,
    Image,
    View,
    KeyboardAvoidingView,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    Switch,
} from 'react-native';
import {
    Input, Button
} from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
//Import basic required components
import Icon from 'react-native-vector-icons/FontAwesome';

import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import { AsyncStorage } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';


//cambiato in json da testare
const WalkthroughableText = walkthroughable(Text); //Making a WalkthroughableText
const WalkthroughableView = walkthroughable(View); //Making a WalkthroughableText
const WalkthroughableInput = walkthroughable(Input); //Making a WalkthroughableImage
const WalkthroughableImage = walkthroughable(Image); //Making a WalkthroughableImage
var code;
class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
             secondStepActive: true ,
            password:'',
            username: ''
        }
    }
    //Setting the state if we want to skip second step
   // state = { secondStepActive: true };

    StartThing() {
         console.log('start')
        //this.props.copilotEvents.on('stepChange', this.handleStepChange);
        //setting a function to handle the step change event
        this.props.start();
    }
    handleStepChange = step => {
        //Handler, in case we want to handle the step change
        console.log(`Current step is: ${step.name}`);
    };
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'Login',
            headerTitleStyle: { color: '#fff' },
            headerStyle: { backgroundColor: '#455a64' },
            headerRight:()=> <Icon style={{ color: '#fff', marginLeft: 20 }} name={'question'} size={25} onPress={() => { navigation.state.params.StartThing() }} />
        };
    };
   
    componentDidMount() {
        this.StartThing()
        this.props.navigation.setParams({ StartThing: this.props.start });
        //console.log(this.props.navigation.state.params.StartThing)
        //To start the step by step Walk through
    }

    
    render() {
         return (
            <View  style={styles.container}>
                <KeyboardAvoidingView enabled={true} style={{ width: Dimensions.get('window').width * 0.8, justifyContent: 'center', }} >
                    <NavigationEvents onWillFocus={() => { this.GetData }} />
                    <ScrollView keyboardShouldPersistTaps="always"><CopilotStep
                             text="Logo dell'attivita`"
                             order={1}
                             name="firstUniqueKey">
                        <WalkthroughableImage style={{ width: Dimensions.get('window').width * 0.8, height: Dimensions.get('window').width * 0.8 }} source={require('./logo.png')} />

                     </CopilotStep>
                         <CopilotStep
                             text="Inserisci qui i tuoi dati"
                             order={2}
                             name="secondUniqueKey">
                         <WalkthroughableView>
                             <Input
                            inputStyle={styles.buttonText}
                            textDecorationColor='white'
                            placeholder='Username'
                            placeholderTextColor="#8997a3"
                            autoCompleteType='username'
                            textContentType='username'
                            onChangeText={(value) => { this.setState({ username: value }) }}
                            leftIcon={

                                <Icon style={{ marginRight: 10 }}
                                    name='user'
                                    size={24}
                                    color='white'
                                />
                            }
                             />
                         
                        <Input
                            inputStyle={styles.buttonText}
                            placeholder='Password'
                            placeholderTextColor="#8997a3"
                            secureTextEntry={true}
                            autoCompleteType='password'
                            textContentType='password'
                            onChangeText={(value) => { this.setState({ password: value }) }}
                            leftIcon={

                                <Icon style={{ marginRight: 10 }}
                                    name='lock'
                                    size={24}
                                    color='white'
                                />
                            }
                        /></WalkthroughableView>
                         </CopilotStep>
                         <CopilotStep
                             text="premi qui per inviare i dati"
                             order={3}
                             name="thirdUniqueKey">
                             <WalkthroughableView>
                        <Button
                            title="Login"
                            type="outline"
                            buttonStyle={{
                                width: Dimensions.get('window').width * 0.8,
                                marginTop: Dimensions.get('window').width * 0.04
                            }}
                            onPress={() => {
                                this.Login()
                                AsyncStorage.setItem('Session',JSON.stringify( true))
                            }}
                        /></WalkthroughableView></CopilotStep>
                        <Text style={{ marginTop: 10, color: "white" }}>Non sei registrato? Clicca qui</Text>
                        {!this.state.allowed ? <Text style={{ marginTop: 10, color: "red" }}>Devi aver effettuato il login per visualizzare la pagina</Text> : <View />}
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>


        );
    }
    Login = () => {

        return RNFetchBlob.config({
          trusty: true
        }).fetch('GET', 'https://78.46.215.53:3000/home')
          .then((response) =>
            
            response.json())
          .then((responseJson) => {
    
            console.log(responseJson)
            code = responseJson.csrfToken
            this.LoginData()
            //console.log(cookie)
           // alert(code)
    
          })
          .catch((error) => {
            console.log(error);
          });
      }
    LoginData = () => {
        let postData={
            _csrf:code,
            username:this.state.username,
            password:+this.state.password
        }
        return RNFetchBlob.config({
          trusty: true
        }).fetch('POST', 'https://78.46.215.53:3000/login',
          { 'Content-Type': 'application/json' },
         JSON.stringify(postData)).then(response => response.text())
          .then(text => {
            try {
              const data = JSON.parse(text)
              console.log(data)
                if(data.response=='success')
              this.props.navigation.navigate('Groups')
              //cookie=data.session.cookie
             // session = data.response
             // console.log(cookie)
            } catch (err) {
              alert(err)
            }
          });
      }
}
export default copilot({
    useNativeDriver:true,
    animated: true, // Can be true or false
    overlay: 'svg', // Can be either view or svg
     androidStatusBarVisible: true 
})(App);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1d244f',
        alignItems: 'center',
        paddingTop: 40,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        margin: 20,
    },
    profilePhoto: {
        width: 140,
        height: 140,
        borderRadius: 70,
        marginVertical: 20,
    },
    middleView: {
        flex: 1,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#2980b9',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    activeSwitchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
});
