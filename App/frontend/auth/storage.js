import * as Keychain from 'react-native-keychain';

const accessKey = 'accessToken';

const storeToken = async token => {
  try {
    await Keychain.setGenericPassword(accessKey, token);
  } catch (error) {
    console.log('Error storing the auth token.', error);
  }
};

const getToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return {
        accessToken: credentials.password,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.log('Error getting the auth token', error);
  }
};

const removeToken = async () => {
  try {
    await Keychain.resetGenericPassword();
    console.log('Token removed successfully.');
  } catch (error) {
    console.log('Error removing the auth token.', error);
  }
};

export default {
  storeToken,
  getToken,
  removeToken,
};
