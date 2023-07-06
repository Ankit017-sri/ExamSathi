import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

import AuthContext from "../auth/context";
import authStorage from "../auth/storage";
import baseUrl from "../baseUrl";
import cache from "../utilities/cache";
import { Mixpanel } from "mixpanel-react-native";

const trackAutomaticEvents = true;
const mixpanel = new Mixpanel(
  "fcab386593bfcae67eaafb8136754929",
  trackAutomaticEvents
);
mixpanel.init();

const Login = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);

  const authContext = useContext(AuthContext);

  const handleMobileChange = (text) => {
    setMobile(text);
    if (text.length !== 10) {
      setMobileError("Please enter a valid 10-digit mobile number");
    } else {
      setMobileError("");
    }
  };

  const handleSubmit = async () => {
    if (nameError !== "") {
      setNameError("Please enter a valid name.");
    } else {
      setLoading(true);
      console.log(`Name: ${name}, Mobile: ${mobile}`);
      const result = await axios
        .post(`${baseUrl}/auth/`, {
          fullName: name,
          phoneNumber: mobile,
        })
        .catch((e) => console.log(e));
      if (!result) {
        setLoading(false);
        alert("Please enter details.");
      }
      authStorage.storeToken(result?.data.token);
      authContext.setToken(result?.data.token);
      authContext.setPhone(result.data.user.phoneNumber);
      authContext.setName(result.data.user.fullName);
      authContext.setId(result.data.user._id);
      await cache.store("user", result?.data.user);
      setLoading(false);

      mixpanel.track("user_logged_in", {
        name: name,
        mobile: mobile,
        loginTime: new Date().toLocaleTimeString(),
      });
    }
  };

  useEffect(() => {
    mixpanel.track("login_page_visited");
    mixpanel.timeEvent("time_spent_on_login_screen");

    return () => {
      mixpanel
        .eventElapsedTime("time_spent_on_login_screen")
        .then((duration) => {
          mixpanel.track("login_screen_time", {
            duration: `${duration + " second"}`,
          });
          mixpanel.clearSuperProperties('time_spent_on_login_screen');
        })
        .catch((error) => {
          console.error("Error calculating screen time:", error);
        });
    };
  }, []);

  return (
    <View style={styles.backgroundContainer}>
      <Image
        source={require("../assets/icon.png")}
        style={{
          width: 70,
          height: 70,
          borderRadius: 5,
          marginBottom: 40,
        }}
      />
      <View style={styles.cardContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            placeholderTextColor="#808080"
            placeholder="Enter your name"
            value={name}
            onChangeText={(text) => {
              setNameError("");
              setName(text);
            }}
            style={styles.input}
            onBlur={() => {
              if (name.length < 3)
                return setNameError("Please enter a valid name.");
            }}
          />
          {nameError !== "" && <Text style={styles.error}>{nameError}</Text>}
          <Text style={styles.label}>Mobile:</Text>
          <TextInput
            placeholderTextColor="#808080"
            placeholder="Enter your mobile number."
            value={mobile}
            onChangeText={(text) => handleMobileChange(text)}
            keyboardType="numeric"
            style={styles.input}
          />
          {mobileError !== "" && (
            <Text style={styles.error}>{mobileError}</Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.button}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {!loading ? "Submit" : "Loading..."}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    width: null,
    height: null,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formContainer: {
    marginVertical: 10,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    color: "#000",
  },
  buttonContainer: {
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4f83cc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginTop: -10,
    marginBottom: 15,
  },
});

export default Login;
