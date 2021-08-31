import firebase from "firebase"

var firebaseConfig = {
    apiKey: "AIzaSyBBbEiTB3NxLs-a4AuPBMjw3teUIpNHr98",
    authDomain: "bartersystem-4c6c5.firebaseapp.com",
    projectId: "bartersystem-4c6c5",
    storageBucket: "bartersystem-4c6c5.appspot.com",
    messagingSenderId: "474350415809",
    appId: "1:474350415809:web:0a474f68f323aec4938940"
  };

if(!firebase.apps.length) { 
    firebase.initializeApp(firebaseConfig) 
}
export default firebase.firestore()
  