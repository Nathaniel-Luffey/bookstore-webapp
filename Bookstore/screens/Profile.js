import { StyleSheet, View, Text, TouchableOpacity, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { useState, useEffect } from "react";
import axios from "axios";
import { CheckBox } from "react-native-elements";

function Profile({ navigation }) {

  const route = useRoute();
  const { email, viewingEmail } = route.params || {};

  const [userDetails, setUserDetails] = useState([]);
  const [comments, setComments] = useState([]);
  const [isTrustedChecked, setIsTrustedChecked] = useState(false);
  const [totalTrusters, setTotalTrusters] = useState();

  const homePressed = () => {
    navigation.navigate('Home', {email});
  }

  async function getUserDetails() {
    try {
      const response = await axios.post("http://localhost:3000/getUserDetails", {viewingEmail});
      setUserDetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  async function getComments() {
    console.log("Use effect called");
    try {
      const response = await axios.post("http://localhost:3000/getProfileComments", {viewingEmail});
      setComments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  async function voteComment(commentID, value) {
    try {
      await axios.post("http://localhost:3000/voteComment", {commentID, value});
      getComments();
    } catch (error){
      console.log(error);
    }
  };

  async function trustCheck() {
    try {
      const response = await axios.post("http://localhost:3000/trustCheck", {email, viewingEmail});
      setIsTrustedChecked(response.data.success);
      setTotalTrusters(response.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  async function changeTrust() {
    try {
      const response = await axios.post("http://localhost:3000/changeTrust", {email, viewingEmail});
      setIsTrustedChecked(response.data.checked);
      trustCheck();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserDetails();
    getComments();
    trustCheck();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.profileContainer}>
        <View style={styles.topRowContainer}>
          <View style={styles.profileDetailsContainer}>
            <View style={styles.profileHeader}>
              <Text style={styles.boldHeader}>{viewingEmail}    </Text>
              <TouchableOpacity onPress={() => homePressed()}>
                <EntypoIcon name="home" size={20}/>
              </TouchableOpacity>
            </View>
            <Text style={styles.text}>First Name: {userDetails.firstName}</Text>
            <Text style={styles.text}>Last Name: {userDetails.lastName}</Text>
            <Text style={styles.text}>Trusted Count: {totalTrusters}</Text>
          </View>
          <CheckBox title="Trusted?" checked={isTrustedChecked} onPress={changeTrust}/>
        </View>
        <Text style={styles.commentHeaderTextBold}>{viewingEmail}'s comments:</Text>
        <FlatList
          style={styles.flatList}
          data={comments}
          keyExtractor={(item, index) => item.commentID.toString()}
          renderItem={({ item }) => (
            <View style={styles.commentContainer}>
              <View style={styles.topCommentContainer}>
                  <Text style={styles.commentHeaderText}>{item.title} -- Usefulness Score: {item.usefulnessScore}</Text>
                <View style={styles.icons}>
                  <TouchableOpacity onPress={() => voteComment(item.commentID, 1)}>
                    <EntypoIcon style={styles.icon} name='thumbs-up' size={20}/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => voteComment(item.commentID, -1)}>
                    <EntypoIcon style={styles.icon} name='thumbs-down' size={20}/>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.bodyText}>{item.body}</Text>
            </View>
          )}
        />
      </View>
    </View>
)};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    backgroundColor: '#a8c7f5',
    paddingHorizontal: 40,
    paddingVertical: 25,
    borderRadius: 5,
    marginTop: 20,
  },
  text: {
    fontSize: 16,
  },
  boldHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  topCommentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    alignSelf: 'flex-end',
  },
  icons: {
    flexDirection: 'row',
    marginLeft: 5,
  },
  commentHeaderText: {
    fontSize: 15,
  },
  bodyText: {
    fontSize: 10,
  },
  commentHeaderTextBold: {
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingVertical: 5,
  },
  topRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileDetailsContainer: {
    flexDirection: 'column',
  }
});

export default Profile;