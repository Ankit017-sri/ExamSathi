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

io.on("connection", (socket) => {
  console.log("socket connected ....");

  // Listen for incoming messages
  socket.on("new-user-add", (newUserId) => {
    console.log(newUserId);
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    io.emit("get-active-users", activeUsers.length);
  });

  // socket.on("send-message", (data) => {
  //   const { receiverId } = data;
  //   const user = activeUsers.find((user) => user.userId === receiverId);
  //   if (user) {
  //     io.to(user.socketId).emit("receive-message", data);
  //   }
  // });

  socket.on("message", (data) => {
    console.log(`Received message: ${data.name}`);

    // Broadcast the message to all connected clients
    io.emit("message-recieve", data);
  });
  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
