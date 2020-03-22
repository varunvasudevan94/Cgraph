import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';

import { P1_DEFAULT, P2_DEFAULT, SUBMIT_DEFAULT, UNKNOWN, POSITIVE, NEGATIVE } from '../consts';

import AutoComplete from 'react-native-autocomplete-select';
import Select from 'react-native-simple-select';

import * as Contacts from 'expo-contacts';

import { getData, setData } from '../utils';

export default function App() {
  const [ contact, setContact ] = useState([]);
  const [ P1, setP1 ] = useState(P1_DEFAULT);
  const [ stat1, setStat1 ] = useState(UNKNOWN);
  const [submit, setSubmit] = useState(SUBMIT_DEFAULT);


  useEffect(() => {
    // XXX -  Move Read contacts to utils
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
      // Perform some validations here
      // Fill this up
  }, [submit]);


  const contactList = contact.map(x => {return {text: x.name} });
  const statusList = [UNKNOWN, POSITIVE, NEGATIVE];

  return (
    <View
      style={{
        flex: 1,
      }}>
      <View
        style={{flexDirection: 'row'}}
      >
        <Text style={{marginTop: 4, flex: 1}}>
          Contact:
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
        style={{flexDirection: 'column', flex:1}}
      >
        <Select
          items={statusList}
          promptText="Select the status of Virus"
          onSelect={setStat1}
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
