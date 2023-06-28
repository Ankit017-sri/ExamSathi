require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");

const authRouter = require("./routes/auth");
const submitQuizRouter = require("./routes/submitQuiz");
const quizDataRouter = require("./routes/quizData");
const analyticRouter = require("./routes/analytic");
const messageRouter = require("./routes/messages");
const feedbackRouter = require("./routes/feedback");
const groupRouter = require("./routes/groups");

if (!process.env.DB) {
  console.error("!!FATAL ERROR!! Database not connected.");
  process.exit(1);
}

const app = express();
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
  return res.send("Welcome to Exam Sathi.");
});
app.use("/auth", authRouter);
app.use("/submitQuiz", submitQuizRouter);
app.use("/quizData", quizDataRouter);
app.use("/analytic", analyticRouter);
app.use("/message", messageRouter);
app.use("/feedback", feedbackRouter);
app.use("/group", groupRouter);

mongoose
  .connect(process.env.DB)
  .then(() => console.info("mongo connected.."))
  .catch((err) => console.error(err.message, err));

const port = process.env.PORT || 8000;

const httpServer = app.listen(port, () =>
  console.info(`server started on port ${port}`)
);

// socket setup

const io = new Server(httpServer, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "*",
    credentials: true,
  },
});

let activeUsers = [];
let messageData = [];
const groups = [];

io.on("connection", (socket) => {
  console.log("socket connected ....");

  // Listen for incoming messages
  socket.on("new-user-add", (data) => {
    //console.log(data);
    const { Id, group } = data;
    if (!activeUsers.some((user) => user.userId === Id)) {
      activeUsers.push({
        userId: Id,
        socketId: socket.id,
      });
    }
    socket.join(group);
    io.to(group).emit("get-active-users", activeUsers.length);
  });

  // socket.on("send-message", (data) => {
  //   const { receiverId } = data;
  //   const user = activeUsers.find((user) => user.userId === receiverId);
  //   if (user) {
  //     io.to(user.socketId).emit("receive-message", data);
  //   }
  // });

  socket.on("message", (data) => {
    console.log(`Received message: ${data}`);
    const { message, group } = data;
    // Broadcast the message to all connected clients
    io.to(group).emit("message-recieve", message);
  });

  // --------------------------------------Group Chats ----------------------------

  // Event handler for handling group chat messages
  socket.on("groupChatMessage", (data) => {
    // Find the group by ID
    const group = groups.find((group) => group.id === data.groupId);
    if (group) {
      // Broadcast the group chat message to all connected clients in the same group
      io.to(group.id).emit("groupMessage", data);
    }
  });

  // Event handler for handling room join
  socket.on("joinGroup", (data) => {
    // Find the group by ID
    const group = groups.find((group) => group.id === data.groupId);
    if (group) {
      // Join the group
      socket.join(group.id);
      //console.log(group);
    } else {
      groups.push({ id: data.groupId, members: data.members });
      socket.join(data.groupId);
    }
  });

  // Event handler for handling room leave
  socket.on("leaveGroup", (groupId) => {
    // Leave the group
    socket.leave(groupId);
  });
  //------------------------------------- End of groupchats ----------------------------------------
  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
