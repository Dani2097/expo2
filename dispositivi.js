import React from 'react';
import { StyleSheet, Dimensions, Text, View, TouchableOpacity, ScrollView, BackHandler, Button, TouchableHighlight, ActivityIndicator } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob'
import AsyncStorage from '@react-native-community/async-storage';
import { Card } from 'react-native-elements'
import { NavigationEvents } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import TopTab from './TopTab';
import { NativeEventEmitter } from 'react-native';
import HttpService from './HttpService';

//fatto in json
var disp = []
var IdPage = 0
var selected = []
var titlePage
const WalkthroughableView = walkthroughable(View);
var template
var httpHandler= new HttpService()
var buttonColor = ['#2C7873', 'blue']
var valueTheme = 0
var allDevice = []
var code, listener = new NativeEventEmitter()
//todo aggiustare cambio multiplo

class dispositivi extends React.Component {
  //costruttore standard
  constructor(props) {
    super(props);
    this.state = {
      tabselected: 0,
      templateselected: 0,
      //serve per far refreshare la pagina al termine del caricamento dei dispositivi
      dispositivi: disp,
      //serve per far refreshare la pagina al termine del caricamento dei template
      isLoading: true,
      selected: [],
    }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  checkBack() {
    if (this.state.selected.length > 0) {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
      //console.log(this.props.navigation.state.params.title)
      this.props.navigation.setParams({

        title: 'Seleziona'

      });
    }
    else {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
      this.props.navigation.setParams({

        title: titlePage

      });
    }
  }
  //per cambiare cosa fa il bottone indietro
  handleBackButtonClick() {
    disp = []
    IdPage = 0
    this.setState({ tabselected: 0 })
    selected.map((e, i) => selected[i] = false)
    this.setState({ selected: [] })
    this.checkBack()
    return true;
  }
  //se premo sul bottone cambia gruppo
  Handler = (value) => {
    this.setState({ selected: [] })
    selected = []
    var idPressed = value
    this.props.navigation.navigate('GroupsMod', { idPressed })
    console.log(value)
    this.blurOperation()
  }
  //quando cambio pagina

  blurOperation = () => {
    listener.emit('InitialTab');
    IdPage = 0
    this.setState({ tabselected: 0 })
    this.tabclicked(0)
    disp = []
    selected = []

    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
    listener.removeAllListeners('asd')
  }
  checkSession() {
    AsyncStorage.getItem('theme').then(data => { data ? valueTheme = JSON.parse(data) : valueTheme = 0 })
    listener.removeAllListeners('changetheme')
    listener.addListener('changetheme', data => {
      AsyncStorage.getItem('theme').then(data => {
        data ? valueTheme = JSON.parse(data) : valueTheme = 0
        this.setState({ darktheme: !!valueTheme })
        console.log(valueTheme)
      })
    })
    this.getUserId()
    this.setState({ isLoading: true })
    this.setState({ tabselected: 0 })

    listener.removeAllListeners('asd')
    event = listener.addListener('asd', (data) => {
      this.tabclicked(data)
    });

    new NativeEventEmitter().emit('InitialTab', 0);
    this.props.navigation.setParams({
      headerRight: <MaterialIcon style={{ marginLeft: 15 }} color="#fff" name={'menu'} size={25} onPress={() => { this.headerRightClick() }} />
    })
    // this.props.navigation.state.params.id
    
    //console.log(groups)
    valueTheme = 0
    this.props.navigation.setParams({ StartThing: this.props.start });
    AsyncStorage.getItem('Session')
      .then((dispositivi) => {
        var t = JSON.parse(dispositivi)
        if (t == true) {
          // console.log(t)
          //this.getDispositivi()
        }
        else this.props.navigation.navigate("LoginPage", false)

      });
  }
  render() {
    return (
      <View style={{ alignItems: 'center', backgroundColor: valueTheme == 0 ? 'white' : '#2d383c', height: Dimensions.get('window').height, width: Dimensions.get('window').width }}>
        <View style={{ width: Dimensions.get('window').width }}>
          <TopTab />
        </View>

        {this.state.isLoading && <ActivityIndicator color={"#000"} />}

        <View style={{ height: !this.state.selected.length > 0 ? Dimensions.get('window').height * 0.76 : Dimensions.get('window').height * 0.71 }}>
          <NavigationEvents
            onWillFocus={() => { this.checkSession()/*2d383c*/ }}
            onDidFocus={() => { this.checkSession() }}
            onDidBlur={() => this.blurOperation()}
            onWillBlur={() => {
              this.blurOperation()
            }} />
          <WalkthroughableView>
            <ScrollView>
              {(!this.state.isLoading && this.state.dispositivi.length == 0) && <Text style={{ color: valueTheme == 0 ? 'black' : 'white', fontWeight: "bold" }} >non hai dispositivi in questo gruppo</Text>}
              {this.state.dispositivi.map((d, i) =>
                <CopilotStep
                  active={i < 1}
                  text="Qui potrai spostare piu dispositivi, tenendo premuto si attivera la modalita selezione multipla "
                  order={i}
                  name={i}>
                  <WalkthroughableView>
                    <TouchableOpacity title={d.descriprion} onLongPress={() => this.getDispSelected(i, d.ID)} onPress={() => this.state.selected.length > 0 ? this.getDispSelected(i, d.ID) : this.props.navigation.navigate('Template2', { ID: d.ID })}>
                      {/*console.log(d)*/}
                      <Card title={d.description + '     ' + d.ID}
                        titleStyle={{ color: valueTheme == 0 ? 'blue' : 'white' }}
                        containerStyle={selected[i] ? { backgroundColor: /*'#ffe082'*/'#2C7873', margin: 10 } : { backgroundColor: valueTheme == 0 ? 'white' : '#718792', margin: 10, borderColor: 'transparent', borderWidth: 1, borderEndColor: valueTheme == 0 ? 'blue' : 'white', borderStartColor: valueTheme == 0 ? 'blue' : 'white', borderTopColor: valueTheme == 0 ? 'blue' : 'white', borderBottomColor: valueTheme == 0 ? 'blue' : 'white' }}
                        // dividerStyle={{ backgroundColor: 'transparent' }}
                        wrapperStyle={{ backgroundColor: valueTheme == 0 ? 'white' : '#718792', width: Dimensions.get("window").width * 0.8 }}>
                        <CopilotStep
                          active={i < 1}
                          text="Questo invece e` il tasto per sopstare un dispositivo singolarmente"
                          order={i + 1}
                          name={i + 1}>
                          <View style={{ flexDirection: "row" }}>
                            <WalkthroughableView style={{}}>
                              <View style={{ backgroundColor: 'green', width: Dimensions.get("window").width / 2.8 }}>
                                <Button disabled={this.state.selected.length > 0} title='cambia gruppo' onPress={() => this.Handler(d.ID)} color={buttonColor[valueTheme]} />
                              </View>
                            </WalkthroughableView>
                            <WalkthroughableView style={{ marginLeft: 30, widht: Dimensions.get('window').width / 2, backgroundColor: 'green' }}>
                              <View style={{ backgroundColor: 'green', width: Dimensions.get("window").width / 2.8 }}>
                                <Button containerStyle={{ width: 100 }} disabled={this.state.selected.length > 0} title=' statistiche' onPress={() => this.statButton(d)} color={buttonColor[valueTheme]} />
                              </View>
                            </WalkthroughableView>
                          </View>
                        </CopilotStep>
                      </Card>
                    </TouchableOpacity>
                  </WalkthroughableView></CopilotStep>
              )
              }
            </ScrollView>
          </WalkthroughableView>
        </View>
        <View style={{ marginBottom: 0, width: Dimensions.get("window").width, }}>
          {template ? <View style={{ flexDirection: "row", width: Dimensions.get('window').width, elevation: 5, backgroundColor: '#021c1e', alignItems: "center" }}>
            <Icon onPress={() => this.changetemplateselected(-1)} color='white' name='chevron-left' style={{ marginLeft: 5, width: Dimensions.get("window").width / 4 }}></Icon>
            <TouchableOpacity color='transparent' style={{ marginBottom: 10, justifyContent: 'center', alignItems: 'center', width: Dimensions.get("window").width / 2 }} onPress={() => this.SetSelectedTemplate()}>
              <Text style={{ color: 'white', marginTop: 8 }}>Template {template[this.state.templateselected].name}</Text>
            </TouchableOpacity>
            <Icon onPress={() => this.changetemplateselected(1)} color='white' name='chevron-right' style={{ textAlign: 'right', alignItems: "flex-end", width: Dimensions.get('window').width / 4.6 }}></Icon>
          </View> : <View />}
          {this.state.selected.length > 0 ? <View style={{ flexDirection: "row" }}>
            <View style={{ backgroundColor: 'green', width: Dimensions.get('window').width / 2 }}><Button onPress={() => this.Handler(this.state.selected)} style={{ width: 500, }} color='blue' title={'cambia il gruppo'} /></View>
            <View style={{ width: Dimensions.get('window').width / 2 }}><Button style={{ width: 500, }} color='red' title={'rimuovi gruppo'} onPress={() => this.rimuoviGruppo(this.state.selected)} /></View>
          </View> : <View />}
        </View>
      </View>

    );
  }
  statButton(d) {
    listener.emit('InitialTab');
    //this.blurOperation()
    this.props.navigation.navigate('StatisticheDispositivo', { ID: d.ID, name: d.description })
  }
  changetemplateselected = (i) => {
    var temp = this.state.templateselected
    temp = temp + i
    if (temp < 0) temp = 0
    if (temp > template.length - 1) temp = template.length - 1

    console.log(template[temp].name)
    this.setState({ templateselected: temp })
  }
  //--------------------------HTTPREQUEST--------------------------------
  settemplate(IDdisp) {
    var selection = template[this.state.templateselected].value
    let postData = {
    
      deviceid: IDdisp,
      schedule: selection,
    }
    httpHandler.PostCode('setSchedule',postData).then((data)=>console.log(data)).catch((error)=>console.log(error))
  }
  getUserId() {
    AsyncStorage.getItem('UserId').then((data) => {
      this.Getdevices(data)
      this.GetScheduling(data)
    }).catch(e => {
      console.log('SESSIONE SCADUTAA')
      this.props.navigation.navigate("LoginPage", false)
    })
  }
  //per prendere i dispositivi selezionati
  getDispSelected(i, id) {
    selected[i] = !selected[i]
    var temp = this.state.selected
    if (selected[i]) {
      temp.push(id)

    }
    if (!selected[i]) {
      const index = temp.indexOf(id);
      if (index > -1) {
        temp.splice(index, 1);

      }
    }
    //  console.log(temp)
    this.setState({ selected: temp })
    //console.log(this.state.selected.length)

    this.checkBack()
  }
  



  //mi ritorna i dispositivi

  getGroupDisp = (disps) => {
    // console.log(disps.length)
    disp = []
    disps.map((e, i) => {


      if (!e.groupID) disps[i].groupID = 0
      // console.log(e)
      //  console.log(e.groupID)
      let groupDisp = e.groupID
      //console.log(groupDisp+' +'+IdPage+disps.length+'perche loggoasdasdasdasdas?')

      if (IdPage == groupDisp) {
        disp.push(e)
        selected.push(false)
        //  console.log('index' + disp.description)
        //console.log('state' + this.state.dispositivi)


      }
      if (i == disps.length - 1) {
        this.setState({ dispositivi: disp })
        // this.props.start()
      }
    })
  }
  tabclicked(i) {

    selected = []
    //console.log(this.state.selected)
    this.setState({ tabselected: i })
    IdPage = i
    disp = []
    // console.log("ma qui ci entro?")
    this.setState({ dispositivi: [] })
    this.setState({ selected: [] })
    try {
      this.getGroupDisp(allDevice)
    } catch (error) {

    }

  }
 
  Getdevices = (userid) => {
    disp = []
    this.setState({ dispositivi: [] })
    this.setState({ isLoading: true })
    this.setState({ selected: [] })
    console.log(userid)
    httpHandler.getRequest('getDevices',userid).then((responseJson)=>{
      //console.log('da dispositivi')
      allDevice = responseJson.data.devices
     // console.log(responseJson.data.groups)
      this.setState({ isLoading: false })
      this.getGroupDisp(allDevice)



    })
    .catch((error) => {
      console.log('vado alla login')
      console.log(error)
    });

  }
  SetSelectedTemplate() {
    this.state.dispositivi.map((e, i) => {
      this.settemplate(e.ID)
    })
  }
 
  
  //getPresetList
  GetScheduling = (id) => {
    httpHandler.getRequest('getPresetList',id).then((responseJson)=>{
      template = responseJson.data
      })
      .catch((error) => {

        console.log(error);
      });

  }
  rimuoviGruppo = (disp) => {
    console.log('l`id e` ' + disp + 'il; gruppo e`')
    let postData = {
     
      devices: disp,
      groupid: 0
    }
      httpHandler.PostCode('changeGroup',postData).then((data)=>console.log(data)).catch((error)=>console.log(error))
  }

}
export default copilot({
  animated: true, // Can be true or false
  overlay: 'svg', // Can be either view or svg
  androidStatusBarVisible: true,
})(dispositivi)


