import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import React, {useState, useEffect} from 'react';
import {ApolloProvider} from 'react-apollo';
import {ApolloProvider as Provider} from '@apollo/react-hooks';
import ShowMessage, {type} from './src/Components/toster/ShowMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserContext} from './src/store/context/UserContext';
import {createUploadLink} from 'apollo-upload-client';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import {onError} from 'apollo-link-error';
import {withClientState} from 'apollo-link-state';
import {ApolloLink, Observable} from 'apollo-link';
import {getMainDefinition} from 'apollo-utilities';
import {split} from 'apollo-link';
import {WebSocketLink} from 'apollo-link-ws';
import {DEPLOYMENT_URL, AUTH_TOKEN, NOTIFICATION} from 'react-native-dotenv';
import messaging from '@react-native-firebase/messaging';
import FastStorage from 'react-native-fast-storage';
import TtsContext from './Context/TtsContext';

messaging().onNotificationOpenedApp(async remoteMessage => {
  // console.log(remoteMessage, 'Message handled in the background! 1');
  if (remoteMessage) {
    const data = JSON.stringify(remoteMessage);
    await AsyncStorage.setItem(NOTIFICATION, data);
    await FastStorage.setItem(NOTIFICATION, data);
    // console.log(await FastStorage.getItem(NOTIFICATION), 'dat 1');
  }
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  // console.log(remoteMessage, 'Message handled in the background!23');
  if (remoteMessage) {
    const data = JSON.stringify(remoteMessage);
    await AsyncStorage.setItem(NOTIFICATION, data);
    await FastStorage.setItem(NOTIFICATION, data);
    // console.log(await FastStorage.getItem(NOTIFICATION), 'dat111');
  }
});

console.disableYellowBox = true;

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle;
      Promise.resolve(operation)
        .then(oper => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    }),
);
// Create an http link:
const httpLink = ApolloLink.from([
  onError(({graphQLErrors, networkError, operation}) => {
    if (
      graphQLErrors &&
      operation.query.definitions[0].operation === 'mutation'
    ) {
      graphQLErrors.map(({message}) => {
        if (message !== 'Device already exist') {
          ShowMessage(type.ERROR, message);
        }
      });
      return;
    }
    if (operation.query.definitions[0].operation === 'mutation') {
      ShowMessage(type.ERROR, 'Network error');
    }
    if (networkError) {
      console.log(networkError);
    }
    if (graphQLErrors) {
      console.log(graphQLErrors);
    }
  }),
  requestLink,
  withClientState({
    defaults: {
      isConnected: true,
    },
    resolvers: {
      Mutation: {
        updateNetworkStatus: (_, {isConnected}, {cache}) => {
          cache.writeData({data: {isConnected}});
          return null;
        },
      },
    },
    cache,
  }),
  createUploadLink({
    // uri: 'https://aegle-mongodb-api.herokuapp.com/graphql',
    uri: 'https://api.aeglehealth.io/graphql',
    credentials: 'include',
  }),
]);

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: 'wss://api.aeglehealth.io/graphql',
  // uri: 'ws://aegle-mongodb-api.herokuapp.com/graphql',
  options: {
    reconnect: true,
  },
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({query}) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const cache = new InMemoryCache({});

const request = async operation => {
  const token = await AsyncStorage.getItem(AUTH_TOKEN);
  operation.setContext({
    headers: {
      authorization: token ? `aegle ${token}` : '',
    },
  });
};

const client = new ApolloClient({
  link,
  cache,
});

export const MEPOST = gql`
  query {
    me {
      id
      families {
        id
        firstName
        lastName
        gender
        dateOfBirth
        photo {
          id
          original
          thumbnail
        }
      }
      isEmailVerified
      isPhoneVerified
      provider
      profile {
        id
        firstName
        lastName
        gender
        dateOfBirth
        phoneNumber
        address
        country
        height
        weight
        age
        smoker
        postalCode
        medicalCert
        cv
        photo {
          id
          original
          thumbnail
        }
      }
      local {
        email
      }
      devices {
        id
        fingerprint
        fcmToken
      }
    }
  }
`;

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    console.log('HEADLESS');
    // App has been launched in the background by iOS, ignore
    return null;
  }
  return <AegleApp />;
}

const AegleApp = props => {
  const [data, setState] = useState({});
  return (
    <ApolloProvider client={client}>
      <Provider client={client}>
        <TtsContext>
          <App />
        </TtsContext>
      </Provider>
    </ApolloProvider>
  );
};

AppRegistry.registerComponent(appName, () => HeadlessCheck);
