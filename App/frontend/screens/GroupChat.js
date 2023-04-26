// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   Keyboard,
//   Image,
// } from "react-native";
// import React, { useState, useEffect, useRef, useContext } from "react";
// import AuthContext from "../auth/context";
// import { format } from "timeago.js";
// import { Ionicons } from "@expo/vector-icons";
// import CustomHeader from "../components/CustomHeader";
// import CloudURL from "../CloudURL";
// import axios from "axios";
// import FullscreenImage from "../components/ImageView";
// import { BottomSheet } from "react-native-btr";
// import * as ImagePicker from "expo-image-picker";
// import * as DocumentPicker from "expo-document-picker";
// import * as FileSystem from "expo-file-system";
// import * as Linking from "expo-linking";

// import baseUrl from "../baseUrl";
// import { io } from "socket.io-client";
// import cache from "../utilities/cache";
// import SwipeableMessage from "../components/SwipeableMessage";
// import ChatContext from "../chat/context";

// const GroupChat = ({ navigation, route }) => {
//   const {
//     Id,
//     token,
//     setTabBarVisible,
//     name: fullName,
//   } = useContext(AuthContext);
//   const { replyMessage, setReplyMessage } = useContext(ChatContext);
//   const {
//     _id: groupId,
//     members: groupMembers,
//     messages,
//     name,
//   } = route.params.groupData;
//   const [message, setMessage] = useState(null);
//   const [visible, setVisible] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [messageArray, setMessageArray] = useState([]);
//   const [recieved, setRecieved] = useState();

//   const socket = useRef();
//   const scrollRef = useRef();
//   const inputRef = useRef();

//   useEffect(() => {
//     setTabBarVisible(false);
//     if (messages) {
//       setMessageArray(messages);
//       scrollRef.current.scrollToEnd({ animated: false });
//     }
//     return async () => {
//       setReplyMessage({});
//       await cache.store(`${groupId}`, messages);
//     };
//   }, [groupId]);

//   useEffect(() => {
//     socket.current = io(baseUrl);
//     socket.current.emit("joinGroup", { groupId, members: groupMembers });
//     socket.current.on("groupMessage", (data) => {
//       // Update the messages state with the new message
//       // setMessages(prevMessages => [...prevMessages, data]);

//       setRecieved(data);
//       console.log("recieved data ", data);
//     });
//     return () => {
//       socket.current.emit("leaveGroup", groupId);
//       socket.current.disconnect();
//     };
//   }, [groupId]);

//   useEffect(() => {
//     if (recieved) {
//       setMessageArray([...messageArray, recieved]);
//       messages.push(recieved);
//       setRecieved();
//     }
//   }, [recieved?._id]);

//   useEffect(() => {
//     if (replyMessage.name) {
//       inputRef.current.focus();
//     }
//   }, [replyMessage]);

//   const getBase64 = async (uri) => {
//     try {
//       const fileUri = uri; // Replace with your file URI
//       const base64 = await FileSystem.readAsStringAsync(fileUri, {
//         encoding: FileSystem.EncodingType.Base64,
//       });

//       return base64;
//     } catch (error) {
//       console.log(error);
//       return "";
//     }
//   };

//   const pickImage = async () => {
//     let result = await ImagePicker.launchCameraAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       base64: true,
//       // aspect: [4, 3],
//       quality: 1,
//     });
//     if (result.canceled) {
//       // Handle cancellation...
//       return;
//     }
//     if (!result.canceled) {
//       // setImage(result.assets[0].uri);
//       UploadImage(result.assets[0]);
//     }
//   };
//   const openGallery = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       base64: true,
//       // aspect: [4, 3],
//       quality: 1,
//     });

//     // console.log(result);
//     if (result.canceled) {
//       // Handle cancellation...
//       setVisible(false);
//       return;
//     }
//     if (!result.canceled) {
//       // setImage(result.assets[0].uri);
//       UploadImage(result.assets[0]);
//     }
//   };

