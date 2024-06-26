import React, { useState , useEffect} from 'react';
import { StyleSheet, View, Text, TouchableOpacity,Switch, Modal, TextInput,Image ,TouchableWithoutFeedback, Dimensions ,ActivityIndicator, Alert } from 'react-native';
import MapScreen from './MapScreen';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-paper';
const HomeScreen = ({ navigation }) => {
  const [selectedButton, setSelectedButton] = useState('auto');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [textInputValue1, setTextInputValue1] = useState('');
  const [textInputValue2, setTextInputValue2] = useState('');
  const [username, setUsername] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getUsername = async () => {
        try {
            const userDataString = await AsyncStorage.getItem('userData');
            if (userDataString !== null) {
                const userData = JSON.parse(userDataString);
                setUsername(userData.username);
            } else {
                console.log('No user data found in AsyncStorage');
            }
        } catch (error) {
            console.error('Error getting user data from AsyncStorage in preference screen:', error);
        }
    };

    getUsername();
}, []);
  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleBackdropPress = (event) => {
    const { locationY } = event.nativeEvent;
    const drawerContentHeight = 400; 
    const boundary = Dimensions.get('window').height - drawerContentHeight;
    if (locationY > boundary) {
      closeDrawer();
    }
  };
  const closeDrawerDone = async () => {
    
    setLoading(true);
    
    let fromlatitudeNum, fromlongitudeNum;
    if (useCurrentLocation) {
      const [tolatitude, tolongitude] = textInputValue2.split(',');
      Geolocation.getCurrentPosition(
        async position => {
          fromlatitudeNum = position.coords.latitude;
          fromlongitudeNum = position.coords.longitude;
          const tolatitudeNum = parseFloat(tolatitude.trim());
          const tolongitudeNum = parseFloat(tolongitude.trim());
          try {
            console.log('longitude',fromlongitudeNum);
            console.log('latitude',fromlatitudeNum);
            const tolatitudeNum = parseFloat(tolatitude.trim());
            const tolongitudeNum = parseFloat(tolongitude.trim());
            const response= await axios.post('https://weshare-backend-3.onrender.com/ride-request',{
              email: username,
              fromlatitude: fromlatitudeNum,
              fromlongitude: fromlongitudeNum,
              tolatitude: tolatitudeNum,
              tolongitude: tolongitudeNum
          }
          );
          console.log(response.data); 
          setLoading(false);
          setIsDrawerOpen(false);
          if (response.status === 200 || response.status === 201 ) {
            console.log('navidate to ride screen')
            navigation.navigate('RideMapScreen', {
              fromlatitude: fromlatitudeNum,
              fromlongitude: fromlongitudeNum,
              tolatitude: tolatitudeNum,
              tolongitude: tolongitudeNum,
            });
          }
         
          } catch (error) {
            console.log('Error:', error);
            setLoading(false);
            Alert.alert('Error', 'An error occurred. Please try again later.');
          }
        },
        error => console.error(error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
      
    } else {
      const [fromlatitude, fromlongitude] = textInputValue1.split(',');
      const [tolatitude, tolongitude] = textInputValue2.split(',');
  

      fromlatitudeNum = parseFloat(fromlatitude.trim());
      fromlongitudeNum = parseFloat(fromlongitude.trim());
      const tolatitudeNum = parseFloat(tolatitude.trim());
      const tolongitudeNum = parseFloat(tolongitude.trim());
  

      try {
        const response= await axios.post('https://weshare-backend-3.onrender.com/ride-request',{
          email: username,
          fromlatitude: fromlatitudeNum,
        fromlongitude: fromlongitudeNum,
        tolatitude: tolatitudeNum,
        tolongitude: tolongitudeNum
      }
      );
      console.log("----------------",response.data); 
      setLoading(false);
      setIsDrawerOpen(false);
      if (response.status === 200 || response.status === 201 ) {
        console.log('navidate to ride screen')
        navigation.navigate('RideMapScreen', {
          fromlatitude: fromlatitudeNum,
          fromlongitude: fromlongitudeNum,
          tolatitude: tolatitudeNum,
          tolongitude: tolongitudeNum,
        });
      }
      } catch (error) {
        console.log('Error:', error);
        setLoading(false);
        Alert.alert('Error', 'An error occurred. Please try again later.');
      }
      setTextInputValue1('');
      setTextInputValue2('');
    }
  };
  const preferences =()=>{
    navigation.navigate('PreferenceScreen');
  }
  const handlePress = (button) => {
    setSelectedButton(button);
  };
  const handleInputChange1 = (text) => {
    setTextInputValue1(text);
  };

  const handleInputChange2 = (text) => {
    setTextInputValue2(text);
  };

  return (
    <View style={styles.container}>

      <MapScreen />
      <View style={styles.content}>
        <TouchableOpacity onPress={preferences}>
        <View style={styles.preferences} >
          <Text style={styles.ptext}>Preferences </Text>
        </View>
        </TouchableOpacity>
       
        <View style={styles.pbox}>
          <View style={styles.acbutton}>
            <TouchableOpacity onPress={() => handlePress('auto')}>
              <View style={[styles.abutton, selectedButton === 'auto' ? styles.selectedButtonAuto : styles.unselectedButton]}>
                <Text style={[selectedButton === 'auto' ? styles.tx : styles.unselectedtx]}>Auto</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePress('cab')}>
              <View style={[styles.cbutton, selectedButton === 'cab' ? styles.selectedButtonCab : styles.unselectedButton]}>
                <Text style={[selectedButton === 'cab' ? styles.tx : styles.unselectedtx]}>Cab</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={openDrawer}>
            <View style={styles.question}>
              <Icon name="map-pin" size={23} color="#bd0f35" />
              <Text style={styles.where}>   Where would you like to go?</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>


      <Modal
         animationType="none"
        transparent={true}
        visible={isDrawerOpen}
        onRequestClose={closeDrawer}
      >
        <TouchableWithoutFeedback onPress={(event) => handleBackdropPress(event)}>
          <View style={styles.modalContainer}>
            <View style={styles.drawer}>
              <TouchableOpacity onPress={closeDrawer}>
                <Text>Close</Text>
              </TouchableOpacity>
              <View style={styles.texts}>
              <Image source={require('../asset/icons/i2.png')}style={{height: 30, width: 20, marginRight:20,}} />
                <Text style={styles.textsa} >Select Address</Text>
              </View>
              <View style={styles.blc}>
              <View style={styles.fromvi}>
              <TextInput
                style={[styles.inputF,
                  { 
                    opacity: useCurrentLocation ? 0.5 : 1, // Reduce opacity when live location is enabled
                    textDecorationLine: useCurrentLocation ? 'line-through' : 'none', // Apply strikethrough when live location is enabled
                  }]
            }
                value={textInputValue1}
                onChangeText={handleInputChange1}
                placeholder="From"
                editable={!useCurrentLocation}
              />
              <View style={styles.toggleContainer}>
          <Text>Live Location</Text>
          <Switch
            value={useCurrentLocation}
            onValueChange={(value) => setUseCurrentLocation(value)}
          />
        </View>
              </View>
              <TextInput
                style={styles.input}
                value={textInputValue2}
                onChangeText={handleInputChange2}
                placeholder="To"
              />
              <TouchableOpacity onPress={closeDrawerDone}>
              <View style={styles.q}>
              {loading ? ( // Render loader if loading state is true
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
              <Text style={styles.ptext}>Request Ride</Text>
                    )}
            </View>
              </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  where:{
    color: '#008955',
    fontSize: 15,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    backgroundColor: 'transparent',
    bottom: 10,
  },
  preferences: {
    height: 50,
    width: 170,
    borderRadius: 10,
    position: 'absolute',
    bottom: 270,
    left: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#008955',
  },
  ptext: {
    color: 'white',
    fontSize: 18,
fontWeight: 'bold',
  },
  pbox: {
    height: 160,
    width: 350,
    borderRadius: 10,
    position: 'absolute',
    bottom: 100,
    left: 20,
    display: 'flex',
    alignItems: 'center',
    borderColor: '#008955',
    borderWidth: 1,
    justifyContent:'space-evenly',
    backgroundColor: '#B9E5D1',
  },
  acbutton: {
    display: 'flex',
    flexDirection: 'row',
  },
  abutton: {
    width: 150,
    height: 50,
    color: 'white',
    backgroundColor: '#E2F5ED',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cbutton: {
    width: 150,
    height: 50,
    color: 'white',
    backgroundColor: '#008955',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButtonAuto: {
    backgroundColor: '#008955', 
  },
  selectedButtonCab: {
    backgroundColor: '#008955', 
  },
  unselectedButton: {
    backgroundColor: '#E2F5ED', 
  },
  question:{
    height: 50,
    width: 300,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#E2F5ED',
    borderBlockColor: '#008955',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: 400,
  },
  texts:{
    height: 50,
    borderBottomWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
  },
  textsa:{
    fontSize: 20,
    fontFamily: 'sans-serif',
fontWeight: 'bold',
    color: 'black'
  },
  input:{
    height: 50,
    width: 340,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  q:{
    height: 50,
    width: 340,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#008955',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blc:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
},
  tx:{
    color:'white',
    fontWeight:'bold',  
    fontSize: 15,

},
  unselectedtx:{
    color:'#008955',
    fontWeight:'bold',  
    fontSize: 15,
  }
  ,
  fromvi:{
    display: 'flex',
    flexDirection: 'row',
  },
  inputF:{
    height: 50,
    width: 250,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  toggleContainer:{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default HomeScreen;
