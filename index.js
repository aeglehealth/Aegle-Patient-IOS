/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import React, {useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import {ApolloProvider} from 'react-apollo';
import {ApolloProvider as Provider} from '@apollo/react-hooks';
import ShowMessage, {type} from './src/Components/toster/ShowMessage';
import AsyncStorage from '@react-native-community/async-storage';
import {UserContext} from './src/store/context/UserContext';
import {createUploadLink} from 'apollo-upload-client';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import {onError} from 'apollo-link-error';
import {withClientState} from 'apollo-link-state';
import {ApolloLink, Observable} from 'apollo-link';
import {DEPLOYMENT_URL, AUTH_TOKEN, NOTIFICATION} from 'react-native-dotenv';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  if (remoteMessage) {
    console.log(remoteMessage.data, 'datatta');
    const data = JSON.stringify(remoteMessage);
    console.log(data, 'dat');
    await AsyncStorage.setItem(NOTIFICATION, data);
  }
});

console.disableYellowBox = true;

const cache = new InMemoryCache({});

const request = async operation => {
  const token = await AsyncStorage.getItem(AUTH_TOKEN);
  operation.setContext({
    headers: {
      authorization: token ? `aegle ${token}` : '',
    },
  });
};

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

const client = new ApolloClient({
  link: ApolloLink.from([
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
      // uri: 'https://6feb7adb66bd.ngrok.io/graphql',
      // uri: 'http://192.168.43.115:4000/graphql',
      uri: 'https://aegle-mongodb-api.herokuapp.com/graphql',
      // uri: 'https://aegle-health-api.herokuapp.com/graphql',
      // uri: DEPLOYMENT_URL,
      credentials: 'include',
    }),
  ]),
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

const AegleApp = props => {
  const [data, setState] = useState({});
  return (
    <ApolloProvider client={client}>
      <Provider client={client}>
        <UserContext.Provider
          value={{
            data: data.data,
            renewState: datas => setState({data: datas}),
          }}>
          <App />
        </UserContext.Provider>
      </Provider>
    </ApolloProvider>
  );
};

AppRegistry.registerComponent(appName, () => AegleApp);
