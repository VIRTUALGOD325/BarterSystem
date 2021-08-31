import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Header, Card, Icon } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';

export default class ReceiverDetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      userName: '',
      receiverId: this.props.navigation.getParam('details')['user_id'],
      requestId: this.props.navigation.getParam('details')['request_id'],
      tradeName: this.props.navigation.getParam('details')['trade_name'],
      receiverName: '',
      receiverContact: '',
      receiverAddress: '',
      receiverRequestDocId: '',
      reason_for_requesting: this.props.navigation.getParam('details')[
        'reason_to_request'
      ],
    };
  }
  getReceiverDetails = () => {
    db.collection('users')
      .where('email_id', '==', this.state.receiverId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            receiverName: doc.data().first_name,
            receiverContact: doc.data().contact,
            receiverAddress: doc.data().address,
          });
        });
      });

    db.collection('requested_trades')
      .where('request_id', '==', this.state.requestId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            receiverRequestDocId: doc.id,
          });
        });
      });
  };

  getUserDetails = (userId) => {
    db.collection('users')
      .where('email_id', '==', userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            userName: doc.data().first_name + ' ' + doc.data().last_name,
          });
        });
      });
  };

  updateTradeStatus = () => {
    db.collection('all_donations').add({
      trade_name: this.state.tradeName,
      request_id: this.state.requestId,
      requested_by: this.state.receiverName,
      donor_id: this.state.userId,
      request_status: 'Donor Interested',
    });
  };

  addNotification = () => {
    var message =
      this.state.userName + 'has shown an interest in donating the object';

    db.collection('all_notifications').add({
      targeted_user_id: this.state.receiverId,
      donor_id: this.state.userId,
      request_id: this.state.requestId,
      trade_name: this.state.tradeName,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      notification_status: 'unread',
      message: message,
    });
  };

  componentDidMount() {
    this.getReceiverDetails();
    this.getUserDetails(this.state.userId);
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.1 }}>
          <Header
            leftComponent={
              <Icon
                name="arrow-left"
                type="feather"
                color="#696969"
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              />
            }
            centerComponent={{
              text: 'Donate Object',
              style: { color: '#90a5a9' },
              fontSize: 20,
              fontWeight: 'bold',
            }}
            backgroundColor="#eaf8fe"
          />
        </View>
        <View style={{ flex: 0.3 }}>
          <Card title={'Trade Information'} titleStyle={{ fontSize: 20 }}>
            <Card>
              <Text style={{ fontWeight: 'bold' }}>
                Name: {this.state.tradeName}
              </Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: 'bold' }}>
                Reason: {this.state.reason_for_requesting}
              </Text>
            </Card>
          </Card>
        </View>

        <View style={{ flex: 0.3 }}>
          <Card title={'Receiver Information'} titleStyle={{ fontSize: 20 }}>
            <Card>
              <Text style={{ fontWeight: 'bold' }}>
                Name: {this.state.receiverName}
              </Text>
            </Card>

            <Card>
              <Text style={{ fontWeight: 'bold' }}>
                Contact: {this.state.receiverContact}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: 'bold' }}>
                Address: {this.state.receiverAddress}
              </Text>
            </Card>
          </Card>
        </View>
         
         <View style = {styles.buttonContainer}>
          {
            this.state.receiverId != this.state.userId
            ?(
              <TouchableOpacity style = {styles.button} onPress = {()=>{
                this.updateTradeStatus();
                this.addNotification();
                this.props.navigation.navigate("MyDonations")

              }}>
              <Text>
              I want to Donate
              </Text>
              </TouchableOpacity>
            ): null

          }
         </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'orange',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 16,
  },
});
