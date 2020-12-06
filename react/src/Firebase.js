import firebase from "firebase"

const firebaseConfig = {
    apiKey: "AIzaSyAOy2M70dxZel62wMfdNNFGvJfqNzuUZiA",
    authDomain: "whatsapp-mern-857d8.firebaseapp.com",
    databaseURL: "https://whatsapp-mern-857d8.firebaseio.com",
    projectId: "whatsapp-mern-857d8",
    storageBucket: "whatsapp-mern-857d8.appspot.com",
    messagingSenderId: "383034447301",
    appId: "1:383034447301:web:f2feab5a608d273a7467ac"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider();

export default auth
export {provider}