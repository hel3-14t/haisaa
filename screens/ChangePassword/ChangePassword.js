// @flow
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ORANGE, WHITE, BLACK } from '../../styles/colors';
import { Button, Toast } from '../../components/atoms';
import { InputComponent } from '../../components/molecules';
import { Auth } from 'aws-amplify';
import { toastTypes } from '../../components/atoms/Toast';
import { passwordConstraints } from '../../utils';


const ResetPassowrdScreen = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassowrd] = useState('');
  const [toast, setToast] = useState({ type: "", message: ""});
  const [isOldPasswordValid, setIsOldPasswordValid] = useState(false)
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false)

  const handleChange = async () => {
    console.log(isOldPasswordValid , isPasswordValid , isConfirmPasswordValid)
    if(isOldPasswordValid && isPasswordValid && isConfirmPasswordValid) {
      try {
        setToast({ type: toastTypes.LOADING, message: "Please wait" })
        const user = await Auth.currentAuthenticatedUser()
        await Auth.changePassword(user, oldPassword, password)
        setToast({ type: toastTypes.SUCCESS, message: "Password changed" })
      } catch (error) {
        setToast({ type: toastTypes.ERROR, message: "Something went wrong" })
        console.log(error);
      }
  } else return;
}

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} style={{backgroundColor: WHITE}}>
      {toast.type !== "" && <Toast type={toast.type} message={toast.message} />}
      <View style={{flex: 1, margin: 20 }}>
        <View style={{flex: 1, justifyContent: 'center' }}>
          <InputComponent
            label="Old Password"
            showPasswordIcon={true}
            updateParentState={setOldPassword}
            setIsValid={setIsOldPasswordValid}
            constraints={passwordConstraints}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <InputComponent
            label="Password"
            showPasswordIcon={true}
            updateParentState={setPassword}
            setIsValid={setIsPasswordValid}
            constraints={passwordConstraints}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <InputComponent
            label="Confirm Password"
            showPasswordIcon={true}
            updateParentState={setConfirmPassowrd}
            setIsValid={setIsConfirmPasswordValid}
            constraints={[...passwordConstraints, { fun: () => password === confirmPassword, message: "Password mismatch" }]}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Button bgColor={ORANGE} textColor={WHITE} onPress={handleChange}>Change</Button>
        </View>
      </View>
    </ScrollView>
  );
}

export default ResetPassowrdScreen;