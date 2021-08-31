import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TouchableHighlight,
  FlatList
} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/header';
import { TradeSearch } from 'react-native-google-trades';
import { SearchBar, ListItem } from 'react-native-elements';

export default class TradeRequestScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      tradeName: '',
      reasonToRequest: '',
      isTradeRequestActive: '',
      requestedTradeName: '',
      tradeStatus: '',
      requestId: '',
      userDocId: '',
      docId: '',
      imageLink: '',
      dataSource: '',
      showFlatList: false,
    };
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addRequest = async (tradeName, reasonToRequest) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();
    var trades = await TradeSearch.searchTrade(
        TradeName,
        'AIzaSyC3K3XRN7ofF88NySbSAq1-GAAMwWj2Dnk'
      );
    db.collection('requested_trade').add({
      user_id: userId,
      trade_name: tradeName,
      reason_to_request: reasonToRequest,
      request_id: randomRequestId,
      trade_status: 'requested',
      date: firebase.firestore.FieldValue.serverTimestamp(),
      image_link: trades.data[0].volumeInfo.imageLinks.thumbnail,
    });
    db.collection('users')
      .where('email_id', '==', userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection('users').doc(doc.id).update({
            IsTradeRequestActive: true,
          });
        });
      });
    this.setState({
      tradeName: '',
      reasonToRequest: '',
      requestId: randomRequestId,
    });

    return alert('Trade Requested Successfully');
  };

  receivedTrades = (tradeName) => {
    var userId = this.state.userId;
    var requestId = this.state.requestId;
    db.collection('received_trades').add({
      user_id: userId,
      trade_name: tradeName,
      request_id: requestId,
      trade_status: 'received',
    });
  };

  getIsTradeRequestActive = () => {
    db.collection('users')
      .where('email_id', '==', this.state.userId)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            isTradeRequestActive: doc.data().isTradeRequestActive,
            userDocId: doc.id,
          });
        });
      });
  };

  getTradeRequest = () => {
    var tradeRequest = db
      .collection('requested_trade')
      .where('userid', '==', this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var tradeInfo = doc.data();
          if (tradeInfo.trade_status !== 'received') {
            this.setState({
              requestId: tradeInfo.request_id,
              requestedTradeName: tradeInfo.trade_name,
              tradeStatus: tradeInfo.trade_status,
              docId: doc.id,
            });
          }
        });
      });
  };

  sendNotification = () => {
    db.collection('users')
      .where('emailId', '==', this.state.currentUser)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().first_name;
          var lastName = doc.data().last_name;
          db.collection('all_notifications')
            .where('request_id', '==', this.state.requestId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().donor_id;
                var tradeName = doc.data().trade_name;
                db.collection('all_notifications').add({
                  targeted_user_id: donorId,
                  message:
                    name + ' ' + lastName + ' received the trade: ' + tradeName,
                  trade_name: tradeName,
                  notification_status: 'unread',
                });
              });
            });
        });
      });
  };

  componentDidMount() {
    this.getIsTradeRequestActive();
  }

  updateTradeRequest = () => {
    db.collection('requested_trade').doc(this.state.docId).update({
      trade_status: 'received',
    });
    db.collection('users')
      .where('emailId', '==', this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection('users').doc(doc.id).update({
            IsTradeRequestActive: false,
          });
        });
      });
  };

  async getTradeFromApi(tradeName) {
    this.setState({
      tradeName: tradeName,
    });
    if (tradeName.length > 2) {
      var trade = await TradeSearch.searchTrade(
        tradeTrade,
        'AIzaSyC3K3XRN7ofF88NySbSAq1-GAAMwWj2Dnk'
      );
     
      this.setState({
        dataSource: trade.data,
        showFlatList: true,
      });
    }
  }

  renderItem = ({item, key}) => {
    var obj = {
      title: item.volumeInfo.title,
      selfLink: item.selfLink,
      buyLink: item.saleInfo.buyLink,
      imageLink: item.volumeInfo.imageLink,
    };
    return (
      <TouchableHighlight
        style={{
          alignItems: 'center',
          backgroundColor: '#dddddd',
          padding: 10,
          width: '90%',
        }}
        activeOpacity = {0.6}
        underlayColor = "#dddddd"
        onPress = {()=>{
          this.setState({
            tradeName: item.volumeInfo.title,
            showFlatList: false,
          })
        }}
        bottomDivider
        >
        <Text>
          {item.volumeInfo.title}
        </Text>
        </TouchableHighlight>
    );
  };
  render() {
    if (this.state.isTradeRequestActive == true) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View
            style={{
              borderColor: 'orange',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              margin: 10,
            }}>
            <Text> Trade Name</Text>
            <Text>{this.state.requestedTradeName}</Text>
          </View>

          <View
            style={{
              borderColor: 'orange',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              margin: 10,
            }}>
            <Text> Trade Status</Text>
            <Text>{this.state.tradeStatus}</Text>
          </View>

          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: 'orange',
              width: 300,
              backgroundColor: 'orange',
              alignSelf: 'center',
              alignItems: 'center',
              height: 30,
              marginTop: 30,
            }}
            onPress={() => {
              this.sendNotification();
              this.updateTradeRequest();
              this.receivedTrade(this.state.requestedTradeName);
            }}>
            <Text>I received the TRADE</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <MyHeader title="Request Trade" navigation={this.props.navigation} />
          <KeyboardAvoidingView style={styles.keyBoardStyle}>
            <TextInput
              style={[styles.formTextInput,{width:'80%'}]}
              placeholder={'enter trade object name'}
              onChangeText={(text) => {
               this.getTradeFromApi(text)
              }}
              value={this.state.tradeName}
              onClear= {(text)=>{
                this.getTradeFromApi('')
              }}
            />

             {  this.state.showFlatList 
             ?(  <FlatList
                data={this.state.dataSource}
                renderItem={this.renderItem}
                enableEmptySections={true}
                style={{ marginTop: 10 }}
                keyExtractor={(item, index) => index.toString()}
              /> )
              :(
                   <View style={{alignItems:'center'}}>
        <TextInput
          style ={[styles.formTextInput,{height:300,width:'150%'}]}
          multiline
          numberOfLines ={8}
          placeholder={"Why do you want to TRADE"}
          onChangeText ={(text)=>{
              this.setState({
                  reasonToRequest:text
              })
          }}
          value ={this.state.reasonToRequest}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={()=>{ this.addRequest(this.state.tradeName,this.state.reasonToRequest);
          }}
          >
          <Text>Request</Text>
        </TouchableOpacity>
        </View>
              )
             }
               
          </KeyboardAvoidingView>
        </View>
      );
    }
  }
}


const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formTextInput: {
    alignSelf: 'center',
    borderColor: '#ffab91',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: '75%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#ff5722',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 20,
  },
});
