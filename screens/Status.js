import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';

import AutoComplete from 'react-native-autocomplete-select';
import Select from 'react-native-simple-select';
import { AsyncStorage, Alert } from 'react-native';

import * as Contacts from 'expo-contacts';
import _ from 'lodash';
import { P1_DEFAULT, P2_DEFAULT, SUBMIT_DEFAULT, UNKNOWN, POSITIVE, NEGATIVE, MY_GRAPH, AFFECTED_LIST } from '../consts';

import { getData, setData, fetchData } from '../utils';

export default function App() {
  const [ contact, setContact ] = useState([]);
  const [ P1, setP1 ] = useState(P2_DEFAULT);
  const [ stat1, setStat1 ] = useState(UNKNOWN);
  const [submit, setSubmit] = useState(SUBMIT_DEFAULT);

  useEffect(() => {
  // XXX -  Move Read contacts to utils
  (async () => {
    const rawGraphData = await fetchData(MY_GRAPH);
    if (rawGraphData) {
          const nodes = _.keys(rawGraphData).map(x => {return {name: x}});
          setContact(nodes);
    }
   })();
  }, []);

  useEffect(() => {
      // Perform some validations here
      // Fill this up
      if (submit) {
        (async () => {
          const rawAffectedList = await fetchData(AFFECTED_LIST);
          if (rawAffectedList) {

                const newList = stat1 === POSITIVE ? _.concat(rawAffectedList, [P1]) :
                          _.remove(rawAffectedList, x => _.indexOf([P1] , x) === -1);;
                setP1(P2_DEFAULT);
                setSubmit(SUBMIT_DEFAULT);
                // Write this into file
                const _ret = await
                            AsyncStorage.setItem(AFFECTED_LIST,
                              JSON.stringify(_.uniq(newList)));
                Alert.alert(`Status of ${P1} changed to ${stat1}`);


          }
         })();
     }
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
