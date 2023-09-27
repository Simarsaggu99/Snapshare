import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBVrv_J3mKzxg2t3ojxmKuDVXL35D8XQKk',
  authDomain: 'primetime-admin.firebaseapp.com',
  projectId: 'primetime-admin',
  storageBucket: 'primetime-admin.appspot.com',
  messagingSenderId: '969328081539',
  appId: '1:969328081539:web:2a2a1eeb52efc36eb279b6',
  measurementId: 'G-QF6TFHEVGM',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
