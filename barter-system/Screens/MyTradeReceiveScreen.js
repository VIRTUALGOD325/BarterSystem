import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../components/header.js'
import firebase from 'firebase';
import db from '../config.js'

export default class MyDonationScreen extends Component {
   constructor(){
     super()
     this.state = {
       donorId : firebase.auth().currentUser.email,
       donorName : "",
       allDonations : []
     }
     this.requestRef= null
   }

   static navigationOptions = { header: null };

   getDonorDetails=(donorId)=>{
     db.collection("users").where("email_id","==", donorId).get()
     .then((snapshot)=>{
       snapshot.forEach((doc) => {
         this.setState({
           "donorName" : doc.data().first_name + " " + doc.data().last_name
         })
       });
     })
   }

   getAllDonations =()=>{
     this.requestRef = db.collection("all_donations").where("donor_id" ,'==', this.state.donorId)
     .onSnapshot((snapshot)=>{
       var allDonations = []
       snapshot.docs.map((doc) =>{
         var donation = doc.data()
         donation["doc_id"] = doc.id
         allDonations.push(donation)
       });
       this.setState({
         allDonations : allDonations
       });
     })
   }

   sendTrade=(tradeDetails)=>{
     if(tradeDetails.request_status === "TRADE Sent"){
       var requestStatus = "Donor Interested"
       db.collection("all_donations").doc(tradeDetails.doc_id).update({
         "request_status" : "Donor Interested"
       })
       this.sendNotification(tradeDetails,requestStatus)
     }
     else{
       requestStatus = "TRADE Sent"
       db.collection("all_donations").doc(tradeDetails.doc_id).update({
         "request_status" : "TRADE Sent"
       })
       this.sendNotification(tradeDetails,requestStatus)
     }
   }

   sendNotification=(tradeDetails,requestStatus)=>{
     var requestId = tradeDetails.request_id
     var donorId = tradeDetails.donor_id
     db.collection("all_notifications")
     .where("request_id","==", requestId)
     .where("donor_id","==",donorId)
     .get()
     .then((snapshot)=>{
       snapshot.forEach((doc) => {
         var message = ""
         if(requestStatus === "TRADE Sent"){
           message = this.state.donorName + " sent you TRADE"
         }else{
            message =  this.state.donorName  + " has shown interest in donating the TRADE"
         }
         db.collection("all_notifications").doc(doc.id).update({
           "message": message,
           "notification_status" : "unread",
           "date"                : firebase.firestore.FieldValue.serverTimestamp()
         })
       });
     })
   }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
     <ListItem
       key={i}
       title={item.trade_name}
       subtitle={"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
       leftElement={<Icon name="trade" type="font-awesome" color ='#696969'/>}
       titleStyle={{ color: 'black', fontWeight: 'bold' }}
       rightElement={
           <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor : item.request_status === "TRADE Sent" ? "green" : "#ff5722"
              }
            ]}
            onPress = {()=>{
              this.sendTrade(item)
            }}
           >
             <Text style={{color:'#ffff'}}>{
               item.request_status === "TRADE Sent" ? "TRADE Sent" : "Send TRADE"
             }</Text>
           </TouchableOpacity>
         }
       bottomDivider
     />
   )


   componentDidMount(){
     this.getDonorDetails(this.state.donorId)
     this.getAllDonations()
   }

   componentWillUnmount(){
     this.requestRef();
   }

   render(){
     return(
       <View style={{flex:1}}>
         <MyHeader navigation={this.props.navigation} title="My Transactions"/>
         <View style={{flex:1}}>
           {
             this.state.allDonations.length === 0
             ?(
               <View style={styles.subtitle}>
                 <Text style={{ fontSize: 20}}>List of all TRADES Donations</Text>
               </View>
             )
             :(
               <FlatList
                 keyExtractor={this.keyExtractor}
                 data={this.state.allDonations}
                 renderItem={this.renderItem}
               />
             )
           }
         </View>
       </View>
     )
   }
   }


const styles = StyleSheet.create({
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  },
  subtitle :{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  }
})