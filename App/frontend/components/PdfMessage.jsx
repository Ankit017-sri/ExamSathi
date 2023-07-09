import React from "react";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";

const PdfMessage = ({ pdfDetails, isSent }) => {
  return (
    <TouchableOpacity
      style={{
        // width: 200,
        // height: 90,
        backgroundColor: isSent ? "#3696FF" : "#fff",
        borderRadius: 10,
        alignItems: "center",
        padding: 10,
      }}
      onPress={() => {
        Linking.openURL(pdfDetails.url);
      }}
    >
      <Image
        source={require("../assets/images/doc_thumbnail.jpg")}
        style={{ height: 60, width: "100%" }}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: isSent
            ? "rgba(250,250,250,0.5)"
            : "rgba(10,10,10,0.2)",
          borderRadius: 6,
          padding: 5,
        }}
      >
        <Image
          style={{ width: 25, height: 25, marginRight: 10 }}
          source={require("../assets/images/download-pdf.png")}
        />
        <Text
          style={{ fontSize: 13, fontWeight: "bold", width: "80%" }}
          numberOfLines={2}
        >
          {pdfDetails.name}{" "}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PdfMessage;
