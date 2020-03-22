import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, AsyncStorage } from 'react-native';

import AutoComplete from 'react-native-autocomplete-select';
import Select from 'react-native-simple-select';

const MY_KEY = 'MyTestKey2';

import * as Contacts from 'expo-contacts';
import _ from 'lodash';

export default function App() {
  const [ contact, setContact ] = useState([]);
  const [ P1, setP1 ] = useState("Me");
  const [ P2, setP2 ] = useState("");
  const [ stat, setStat ] = useState("Unknown");
  const [submit, setSubmit] = useState(false);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem(MY_KEY);
      if (value !== null) {
        // We have data!!
        return value;
      }
    } catch (error) {
      // Error retrieving data
      return null;
    }
  };

  const setData = async () => {
    if (submit) {
      try {
        const prevDataStr = await getData();
        const prevData = prevDataStr ? JSON.parse(prevDataStr) : {};
        console.log(prevData);
        prevData[P1]  = prevData[P1] ? _.concat(prevData[P1], P2) : [P2];
        prevData[P2]  = prevData[P2] ? _.concat(prevData[P2], P1) : [P1];

        const _ret = await AsyncStorage.setItem(MY_KEY, JSON.stringify(prevData));

        setSubmit(false);
        console.log('Data Submitted');
      } catch (error) {
        console.log('Heinous Error', error);
      }
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          setContact(data);
        }
      }
    })();
  }, []);

  useEffect(() => {
      setData();
  }, [submit]);


  const contactList = contact.map(x => {return {text: x.name} });
  const statusList = ['Positive', 'Negative', 'Unknown'];

  return (
    <View
      style={{
        flex: 1,
      }}>
      <View
        style={{flexDirection: 'row'}}
      >
        <Text style={{marginTop: 4, flex: 1}}>
          Contact1:
        </Text>
        <AutoComplete
          onSelect={x => setP1(x.text)}
          onChangeText={setP1}
          suggestions={contactList}
          suggestionObjectTextProperty='text'
          value={P1}
          inputStyle="textInput"
          style={{backgroundColor: 'pink', flex: 5}}
        />
      </View>
      <View
        style={{flexDirection: 'row'}}
      >
        <Text style={{marginTop: 4, flex: 1}}>
          Contact2:
        </Text>
        <AutoComplete
          onSelect={x => setP2(x.text)}
          onChangeText={setP2}
          suggestions={contactList}
          suggestionObjectTextProperty='text'
          value={P2}
          inputStyle="textInput"
          style={{backgroundColor: 'pink', flex: 5}}
        />
      </View>
      <View
        style={{flexDirection: 'column', flex:1}}
      >
        <Select
          items={statusList}
          promptText="Select the status of Virus"
          onSelect={setStat}
          style={{flex: 5}}
        />

      </View>

      <View
        style={{flexDirection: 'row', justifyContent: "center"}}
      >
        <Button
              title="Submit"
              onPress={(e) => setSubmit(true)}
        />
      </View>
      <View style={{ flex: 6 }}/>
    </View>
  );
}
