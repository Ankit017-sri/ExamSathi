import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AuthContext from "../auth/context";
import Colors from "../constants/Colors";
import CustomHeader from "../components/CustomHeader";
import Loader from "../components/Loader";
import baseUrl from "../baseUrl";
import { useFocusEffect } from "@react-navigation/native";

const PastQuiz = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { token } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/quizData`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      setData(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <CustomHeader title="Past Quiz" />
        {isLoading ? (
          <Loader />
        ) : (
          <ScrollView
            style={{ width: "100%", marginBottom: 50 }}
            contentContainerStyle={{
              alignItems: "center",
            }}
          >
            {data.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.cardContainer}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate("QuizDetailScreen", { quiz: item })
                }
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.quizTitle}</Text>
                  <Text style={styles.cardText}>
                    {new Date(item.createdAt).toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // paddingBottom: 100,
    backgroundColor: "#fff",
  },

  cardContainer: {
    backgroundColor: "#fff",
    width: "90%",
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: Colors.primary,
    elevation: 5,
  },
  cardHeader: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  cardBody: {
    padding: 20,
  },
  cardText: {
    fontSize: 16,
    marginTop: 10,
    color: "gray",
  },
  cardFooter: {
    padding: 20,
  },
});

export default PastQuiz;
