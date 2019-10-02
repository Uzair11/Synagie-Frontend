import * as firebase from 'firebase/app'
import 'firebase/auth'

export default async ({ app }) => {
  if (!(process as any).server && !(window as any).fire) {
    const firebaseConfig = {
      apiKey: 'AIzaSyBGwaBhJMgGOSKa-H-H9bZnJCYUwb9X7hQ',
      authDomain: 'mamanet-pregnancy-my.firebaseapp.com',
      databaseURL: 'https://mamanet-pregnancy-my.firebaseio.com',
      projectId: 'mamanet-pregnancy-my',
      storageBucket: 'mamanet-pregnancy-my.appspot.com',
      messagingSenderId: '669257493355',
      appId: '1:669257493355:web:13fde59f3eba3197'
    }

    firebase.initializeApp(firebaseConfig)
  }
}
