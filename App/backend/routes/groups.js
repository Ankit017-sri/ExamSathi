const express = require("express");
const router = express.Router();
const Group = require("../models/group");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const GroupMessage = require("../models/groupMessage");

// Route to create a new group with a list of phone numbers
router.post("/new", auth, async (req, res) => {
  try {
    const { name, phoneNumbers } = req.body;

    // Create a new group
    const group = new Group({ name });
    await group.save();

    // Find the users with the phone numbers
    const users = await User.find({ phoneNumber: { $in: phoneNumbers } });

    // Add the group ID to the groups array of each user
    const groupIds = users.map((user) => group._id);
    await User.updateMany(
      { _id: { $in: users.map((user) => user._id) } },
      { $addToSet: { groups: { $each: groupIds } } }
    );

    // Update the group with the members
    group.members = users.map((user) => user._id);
    await group.save();

    res.status(201).json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to get all groups
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Find groups where the user ID is in the members array
    const groups = await Group.find({ members: userId });

    const groupsData = await Promise.all(
      groups.map(async (group) => {
        const groupId = group._id;

        // Fetch messages for the group
        const messages = await GroupMessage.find({ groupId });

        // Return group data along with messages
        return {
          groupId,
          name: group.name,
          groupMembers: group.members,
          messages,
        };
      })
    );

    res.json(groupsData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to get a specific group by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const groupId = req.params.id;
    const group = await Group.findById(groupId).populate(
      "members",
      "fullName phoneNumber"
    );
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to delete a specific group by ID
// router.delete("/:id", auth, async (req, res) => {
//   try {
//     const groupId = req.params.id;

//     // Find the group by ID
//     const group = await Group.findById(groupId);
//     if (!group) {
//       return res.status(404).json({ error: "Group not found" });
//     }

//     // Remove the group ID from the groups array of each user
//     await User.updateMany(
//       { _id: { $in: group.members } },
//       { $pull: { groups: groupId } }
//     );

//     //Delete messages from database
//     await GroupMessage.deleteMany({ groupId: group._id });
//     // Delete the group
//     await Group.findByIdAndDelete(groupId);

//     res.json({ message: "Group deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// Route to add a member to a group by ID
// router.put("/groups/:id/add-member", auth, async (req, res) => {
//   try {
//     const groupId = req.params.id;
//     const { userId } = req.body;

//     // Find the group by ID
//     const group = await Group.findById(groupId);
//     if (!group) {
//       return res.status(404).json({ error: "Group not found" });
//     }

//     // Check if the user already exists in the group
//     if (group.members.includes(userId)) {
//       return res
//         .status(400)
//         .json({ error: "User already exists in the group" });
//     }

//     // Add the user ID to the members array of the group
//     group.members.push(userId);
//     await group.save();

//     // Update the groups array of the user
//     await User.findByIdAndUpdate(userId, { $push: { groups: groupId } });

//     res.json({ message: "Member added to the group successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// Route to remove a member from a group by ID
// router.put("/groups/:id/remove-member", auth, async (req, res) => {
//   try {
//     const groupId = req.params.id;
//     const { userId } = req.body;

//     // Find the group by ID
//     const group = await Group.findById(groupId);
//     if (!group) {
//       return res.status(404).json({ error: "Group not found" });
//     }

//     // Check if the user exists in the group
//     if (!group.members.includes(userId)) {
//       return res
//         .status(400)
//         .json({ error: "User does not exist in the group" });
//     }

//     // Remove the user ID from the members array of the group
//     group.members = group.members.filter(
//       (memberId) => memberId.toString() !== userId
//     );
//     await group.save();

//     // Update the groups array of the user
//     await User.findByIdAndUpdate(userId, { $pull: { groups: groupId } });

//     res.json({ message: "Member removed from the group successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

//---------------------------messages --------------------------------

// Route to save a message in a group by ID
router.post("/:id/messages", auth, async (req, res) => {
  try {
    const groupId = req.params.id;
    const { text, uri } = req.body;
    console.log(req.body);
    // Find the group by ID
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Create a new message object
    if (uri) {
      const message = new GroupMessage({
        groupId,
        senderId: req.user._id,
        name: req.user.fullName,
        uri,
      });
      // Save the message to the database
      const result = await message.save();
      // Add the message ID to the messages array of the group
      group.messages.push(message._id);
      await group.save();

      res.send(result);
    } else if (text) {
      const message = new GroupMessage({
        groupId,
        senderId: req.user._id,
        name: req.user.fullName,
        text,
      });
      // Save the message to the database
      const result = await message.save();
      // Add the message ID to the messages array of the group
      group.messages.push(message._id);
      await group.save();

      res.send(result);
    } else {
      return res.status(400).send("no text or image sent");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
// get messages
router.get("/:id/messages", auth, async (req, res) => {
  try {
    const groupId = req.params.id;

    // Find the group by ID
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Populate the messages
    await group.populate("messages");

    res.json({ messages: group.messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:id/latest-messages", auth, async (req, res) => {
  const groupId = req.params.id;
  const { date } = req.body;
  console.log(date);
  try {
    const messages = await GroupMessage.find({
      groupId,
      createdAt: { $gt: date },
    });
    console.log(messages);
    res.send(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to delete a message by ID
// router.delete("/messages/:id", auth, async (req, res) => {
//   try {
//     const messageId = req.params.id;

//     // Find the message by ID
//     const message = await GroupMessage.findById(messageId);
//     if (!message) {
//       return res.status(404).json({ error: "Message not found" });
//     }

//     // Delete the message from the database
//     await message.remove();

//     // Remove the message ID from the messages array of the corresponding group
//     const groupId = message.groupId;
//     const group = await Group.findById(groupId);
//     if (!group) {
//       return res.status(404).json({ error: "Group not found" });
//     }

//     // Filter out the deleted message ID from the messages array
//     group.messages = group.messages.filter(
//       (messageId) => messageId.toString() !== message._id.toString()
//     );

//     // Save the updated group to the database
//     await group.save();

//     res.json({ message: "Message deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

module.exports = router;