//   const pickDocument = async () => {
//     try {
//       let result = await DocumentPicker.getDocumentAsync({
//         type: "application/pdf",
//       });

//       if (result.type == "success") {
//         console.log(result);
//         const base64 = await getBase64(result.uri);

//         if (base64 !== "") {
//           let base64PDF = `data:application/pdf;base64,${base64}`;
//           let formdata = {
//             file: base64PDF,
//             upload_preset: "lylmg545",
//             // upload_preset: "i4o0qcxt",
//           };
//           const response = await axios.post(CloudURL, formdata);
//           console.log(response.data);
//           if (response.data.secure_url) {
//             console.log(response.data.secure_url);
//             // setImage(data.secure_url);
//             setVisible(false);
//             setUploading(true);
//             handleUpload({
//               uri: response.data.secure_url,
//               pdfName: result.name,
//             });
//             // alert("Upload successful");
//           }
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const UploadImage = async (data) => {
//     setVisible(false);
//     setUploading(true);
//     const source = data.base64;
//     let base64Img = `data:image/jpg;base64,${source}`;
//     let formdata = {
//       file: base64Img,
//       upload_preset: "lylmg545",
//       // upload_preset: "i4o0qcxt",
//     };
//     fetch(CloudURL, {
//       body: JSON.stringify(formdata),
//       headers: {
//         "content-type": "application/json",
//       },
//       method: "POST",
//     })
//       .then(async (response) => {
//         let data = await response.json();
//         if (data.secure_url) {
//           console.log(data.secure_url);
//           // setImage(data.secure_url);
//           handleUpload({ uri: data.secure_url });
//           // alert("Upload successful");
//         }
//       })
//       .catch((err) => {
//         setUploading(false);
//         alert("something went wrong");
//       });
//   };

//   const handleUpload = async (data) => {
//     if (data) {
//       const res = await axios
//         .post(`${baseUrl}/group/${groupId}/messages`, data, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .catch((e) => console.log(e));
//       console.log(res.data);
//       if (!res.data.uri) {
//         setUploading(false);
//         return alert("something went wrong please try again !");
//       } else {
//         socket.current.emit("groupChatMessage", res.data);
//         console.log(res.data);
//         setUploading(false);
//       }
//     }
//   };

//   const sendMessage = async () => {
//     if (message) {
//       const res = await axios
//         .post(
//           `${baseUrl}/group/${groupId}/messages`,
//           { text: message, replyOn: replyMessage._id ? replyMessage : {} },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         )
//         .catch((e) => console.log(e));
//       if (!res.data.text) {
//         return alert("something went wrong please try again !");
//       } else {
//         console.log(res.data);
//         setReplyMessage({});
//         socket.current.emit("groupChatMessage", res.data);
//         setMessage("");
//       }
//     }

//     // socket.current.disconnect();
//   };

//   const openPdf = async ({ pdfUri }) => {
//     try {
//       const supported = await Linking.canOpenURL(pdfUri);

//       if (!supported) {
//         console.log(`Can't handle url: ${pdfUri}`);
//       } else {
//         await Linking.openURL(pdfUri);
//       }
//     } catch (error) {
//       console.log(`An error occurred: ${error}`);
//     }
//   };

//   const MessageSent = ({ msg }) => {
//     return (
//       <View>
//         {msg.replyOn?.name && (
//           <View
//             style={{
//               minWidth: "55%",
//               maxWidth: "95%",
//               backgroundColor: "#00ABB3",
//               borderRadius: 12,
//               borderBottomRightRadius: 0,
//               borderBottomLeftRadius: 0,
//             }}
//           >
//             <View
//               style={{
//                 borderLeftColor: "cyan",
//                 borderLeftWidth: 4,
//                 // backgroundColor: "#D6E4E5",
//                 borderRadius: 8,
//                 padding: 4,
//               }}
//             >
//               <View>
//                 <Text style={{ color: "#5837D0", fontWeight: "600" }}>
//                   {msg.replyOn.senderId == Id ? "you" : msg.replyOn.name}
//                 </Text>
//               </View>
//               {msg.replyOn.uri ? (
//                 <>
//                   {msg.replyOn.uri.split(".").slice(-1)[0] == "pdf" ? (
//                     <TouchableOpacity
//                       onPress={() => openPdf({ pdfUri: msg.replyOn.uri })}
//                     >
//                       <View
//                         style={{
//                           flexDirection: "row",
//                           justifyContent: "space-between",
//                           backgroundColor: "#EFF5F5",
//                           padding: 4,
//                           borderRadius: 4,
//                         }}
//                       >
//                         <View>
//                           <Ionicons
//                             name="document-outline"
//                             size={25}
//                             color={"red"}
//                           />
//                           <Text
//                             style={{
//                               fontSize: 10,
//                               textTransform: "uppercase",
//                               alignSelf: "center",
//                             }}
//                           >
//                             {msg.replyOn.uri.split(".").slice(-1)[0]}
//                           </Text>
//                         </View>
//                         <Text style={{ marginTop: 8, fontSize: 16 }}>
//                           {msg.replyOn.pdfName?.length > 0
//                             ? msg.replyOn.pdfName
//                             : msg.replyOn.uri.split("/").pop()}
//                         </Text>
//                       </View>
//                     </TouchableOpacity>
//                   ) : (
//                     <FullscreenImage imageSource={msg.replyOn.uri} />
//                   )}
//                 </>
//               ) : (
//                 <Text style={{ fontSize: 16 }}>{msg.replyOn.text}</Text>
//               )}
//             </View>
//           </View>
//         )}
//         <View
//           style={{
//             minWidth: "55%",
//             maxWidth: "95%",
//             backgroundColor: "#00ABB3",
//             borderRadius: 12,
//             paddingHorizontal: 10,
//             paddingVertical: 4,
//             borderTopRightRadius: msg.replyOn?.name ? 0 : 12,
//             borderTopLeftRadius: msg.replyOn?.name ? 0 : 12,
//           }}
//         >
//           {msg.uri ? (
//             <>
//               {msg.uri.split(".").slice(-1)[0] == "pdf" ? (
//                 <TouchableOpacity onPress={() => openPdf({ pdfUri: msg.uri })}>
//                   <View
//                     style={{
//                       flexDirection: "row",
//                       justifyContent: "space-between",
//                       backgroundColor: "#EFF5F5",
//                       padding: 4,
//                       borderRadius: 4,
//                     }}
//                   >
//                     <View>
//                       <Ionicons
//                         name="document-outline"
//                         size={25}
//                         color={"red"}
//                       />
//                       <Text
//                         style={{
//                           fontSize: 10,
//                           textTransform: "uppercase",
//                           alignSelf: "center",
//                         }}
//                       >
//                         {msg.uri.split(".").slice(-1)[0]}
//                       </Text>
//                     </View>
//                     <Text style={{ marginTop: 8, fontSize: 16 }}>
//                       {msg.pdfName?.length > 0
//                         ? msg.pdfName
//                         : msg.uri.split("/").pop()}
//                     </Text>
//                   </View>
//                 </TouchableOpacity>
//               ) : (
//                 <FullscreenImage imageSource={msg.uri} />
//               )}
//             </>
//           ) : (
//             // <TouchableOpacity onPress={() => openPdf({ pdfUri: msg.uri })}>
//             //   <PdfThumbnail pdfUri={msg.uri} />
//             // </TouchableOpacity>
//             // <FullscreenImage imageSource={msg.uri} />
//             <Text
//               style={{
//                 color: "#fff",
//                 fontSize: 16,
//                 marginHorizontal: 6,
//                 marginVertical: 4,
//               }}
//             >
//               {msg.text}
//             </Text>
//           )}
//           <Text style={{ color: "#fff", textAlign: "right", fontSize: 10 }}>
//             {format(msg.createdAt)}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   const MessageRecieved = ({ msg }) => {
//     return (
//       <View
//         style={{
//           backgroundColor: "#EAEAEA",
//           marginBottom: 8,
//           borderRadius: 10,
//         }}
//       >
//         <Text style={styles.name}>{msg.name}</Text>
//         {msg.replyOn?.name && (
//           <View
//             style={{
//               minWidth: "55%",
//               maxWidth: "95%",
//               backgroundColor: "#EAEAEA",
//               borderRadius: 12,
//               borderBottomRightRadius: 0,
//               borderBottomLeftRadius: 0,
//               marginHorizontal: 8,
//             }}
//           >
//             <View
//               style={{
//                 borderLeftColor: "cyan",
//                 borderLeftWidth: 4,
//                 // backgroundColor: "#D6E4E5",
//                 borderRadius: 8,
//                 padding: 4,
//               }}
//             >
//               <View>
//                 <Text style={{ color: "#5837D0", fontWeight: "600" }}>
//                   {msg.replyOn.name}
//                 </Text>
//               </View>
//               {msg.replyOn.uri ? (
//                 <>
//                   {msg.replyOn.uri.split(".").slice(-1)[0] == "pdf" ? (
//                     <TouchableOpacity
//                       onPress={() => openPdf({ pdfUri: msg.replyOn.uri })}
//                     >
//                       <View
//                         style={{
//                           flexDirection: "row",
//                           justifyContent: "space-between",
//                           backgroundColor: "#EFF5F5",
//                           padding: 4,
//                           borderRadius: 4,
//                         }}
//                       >
//                         <View>
//                           <Ionicons
//                             name="document-outline"
//                             size={25}
//                             color={"red"}
//                           />
//                           <Text
//                             style={{
//                               fontSize: 10,
//                               textTransform: "uppercase",
//                               alignSelf: "center",
//                             }}
//                           >
//                             {msg.replyOn.uri.split(".").slice(-1)[0]}
//                           </Text>
//                         </View>
//                         <Text style={{ marginTop: 8, fontSize: 16 }}>
//                           {msg.replyOn.pdfName?.length > 0
//                             ? msg.replyOn.pdfName
//                             : msg.replyOn.uri.split("/").pop()}
//                         </Text>
//                       </View>
//                     </TouchableOpacity>
//                   ) : (
//                     <FullscreenImage imageSource={msg.replyOn.uri} />
//                   )}
//                 </>
//               ) : (
//                 <Text style={{ fontSize: 16 }}>{msg.replyOn.text}</Text>
//               )}
//             </View>
//           </View>
//         )}
//         <View
//           style={{
//             minWidth: "60%",
//             maxWidth: "85%",
//             backgroundColor: "#EAEAEA",
//             borderRadius: 12,
//             paddingHorizontal: 10,
//           }}
//         >
//           {msg.uri ? (
//             <>
//               {msg.uri.split(".").slice(-1)[0] == "pdf" ? (
//                 <TouchableOpacity onPress={() => openPdf({ pdfUri: msg.uri })}>
//                   <View
//                     style={{
//                       flexDirection: "row",
//                       justifyContent: "space-between",
//                       backgroundColor: "#EFF5F5",
//                       padding: 4,
//                       borderRadius: 4,
//                     }}
//                   >
//                     <View>
//                       <Ionicons
//                         name="document-outline"
//                         size={25}
//                         color={"red"}
//                       />
//                       <Text
//                         style={{
//                           fontSize: 10,
//                           textTransform: "uppercase",
//                           alignSelf: "center",
//                         }}
//                       >
//                         {msg.uri.split(".").slice(-1)[0]}
//                       </Text>
//                     </View>
//                     <Text style={{ marginTop: 8, fontSize: 16 }}>
//                       {msg.pdfName?.length > 0
//                         ? msg.pdfName
//                         : msg.uri.split("/").pop()}
//                     </Text>
//                   </View>
//                 </TouchableOpacity>
//               ) : (
//                 <FullscreenImage imageSource={msg.uri} />
//               )}
//             </>
//           ) : (
//             <Text style={[styles.messageText, { color: "black" }]}>
//               {msg.text}
//             </Text>
//           )}

//           <Text style={{ color: "#3C4048", textAlign: "right", fontSize: 10 }}>
//             {format(msg.createdAt)}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   const toggleBottomNavigationView = () => {
//     setVisible(!visible);
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <CustomHeader
//         title={name}
//         isBack={true}
//         navigation={navigation}
//         setTabBarVisible={setTabBarVisible}
//       />
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={{ flexGrow: 1 }}
//       >
//         {uploading && (
//           <View
//             style={{
//               position: "absolute",
//               top: 0,
//               zIndex: 40,
//               width: "100%",
//               backgroundColor: "#f1f1f1",
//               paddingVertical: 4,
//             }}
//           >
//             <Text style={{ textAlign: "center" }}>Sending media...</Text>
//           </View>
//         )}

//         <View style={{ flex: 0.95 }}>
//           <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
//             <ScrollView
//               style={[styles.messages]}
//               ref={scrollRef}
//               onContentSizeChange={() =>
//                 scrollRef.current.scrollToEnd({ animated: false })
//               }
//             >
//               {messages.length === 0 && !uploading && (
//                 <Text style={{ alignSelf: "center", color: "black" }}>
//                   No messages yet
//                 </Text>
//               )}
//               {messageArray.map((data, index) => (
//                 <SwipeableMessage
//                   key={index}
//                   data={data}
//                   Id={Id}
//                   MessageRecieved={MessageRecieved}
//                   MessageSent={MessageSent}
//                 />
//               ))}
//               <View></View>
//             </ScrollView>
//           </TouchableWithoutFeedback>
//           <TouchableOpacity
//             onPress={() => scrollRef.current.scrollToEnd({ animated: false })}
//             style={{
//               position: "absolute",
//               bottom: 10,
//               right: 16,
//               backgroundColor: "black",
//               borderRadius: 15,
//               width: 30,
//               height: 30,
//               opacity: 0.4,
//               justifyContent: "center",
//               alignItems: "center",
//               zIndex: 30,
//             }}
//           >
//             <Ionicons name="arrow-down" size={25} />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.inputContainer}>
//           {replyMessage.name && (
//             <View
//               style={{
//                 position: "absolute",
//                 top: -68,
//                 marginHorizontal: 16,
//                 backgroundColor: "white",
//                 width: "87%",
//                 paddingHorizontal: 4,
//                 paddingVertical: 4,
//                 borderTopRightRadius: 8,
//                 borderTopLeftRadius: 8,
//                 borderWidth: 1,
//                 borderBottomWidth: 0,
//                 borderColor: "#ccc",
//               }}
//             >
//               <View
//                 style={{
//                   borderLeftColor: "cyan",
//                   borderLeftWidth: 4,
//                   height: 60,
//                   backgroundColor: "#D6E4E5",
//                   borderRadius: 8,
//                   padding: 4,
//                   overflow: "hidden",
//                 }}
//               >
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <Text style={{ color: "#5837D0" }}>{replyMessage.name}</Text>
//                   <TouchableOpacity onPress={() => setReplyMessage({})}>
//                     <Ionicons name="close" size={20} />
//                   </TouchableOpacity>
//                 </View>
//                 {replyMessage.uri && (
//                   <>
//                     {replyMessage.uri.split(".").slice(-1)[0] == "pdf" ? (
//                       <View
//                         style={{
//                           flexDirection: "row",
//                           backgroundColor: "#EFF5F5",
//                           padding: 4,
//                           borderRadius: 4,
//                         }}
//                       >
//                         <View>
//                           <Ionicons
//                             name="document-outline"
//                             size={16}
//                             color={"red"}
//                           />
//                           <Text
//                             style={{
//                               fontSize: 10,
//                               textTransform: "uppercase",
//                               alignSelf: "center",
//                             }}
//                           >
//                             {replyMessage.uri.split(".").slice(-1)[0]}
//                           </Text>
//                         </View>
//                         <Text style={{ fontSize: 14 }}>
//                           {replyMessage.pdfName?.length > 0
//                             ? replyMessage.pdfName
//                             : replyMessage.uri.split("/").pop()}
//                         </Text>
//                       </View>
//                     ) : (
//                       <Image
//                         source={{ uri: replyMessage.uri }}
//                         style={{ width: 40, height: 40 }}
//                       />
//                     )}
//                   </>
//                 )}
//                 <Text style={{ fontSize: 12 }}>{replyMessage.text}</Text>
//               </View>
//             </View>
//           )}
//           <TextInput
//             style={[
//               styles.input,
//               {
//                 borderTopWidth: replyMessage.name ? 0 : 1,
//                 borderTopLeftRadius: replyMessage.name ? 0 : 5,
//                 borderTopRightRadius: replyMessage.name ? 0 : 5,
//               },
//             ]}
//             value={message}
//             multiline={true}
//             onChangeText={(text) => setMessage(text)}
//             placeholder="Type your message here"
//             ref={inputRef}
//           />
//           {message ? (
//             <TouchableOpacity style={styles.button} onPress={sendMessage}>
//               {/* <Text style={styles.buttonText}>Send</Text> */}
//               <Ionicons name="send-sharp" color="#fff" size={20} />
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity
//               style={styles.button}
//               onPress={toggleBottomNavigationView}
//             >
//               {/* <Text style={styles.buttonText}>Send</Text> */}
//               <Ionicons name="images-outline" color="#fff" size={20} />
//             </TouchableOpacity>
//           )}
//         </View>
//       </KeyboardAvoidingView>
//       <BottomSheet
//         visible={visible}
//         onBackButtonPress={toggleBottomNavigationView}
//         //Toggling the visibility state on the click of the back botton
//         onBackdropPress={toggleBottomNavigationView}
//         //Toggling the visibility state on the clicking out side of the sheet
//       >
//         <View style={styles.bottomNavigationView}>
//           <TouchableOpacity
//             onPress={pickImage}
//             style={{ alignItems: "center" }}
//           >
//             <View style={styles.button}>
//               <Ionicons name="camera-outline" color="#fff" size={20} />
//             </View>
//             <Text style={{ color: "black" }}>Camera</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={openGallery}
//             style={{ alignItems: "center" }}
//           >
//             <View style={styles.button}>
//               <Ionicons name="images-outline" color="#fff" size={20} />
//             </View>
//             <Text style={{ color: "black" }}>Gallery</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={pickDocument}
//             style={{ alignItems: "center" }}
//           >
//             <View style={styles.button}>
//               <Ionicons name="document-attach-outline" color="#fff" size={20} />
//             </View>
//             <Text style={{ color: "black" }}>Document</Text>
//           </TouchableOpacity>
//         </View>
//       </BottomSheet>
//     </View>
//   );
// };

// export default GroupChat;

// const styles = StyleSheet.create({
//   messages: {
//     paddingHorizontal: 20,
//     // height: "80%",
//     // backgroundColor: "#fff",
//     marginTop: 10,
//   },

//   messageText: {
//     fontSize: 16,
//     marginHorizontal: 6,
//     marginVertical: 4,
//     color: "#fff",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     position: "relative",
//     top: 8,
//     bottom: 8,
//   },
//   input: {
//     flex: 1,
//     maxHeight: 120,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 8,
//     marginRight: 8,
//   },
//   button: {
//     backgroundColor: "black",
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//   },

//   name: {
//     color: "#00ABB3",
//     borderRadius: 10,
//   },
//   modalContent: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "black",
//   },
//   fullscreenImage: {
//     width: "100%",
//     height: "100%",
//   },
//   closeButton: {
//     position: "absolute",
//     top: 50,
//     right: 20,
//   },
//   closeButtonText: {
//     color: "white",
//     fontSize: 20,
//   },
//   bottomNavigationView: {
//     backgroundColor: "#17cfe3",
//     width: "100%",
//     height: 200,
//     justifyContent: "space-around",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     flexDirection: "row",
//     alignItems: "center",
//   },
// });
