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

import { MY_GRAPH, AFFECTED_LIST, POSITIVE } from '../consts';
import { getData } from '../utils';

const fetchData = async () => {
  const graphDataStr = await getData(MY_GRAPH);
  const graphData = graphDataStr ? JSON.parse(graphDataStr) : {};
  return graphData ? graphData : null;
}

const recursiveTree = (nodeList) => {
  if (nodeList.length <= 0) {
    return [];
  }
  const head = nodeList.pop();
  console.log(head);
  console.log(nodeList);
  return {id: head,
    name: head,
    nodeTextStyle: { fontSize: 12 },
    imageUrl: { href: { uri: "https://facebook.github.io/react-native/docs/assets/favicon.png"}},
    nodeImageStyle: { imageHeight: 60 , imageWidth: 60, opacity: 1 },
    children : [recursiveTree(nodeList)]};
}
export default function () {
  const [ graphData, setGraphData] = useState({});
  const [ nodes, setNodes ] = useState([]);
  const [ currentNode, setCurrentNode ] = useState(0);

  useEffect(() => {
    // XXX -  Move Read contacts to utils
    (async () => {
      const rawGraphData = await fetchData();
          if (rawGraphData) {
            const nodes = _.keys(rawGraphData).map(x => x);
            const newValues = _.keys(rawGraphData).map(x => rawGraphData[x].map(y => nodes.indexOf(y)))
            const newKeys = _.keys(rawGraphData).map( x => nodes.indexOf(x));
            const newGraph = _.fromPairs(_.zip(newKeys, newValues));
            setNodes(nodes);
            setGraphData(newGraph);
          }
      })();
    }, []);


    return (
        <View style={styles.container}>
          <NetworkGraph
            selectedCircleIndex={currentNode}
            circleTitles={nodes}
            connections={graphData}
            containerHeight={300}
            containerWidth={300}
            centralCircleRadius={40}
            otherCircleLinesColor="black"
            otherCirclesRadius={40}
            distanceFromCenter={100}
            onCircleClick={setCurrentNode}/>
       </View>
    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
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
