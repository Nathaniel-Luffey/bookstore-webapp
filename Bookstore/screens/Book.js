import { StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput, Button } from "react-native";
import { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import EntypoIcon from "react-native-vector-icons/Entypo";

function Book({ navigation }) {

  const route = useRoute();
  const { book, email } = route.params || {};
  const [comments, setComments] = useState([]);
  const [draftComment, setDraftComment] = useState("");
  const [nComments, setNComments] = useState(100);
  const [orderValue, setOrderValue] = useState("");

  async function getComments() {
    console.log("Use effect called");
    try {
      const response = await axios.post("http://localhost:3000/getComments", {bookID: book.bookID});
      setComments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  async function voteComment(commentID, value) {
    try {
      await axios.post("http://localhost:3000/voteComment", {commentID, value});
      getComments();
    } catch (error){
      console.log(error);
    }
  };

  async function addCommentButton() {
    try {
      const response = await axios.post("http://localhost:3000/addComment", {bookID: book.bookID, email, draftComment});
      if (response.data.success) {
        getComments();
      }
      else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const emailPressed = (viewingEmail) => {
    navigation.navigate('Profile', {email, viewingEmail});
  }

  const homePressed = () => {
    navigation.navigate('Home', {email});
  }

  async function orderButton() {
    try {
      console.log(orderValue);
      const response = await axios.post("http://localhost:3000/addOrder", {bookID: book.bookID, email, orderValue});
      alert(response.data.message);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.detailContainer}>
        <View style={styles.textDetailContainer}>
          <View style={styles.detailHeader}>
            <Text style={styles.boldHeader}>{book.title}    </Text>
            <TouchableOpacity onPress={() => homePressed()}>
              <EntypoIcon name="home" size={20}/>
            </TouchableOpacity>
            <View style={styles.orderContainer}>
              <Button title="ORDER" onPress={orderButton}/>
              <TextInput style={styles.orderInput} value={String(orderValue)} onChangeText={(value) => setOrderValue(Number(value) || 0)} placeholder="#"/>
            </View>
          </View>
          <View style={styles.spacer}/>
          <Text style={styles.text}>Author: {book.author}</Text>
          <Text style={styles.text}>Publisher: {book.publisher}</Text>
          <Text style={styles.text}>Publish Year: {book.year}</Text>
          <Text style={styles.text}>ISBN: {book.ISBN}</Text>
          <Text style={styles.text}>ISBN 13: {book.ISBN13}</Text>
          <Text style={styles.text}>Language Code: {book.language}</Text>
          <Text style={styles.text}>Text Reviews: {book.textReviewsCount}</Text>
          <Text style={styles.text}>Ratings Count: {book.ratingsCount}</Text>
          <Text style={styles.text}>Average Rating: {book.averageRating}</Text>
        </View>
        <View style={styles.draftCommentContainer}>
          <TextInput style={styles.draftCommentBody} value={draftComment} onChangeText={setDraftComment}/>
          <Button title="Add Comment" onPress={addCommentButton}/>
        </View>
        <Text style={styles.boldHeader}>Comment Section</Text>
        <View style={styles.usefulFilterContainer}>
          <Text style={styles.text}>Only show top </Text>
          <TextInput style={styles.nInput} value={String(nComments)} onChangeText={(value) => setNComments(Number(value) || 0)}/>
          <Text style={styles.text}> useful comments.</Text>
        </View>
        <FlatList
          style={styles.flatList}
          data={comments.sort((a, b) => b.usefulnessScore - a.usefulnessScore).slice(0, nComments)}
          keyExtractor={(item, index) => item.commentID.toString()}
          renderItem={({ item }) => (
            <View style={styles.commentContainer}>
              <View style={styles.topCommentContainer}>
                <TouchableOpacity onPress={() => emailPressed(item.email)}>
                  <Text style={styles.commentHeaderText}>{item.email} -- Usefulness Score: {item.usefulnessScore}</Text>
                </TouchableOpacity>
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
  detailContainer: {
    backgroundColor: '#a8c7f5',
    paddingHorizontal: 40,
    paddingVertical: 25,
    borderRadius: 5,
    marginTop: 20,
  },
  boldHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
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
  commentHeaderText: {
    fontSize: 15,
  },
  bodyText: {
    fontSize: 10,
  },
  flatList: {
    marginTop: 20,
  },
  icon: {
    alignSelf: 'flex-end',
  },
  icons: {
    flexDirection: 'row',
  },
  draftCommentContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  draftCommentBody: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: 'white',
    paddingHorizontal: 5,
    marginRight: 2,
  },
  spacer: {
    height: 10,
  },
  textDetailContainer: {
    alignItems: 'center',
  },
  nInput: {
    backgroundColor: 'white',
    paddingHorizontal: 3,
    borderWidth: 1,
    width: 30,
  },
  usefulFilterContainer: {
    flexDirection: 'row',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderContainer: {
    flexDirection: 'row',
    marginLeft: 20,
  },
  orderInput: {
    backgroundColor: 'white',
    paddingHorizontal: 3,
    borderWidth: 1,
    width: 30,
    marginLeft: 5,
  }
});

export default Book;