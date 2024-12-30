import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { CheckBox } from "react-native-elements";
import axios from "axios";
import { FlatList } from "react-native-web";
import { useRoute } from "@react-navigation/native";

function Home( {navigation} ) {

  const route = useRoute();
  const { email } = route.params || {};

  const [isTitleChecked, setIsTitleChecked] = useState(true);
  const [isAuthorChecked, setIsAuthorChecked] = useState(false);
  const [isPublisherChecked, setIsPublisherChecked] = useState(false);
  const [isLanguageChecked, setIsLanguageChecked] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [isDashboardVisible, setIsDashboardVisible] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState("");
  const [isYearChecked, setIsYearChecked] = useState(true);
  const [isScoreChecked, setIsScoreChecked] = useState(false);
  const [title, setTitle] = useState("");
  const [averageRating, setaverageRating] = useState("");
  const [ISBN, setISBN] = useState("");
  const [ISBN13, setISBN13] = useState("");
  const [languageCode, setlanguageCode] = useState("");
  const [ratingsCount, setRatingsCount] = useState("");
  const [textReviewsCount, setTextReviewsCount] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [publisherName, setPublisherName] = useState("");
  const [bestSeller, setBestSeller] = useState("");
  const [bestSellerCopies, setBestSellerCopies] = useState("");
  const [bestCustomer, setBestCustomer] = useState("");
  const [bestCustomerOrderCount, setBestCustomerOrderCount] = useState("");

  async function searchButton() {
    console.log("Search button was pressed.")
    try {
      if (isTitleChecked) {
        response = await axios.post("http://localhost:3000/searchTitle", {search});
      }
      else if (isAuthorChecked) {
        response = await axios.post("http://localhost:3000/searchAuthor", {search});
      }
      else if (isPublisherChecked) {
        response = await axios.post("http://localhost:3000/searchPublisher", {search});
      }
      else if (isLanguageChecked) {
        response = await axios.post("http://localhost:3000/searchLanguage", {search});
      }

      if (response) {
        let sortedResults = response.data;
        sortedResults = sortedResults.map(item => ({...item, year: new Date(item.publicationDate).getFullYear(),}));
        if (isYearChecked) {
          sortedResults = sortedResults.sort((a, b) => b.year - a.year);
        } else if (isScoreChecked) {
          sortedResults = sortedResults.sort((a, b) => b.averageRating - a.averageRating);
        }
        setResults(sortedResults);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const bookPressed = (book) => {
    navigation.navigate('Book', {book, email});
  };

  async function grantManagerButton() {
    console.log("Grant manager button was pressed.");
    try {
      console.log(enteredEmail);
      const response = await axios.post("http://localhost:3000/giveManager", {enteredEmail});
      if (response.data.success) {
        alert(response.data.message);
      } 
      else {
        alert(response.data.message);
      }
    } catch(error) {
      console.log(error);
    }
  };

  async function addBookButton() {
    try {
      console.log(publisherName);
      const response = await axios.post("http://localhost:3000/addBook", {title, averageRating, ISBN, ISBN13, languageCode, ratingsCount, textReviewsCount, publicationDate, publisherName});
      alert(response.data.message);
      setTitle("");
      setaverageRating("");
      setISBN("");
      setISBN13("");
      setlanguageCode("");
      setRatingsCount("");
      setTextReviewsCount("");
      setPublicationDate("");
      setPublisherName("");
    } catch(error) {
      console.log(error);
    }
  };

  async function getStats() {
    try {
      const response = await axios.post("http://localhost:3000/getStats");
      setBestSeller(response.data.bestSeller);
      setBestSellerCopies(response.data.bestSellerCopies);
      setBestCustomer(response.data.bestCustomer);
      setBestCustomerOrderCount(response.data.bestCustomerOrderCount);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function getDashboardStatus() {
      try {
        const response = await axios.post("http://localhost:3000/getManagerStatus", {email});
        if (response.data.success) {
          setIsDashboardVisible(true);
        } 
        else {
          setIsDashboardVisible(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getDashboardStatus();
    getStats();
  }, [email]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.searchContainerWrapper}>
        <View style={styles.searchContainer}>
          <Text style={styles.boldHeader}>Search Books</Text>
          <View style={styles.filterContainer}>
            <Text style={styles.boldHeader}>Filter By:</Text>
            <CheckBox title="Title" checked={isTitleChecked} onPress={() => {setIsTitleChecked(true); setIsAuthorChecked(false); setIsPublisherChecked(false); setIsLanguageChecked(false);}}/>
            <CheckBox title="Author" checked={isAuthorChecked} onPress={() => {setIsTitleChecked(false); setIsAuthorChecked(true); setIsPublisherChecked(false); setIsLanguageChecked(false);}}/>
            <CheckBox title="Publisher" checked={isPublisherChecked} onPress={() => {setIsTitleChecked(false); setIsAuthorChecked(false); setIsPublisherChecked(true); setIsLanguageChecked(false);}}/>
            <CheckBox title="Language" checked={isLanguageChecked} onPress={() => {setIsTitleChecked(false); setIsAuthorChecked(false); setIsPublisherChecked(false); setIsLanguageChecked(true);}}/>
          </View>
          <View style={styles.sortContainer}>
          <Text style={styles.boldHeader}>Sort By:</Text>
            <CheckBox title="Year" checked={isYearChecked} onPress={() => {setIsYearChecked(true); setIsScoreChecked(false);}}/>
            <CheckBox title="Score" checked={isScoreChecked} onPress={() => {setIsYearChecked(false); setIsScoreChecked(true);}}/>
          </View>
          <View style={styles.searchBarContainer}>
            <TextInput style={styles.textInput} value={search} onChangeText={setSearch}/>
            <Button title="Search" onPress={searchButton}/>
          </View>
        </View>
      </View>
      {isDashboardVisible && (
        <View style={styles.dashboardAbsoluteContainer}>
          <View style={styles.dashboardContainer}>
            <Text style={styles.boldHeader}>Manager Dashboard</Text>
            <View style={styles.smallSpacer}/>
            <Text style={styles.text}>Logged in as: {email}</Text>
            <View style={styles.spacer}/>
            <View style={styles.grantEmailContainer}>
              <Text style={styles.text}>Enter email:</Text>
              <TextInput style={styles.textEmailInput} value={enteredEmail} onChangeText={setEnteredEmail}/>
              <Button title="Grant Manager" onPress={grantManagerButton}/>
            </View>
            <View style={styles.linedSpacer}/>
            <Text style={styles.textBookAdd}>Title:</Text>
            <TextInput style={styles.textInputBookAdd} value={title} onChangeText={setTitle}/>
            <View style={styles.spacerBookAdd}/>
            <Text style={styles.textBookAdd}>Average Rating:</Text>
            <TextInput style={styles.textInputBookAdd} value={averageRating} onChangeText={setaverageRating}/>
            <View style={styles.spacerBookAdd}/>
            <Text style={styles.textBookAdd}>ISBN:</Text>
            <TextInput style={styles.textInputBookAdd} value={ISBN} onChangeText={setISBN}/>
            <View style={styles.spacerBookAdd}/>
            <Text style={styles.textBookAdd}>ISBN 13:</Text>
            <TextInput style={styles.textInputBookAdd} value={ISBN13} onChangeText={setISBN13}/>
            <View style={styles.spacerBookAdd}/>
            <Text style={styles.textBookAdd}>Language Code:</Text>
            <TextInput style={styles.textInputBookAdd} value={languageCode} onChangeText={setlanguageCode}/>
            <View style={styles.spacerBookAdd}/>
            <Text style={styles.textBookAdd}>Ratings Count:</Text>
            <TextInput style={styles.textInputBookAdd} value={String(ratingsCount)} onChangeText={(value) => setRatingsCount(Number(value) || 0)}/>
            <View style={styles.spacerBookAdd}/>
            <Text style={styles.textBookAdd}>Text Reviews Count:</Text>
            <TextInput style={styles.textInputBookAdd} value={String(textReviewsCount)} onChangeText={(value) => setTextReviewsCount(Number(value) || 0)}/>
            <View style={styles.spacerBookAdd}/>
            <Text style={styles.textBookAdd}>Publication Date:</Text>
            <TextInput style={styles.textInputBookAdd} value={publicationDate} onChangeText={setPublicationDate} placeholder="YYYY-MM-DD"/>
            <View style={styles.spacerBookAdd}/>
            <Text style={styles.textBookAdd}>Publisher Name:</Text>
            <TextInput style={styles.textInputBookAdd} value={publisherName} onChangeText={setPublisherName}/>
            <View style={styles.spacerBookAdd}/>
            <Button title="Add Book" onPress={addBookButton}/>
            <View style={styles.linedSpacer}/>
            <Text style={styles.boldHeader}>Stats</Text>
            <View style={styles.statContainer}>
              <Text style={styles.textBookAdd}>Best Seller: {bestSeller} {bestSellerCopies} copies sold!</Text>
              <Text style={styles.textBookAdd}>#1 Customer: {bestCustomer} {bestCustomerOrderCount} books purchased!</Text>
            </View>
          </View>
        </View>
      )}
      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => bookPressed(item)}>
            <View style={styles.listItemContainer}>
              <Text style={styles.listText}>{item.title}</Text>
              <View style={styles.subListItemContainer}>
                <Text style={styles.subListTextBold}>Author: </Text>
                <Text style={styles.subListText}>{item.author}</Text>
                <Text style={styles.subListTextBold}> Publisher: </Text>
                <Text style={styles.subListText}>{item.publisher}</Text>
                <Text style={styles.subListTextBold}> Language: </Text>
                <Text style={styles.subListText}>{item.language}</Text>
                <Text style={styles.subListTextBold}> Year: </Text>
                <Text style={styles.subListText}>{item.year}</Text>
                <Text style={styles.subListTextBold}> Rating: </Text>
                <Text style={styles.subListText}>{item.averageRating}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
  
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  searchContainerWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchContainer: {
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
  filterContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 5,
  },
  searchBarContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: 'white',
    paddingHorizontal: 5,
    marginRight: 20,
  },
  listItemContainer: {
    padding: 10,
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 1,
  },
  listText: {
    fontSize: 16,
  },
  subListText: {
    fontSize: 10,
  },
  subListItemContainer: {
    flexDirection: 'row',
  },
  dashboardAbsoluteContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  dashboardContainer: {
    backgroundColor: '#a8c7f5',
    paddingHorizontal: 40,
    paddingVertical: 25,
    borderRadius: 5,
    alignItems: 'center'
  },
  grantEmailContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
  },
  spacer: {
    height: 20,
  },
  textEmailInput: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: 'white',
    paddingHorizontal: 5,
    marginRight: 20,
    marginLeft: 10,
    height: '100%',
  },
  smallSpacer: {
    height: 10,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subListTextBold: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  linedSpacer: {
    marginVertical: 20,
    borderBottomWidth: 2,
    borderColor: 'black',
    width: '100%',
  },
  textBookAdd: {
    fontSize: 15,
  },
  textInputBookAdd: {
    height: 30,
    width: 250,
    borderWidth: 1,
    backgroundColor: 'white',
    paddingHorizontal: 5,
  },
  spacerBookAdd: {
    height: 20,
  },
  statContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default Home;