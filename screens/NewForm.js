import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';

import AutoComplete from 'react-native-autocomplete-select';
import Select from 'react-native-simple-select';

import * as Contacts from 'expo-contacts';
export default function App() {
  const [ contact, setContact ] = useState([]);
  const [ P1, setP1 ] = useState("Me");
  const [ P2, setP2 ] = useState("");
  const [ stat, setStat ] = useState("Unknown");

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

  const contactList = contact.map(x => {return {text: x.name} })
  const statusList = ['Positive', 'Negative', 'Unknown'];
  console.log(stat);
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
              onPress={() => Alert.alert('Submitted')}
        />
      </View>
      <View style={{ flex: 6 }}/>
    </View>
  );
}
