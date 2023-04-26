import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PDFViewer = ({ url, name }) => {
  // const [pdfUri, setPdfUri] = useState(null);
  // const [location, setLocation] = useState("");
  // useEffect(() => {
  //   // Check if PDF is already downloaded
  //   FileSystem.getInfoAsync(
  //     FileSystem.documentDirectory + url.split("/").pop()
  //   ).then(({ exists }) => {
  //     if (exists) {
  //       setPdfUri(FileSystem.documentDirectory + url.split("/").pop());
  //       console.log(pdfUri);
  //     }
  //   });
  // }, []);

  // const downloadPdf = async () => {
  //   // Download PDF from URL
  //   const pdfDownload = await FileSystem.downloadAsync(
  //     url,
  //     FileSystem.documentDirectory + url.split("/").pop()
  //   );
  //   setPdfUri(pdfDownload.uri);
  //   try {
  //     await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
  //       data: `file://${pdfDownload.uri}`,
  //       flags: 1,
  //       type: "application/pdf",
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const openPdf = async () => {
    // await Share.share({ url: pdfUri.uri });
    // Open PDF in default PDF viewer
    try {
      // await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
      //   data: `file://${pdfUri}`,
      //   flags: 1,
      //   type: "application/pdf",
      // });
      Linking.openURL(url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          openPdf();
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "#EFF5F5",
            padding: 4,
            borderRadius: 4,
          }}
        >
          <View>
            <Ionicons name="document-outline" size={25} color={"red"} />
            <Text
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                alignSelf: "center",
              }}
            >
              PDF
            </Text>
          </View>
          <Text
            style={{ marginTop: 8, fontSize: 16, paddingHorizontal: 8 }}
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PDFViewer;
