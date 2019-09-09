import firebase from 'react-native-firebase';

export const addUserDetailsToDb = async (uid,mobileNumber, email, name, gender, dob) => {
  try {
    await firebase.database().ref(`/users/${uid}`).set({ mobileNumber,email, name, gender, dob });
    await firebase.database().ref(`/mapping/+91${mobileNumber}`).set({ email, name, gender, dob });
  } catch (error) {
    console.log(error);
    Alert.alert(error.toString());
  }
}

export const getUser = async (uid) => {
  try {
    return await firebase.database().ref(`/users/${uid}`).once('value');
  } catch (error) {
    console.log(error);
    Alert.alert(error.toString());
  }
}

export const updateHelpRequest = (db,key,value,userDb,uid) => {
  db.update({ [key]: value });
  if(userDb){
    userDb.push(uid).catch(err => {
      console.log(err);
    });
  }
};

export const notifyUser = (uid,data) => {
  firebase.database().ref('users').child(uid).child('notifications').push(data).catch(err => {
    console.log(err);
  });
}
