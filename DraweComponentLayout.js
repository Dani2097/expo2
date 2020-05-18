import * as React from 'react';
import { StyleSheet, Text, View, Button, Alert, ScrollView, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import prompt from 'react-native-prompt-android';
import AsyncStorage from '@react-native-community/async-storage';
import { NativeEventEmitter } from 'react-native';
import { Switch } from 'react-native-gesture-handler';
//FUSO SEESSIONE LOGOUT E CHART




export default class DrawerComponentLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: 'User',
            tutorial: true,
            darktheme: false,
            counter:2
        }
        //console.log(props)
        AsyncStorage.getItem('theme').then((data) => {
            var value = !!JSON.parse(data)

            this.setState({ darktheme: value })
        })
        AsyncStorage.getItem('fuse').then((data) => {var value 
            data?  value = JSON.parse(data):value=2

            this.setState({ counter: value })
        })
        this.getUserDetail()
    }
    getUserDetail() {
        !this.props.navigation.state.routes[0].params ? user = 'user' : user = this.props.navigation.state.routes[0].params.user
    }
    render() {
        const props = this.props.navigation.state.routes[0].routes[this.props.navigation.state.routes[0].index].routeName;
        if (props === "LoginPage") return <Text color="red">not logged</Text>
        else
            return (<View style={{ borderWidth: 2, minHeight: Dimensions.get("window").height }}>
                <ScrollView contentContainerStyle={{ alignItems: "center" }} style={{ backgroundColor: 'white', borderWidth: 1 }, this.state.darktheme && { backgroundColor: '#2d383c' }} >
                    <StatusBar backgroundColor='#0f52ba'></StatusBar>
                    <Text style={[styles.title, this.state.darktheme && { color: 'rgba(100, 160, 255, 1)', borderColor: 'white' }]}>Navigation Panel</Text>
                    <TouchableOpacity style={props == 'Groups' ? [styles.tabelementview, styles.tabselectedcolor, this.state.darktheme && { color: 'white' }] : [styles.tabelementview, this.state.darktheme && { color: 'white' }]} onPress={() => {
                        this.props.navigation.navigate('Groups', { title: 'Gestione dispositivi', id: 0 })
                    }} >
                        <MaterialIcon name='home' style={props == 'Groups' ? [styles.tabiconview, styles.tabtextselectedcolor] : [styles.tabiconview]} />
                        <Text style={props == 'Groups' ? [styles.text, styles.tabtextselectedcolor, this.state.darktheme && { color: 'white' }] : [styles.text, this.state.darktheme && { color: 'white' }]}> Visualizza statistiche</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={props == 'templ' ? [styles.tabelementview, styles.tabselectedcolor] : [styles.tabelementview]} onPress={() => this.props.navigation.navigate('templ', { title: 'asd' })} >

                        <MaterialIcon name='archive' style={props == 'templ' ? [styles.tabiconview, styles.tabtextselectedcolor] : [styles.tabiconview]} />
                        <Text style={props == 'templ' ? [styles.text, styles.tabtextselectedcolor, this.state.darktheme && { color: 'white' }] : [styles.text, this.state.darktheme && { color: 'white' }]}> Gestione template</Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabelementview} onPress={() => { this.props.navigation.navigate('Home', { title: 'asd' }) }}
                    >

                        <MaterialIcon name='archive' style={styles.tabiconview} />
                        <Text style={{ color: 'black', marginTop: 5, width: Dimensions.get("window").width * 0.5, marginLeft: 50 }}> Gestione Template</Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={props == 'groupHandle' ? [styles.tabelementview, styles.tabselectedcolor, this.state.darktheme && { color: 'white' }] : [styles.tabelementview, this.state.darktheme && { color: 'white' }]} onPress={() => this.props.navigation.navigate('groupHandle', { title: 'asd' })} >

                        <MaterialIcon name='auto-fix' style={props == 'groupHandle' ? [styles.tabiconview, styles.tabtextselectedcolor] : [styles.tabiconview]} />
                        <Text style={props == 'groupHandle' ? [styles.text, styles.tabtextselectedcolor, this.state.darktheme && { color: 'white' }] : [styles.text, this.state.darktheme && { color: 'white' }]}> Gestisci gruppi</Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={props == 'Dispositivi' ? [styles.tabelementview, styles.tabselectedcolor, this.state.darktheme && { color: 'white' }] : [styles.tabelementview, this.state.darktheme && { color: 'white' }]} onPress={() => {
                        this.props.navigation.navigate('Dispositivi', { title: 'Gestione dispositivi', id: 0, groups: ['', ''] })

                    }} >
                        <MaterialIcon name='thermometer' style={props == 'Dispositivi' ? [styles.tabiconview, styles.tabtextselectedcolor] : [styles.tabiconview]} />
                        <Text style={props == 'Dispositivi' ? [styles.text, styles.tabtextselectedcolor, this.state.darktheme && { color: 'white' }] : [styles.text, this.state.darktheme && { color: 'white' }]}> Gestione dispositivi</Text>
                    </TouchableOpacity>
                    <Text style={[styles.title, this.state.darktheme && { color: 'rgba(100, 160, 255, 1)', borderColor: 'white' }]}>Action Panel</Text>
                 
                    <TouchableOpacity style={[styles.tabelementview, { height: 20, marginBottom: 0 }]} onPress={() => {
                        this.props.navigation.navigate('LoginPage')
                    }} >
                        <Switch thumbColor='rgba(100, 160, 255, 1)' value={this.state.tutorial} onValueChange={() => { this.tutorialSwitch() }}></Switch>
                        <Text style={[styles.text, styles.tabtextselectedcolor, this.state.darktheme && { color: 'rgba(100, 160, 255, 1)' }]}> Tutorial</Text>

                    </TouchableOpacity>
                    <Text style={[{ color: 'black', marginTop: 5, width: Dimensions.get("window").width * 0.5, marginLeft: 50, fontSize: 10 }, styles.tabtextselectedcolor, this.state.darktheme && { color: 'rgba(100, 160, 255, 1)' }]}> potrai sempre attivarlo attraverso il tasto ?</Text>
                    <TouchableOpacity onPress={()=>this.logout()} style={{ flexDirection: "row", marginTop: 20,marginBottom:30,width:220 }}>
                        <MaterialIcon style={[styles.tabiconview,{width:50}]} name='logout'></MaterialIcon>
                        <Text style={[styles.text, styles.tabtextselectedcolor, { width: Dimensions.get("window").width * 0.32, marginRight: 20 ,marginLeft:0}, this.state.darktheme && { color: 'rgba(100, 160, 255, 1)' }]}>Effettua la logout</Text>
                    </TouchableOpacity>
                    <Text style={[{ textAlign:"center", color: 'black', marginTop: 5, width: Dimensions.get("window").width * 0.6, marginLeft: 0, }, styles.tabtextselectedcolor, this.state.darktheme && { color: 'rgba(100, 160, 255, 1)' }]}> Fuso orario (GMT)</Text>
                    <View style={{flexDirection:"row",margin:10}}>

                 
                    <MaterialIcon onPress={()=>this.setFuse(-1)} name='minus' size={20} style={[{ textAlign:"center", color: 'black', marginTop: 5,  width:50,marginLeft:20 }, styles.tabtextselectedcolor, this.state.darktheme && { color: 'rgba(100, 160, 255, 1)' }]}> </MaterialIcon>
                <Text style={[{ textAlign:"center", color: 'black', marginTop: 5,  }, styles.tabtextselectedcolor, this.state.darktheme && { color: 'rgba(255, 255, 255, 1)' }]}> {this.state.counter>0&& '+'}{this.state.counter}</Text>
                    <MaterialIcon onPress={()=>this.setFuse(1)} name='plus' size={20} style={[{ textAlign:"center", color: 'black', marginTop: 5,  width:70 }, styles.tabtextselectedcolor, this.state.darktheme && { color: 'rgba(100, 160, 255, 1)' }]}> </MaterialIcon>
                       
                       </View>
                    <View style={{ flexDirection: "row", marginTop: 20 }}>
                        <Text style={[styles.text, styles.tabtextselectedcolor, { width: Dimensions.get("window").width * 0.3, marginRight: 20 }, this.state.darktheme && { color: 'rgba(100, 160, 255, 1)' }]}>Theme:</Text>
                        <TouchableOpacity onPress={() => { this.theme(false) }} style={[{ width: Dimensions.get("window").width * 0.06, height: Dimensions.get("window").width * 0.06, backgroundColor: 'azure', borderWidth: 1, marginRight: 10, marginLeft: 10 }, !this.state.darktheme && { borderColor: 'blue' }]}></TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.theme(true) }} style={[{ width: Dimensions.get("window").width * 0.06, height: Dimensions.get("window").width * 0.06, backgroundColor: '#2d383c', borderWidth: 1 }, this.state.darktheme && { borderColor: 'rgba(100, 160, 255, 1)' }]}></TouchableOpacity>
                    </View>

                </ScrollView></View>
            );
    }
    logout(){
        var theme
        AsyncStorage.getItem('theme').then((d)=>{theme=JSON.parse(d)
        console.log(theme)})
        AsyncStorage.getAllKeys((data,tata)=>{
            console.log(tata)
            AsyncStorage.multiRemove(tata)})
            AsyncStorage.setItem('theme',JSON.stringify(theme))
            AsyncStorage.setItem('Session',JSON.stringify(false)).then(()=> this.props.navigation.navigate('LoginPage'))
            
    }
    setFuse(i){
        var temp=this.state.counter
        console.log(temp)
        if (Math.abs(temp+i)<12){temp+=i}
        AsyncStorage.setItem('fuse',JSON.stringify( temp))
        this.setState({counter:temp})
    }
    tutorialSwitch() {
        var temp = this.state.tutorial
        this.setState({ tutorial: !temp })
    }
    theme(value) {
        console.log(!!+value)
        AsyncStorage.setItem('theme', JSON.stringify(+value))
        this.setState({ darktheme: value })
        new NativeEventEmitter().emit('changetheme')
    }
}
const styles = StyleSheet.create({
    text: { color: 'black', marginTop: 5, width: Dimensions.get("window").width * 0.5, marginLeft: 50, },
    title: {
        width: Dimensions.get("window").width / 1.82,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        margin: 20,
        color: 'rgba(10, 12, 100, 1)',
        borderBottomWidth: 1
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }, tabelementview: {
        borderRadius: 5,
        flexDirection: "row",
        width: Dimensions.get("window").width * 0.65,
        height: Dimensions.get("window").height / 20,
        alignContent: "center",

    },
    tabselectedcolor: {
        backgroundColor: 'rgba(120, 180, 250, 0.5)',

    },
    tabtextselectedcolor: {
        fontWeight: "bold",
        color: "#03256c",
    },
    tabiconview: {
        color: 'rgba(100, 160, 255, 1)',

        fontSize: 25,
        marginLeft: Dimensions.get("window").width * 0.015, marginTop: 4

    }
});