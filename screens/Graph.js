import React, { Component, useEffect, useState } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Graph from 'graph-data-structure';
import NetworkGraph from './G';
import _ from 'lodash';

import { MY_GRAPH, AFFECTED_LIST, POSITIVE, P1_DEFAULT } from '../consts';
import { fetchData } from '../utils';

export default function () {
    useEffect(() => {
    // XXX -  Move Read contacts to utils
    (async () => {
      const rawGraphData = await fetchData(MY_GRAPH);
      if (rawGraphData) {
            const nodes = _.keys(rawGraphData).map(x => x);
            const newValues = _.keys(rawGraphData).map(x => rawGraphData[x].map(y => nodes.indexOf(y)))
            const newKeys = _.keys(rawGraphData).map( x => nodes.indexOf(x));
            const newGraph = _.fromPairs(_.zip(newKeys, newValues));
            setNodes(nodes);
            setGraphData(newGraph);
            const rawAffectedList = await fetchData(AFFECTED_LIST);

            if (rawAffectedList) {
                  // Compute this from the graph
                  const affectedList = rawAffectedList.map(x => nodes.indexOf(x));
                  setAffectedList(affectedList);
            }
      }
     })();
    }, []);

    const [ graphData, setGraphData] = useState({});
    const [ affectedList, setAffectedList] = useState([]);
    const [ nodes, setNodes ] = useState([]);


    return (
        <View style={styles.container}>
          <NetworkGraph
            selectedCircleIndex={nodes.indexOf(P1_DEFAULT)}
            markCircles={affectedList}
            circleTitles={nodes}
            connections={graphData}
            containerHeight={300}
            containerWidth={300}
            centralCircleRadius={40}
            otherCircleLinesColor="black"
            otherCirclesRadius={40}
            distanceFromCenter={100}
            onCircleClick={(x)=>null}/>
       </View>
    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF',
    flexDirection: 'row'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
