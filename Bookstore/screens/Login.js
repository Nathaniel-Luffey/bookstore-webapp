import { StyleSheet, View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import axios from "axios";

function Login( {navigation} ) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const userTypeID = 2;

  async function submitButton() {
    console.log("Submit button was pressed.")

    try {
      if (isLoginMode) {
        const response = await axios.post("http://localhost:3000/login", {email, password});
        console.log(response.data.success);

        if (response.data.success) {
          alert(response.data.message);
          navigation.navigate('Home', { email });
        }
        else {
          alert(response.data.message);
          setEmail("");
          setPassword("");
          setFirstName("");
          setLastName("");
        }
      }
      else {
        const response = await axios.post("http://localhost:3000/registerUser", {email, firstName, lastName, password, userTypeID});
        console.log(response.data.success);

        if (response.data.success) {
          alert(response.data.message);
          loginRegisterModeSwap();
          setEmail("");
          setPassword("");
          setFirstName("");
          setLastName("");
        }
        else {
          alert(response.data.message);
          setEmail("");
          setPassword("");
          setFirstName("");
          setLastName("");
        }
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  const loginRegisterModeSwap = () => {
    console.log("Login/Register mode switched!");
    setIsLoginMode(!isLoginMode);
  }

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.header}>NATHANIEL'S BOOKSTORE</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputHeader}>{isLoginMode ? "Login" : "Register"}</Text>
        <View style={styles.smallSpacer}/>
        <Text style={styles.text}>Email:</Text>
        <TextInput style={styles.textInput} value={email} onChangeText={setEmail}/>
        <View style={styles.spacer}/>

        {!isLoginMode && (
          <>
            <Text style={styles.text}>First Name:</Text>
            <TextInput style={styles.textInput} value={firstName} onChangeText={setFirstName}/>
            <View style={styles.spacer}/>
            <Text style={styles.text}>Last Name:</Text>
            <TextInput style={styles.textInput} value={lastName} onChangeText={setLastName}/>
            <View style={styles.spacer}/>
          </>
        )}
        <Text style={styles.text}>Password:</Text>
        <TextInput style={styles.textInput} value={password} onChangeText={setPassword} secureTextEntry={true}/>
        <View style={styles.spacer}/>
        <Button title='Submit' onPress={submitButton}/>
        <View style={styles.smallSpacer}/>
        <Text style={styles.subText} onPress={loginRegisterModeSwap}>
          {isLoginMode ? "No account? Register here." : "Already have an account? Login here."}
        </Text>
      </View>
    </View>
  );
};
  
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 10,
    backgroundColor: '#a8c7f5',
    paddingHorizontal: 40,
    paddingVertical: 25,
    borderRadius: 5,
  },
  inputHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  text: {
    fontSize: 15,
  },
  textInput: {
    height: 30,
    width: 250,
    borderWidth: 1,
    backgroundColor: 'white',
    paddingHorizontal: 5,
  },
  header: {
    fontSize: 50,
    position: 'absolute',
    top: 50,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  spacer: {
    height: 20,
  },
  smallSpacer: {
    height: 10,
  },
  subText: {
    fontSize: 10,
    alignSelf: 'center',
    color: '#0019f0',
  }
});

export default Login;