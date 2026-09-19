const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/auth");

function createChatRouter(io) {
  const router = express.Router();

  // Everything below this point requires a valid JWT.
  router.use(authenticateToken);

  router.get("/groups", async (_req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, yearofstudy, course_code, course_name
         FROM chat_groups
         ORDER BY created_at ASC`
      );

      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching groups:", error);
      res.status(500).json({ error: "Failed to fetch groups" });
    }
  });

  router.get("/messages", async (req, res) => {
    const groupId = Number(req.query.group_id);

    if (!Number.isInteger(groupId) || groupId <= 0) {
      return res.status(400).json({
        error: "A valid group_id is required",
      });
    }

    try {
      const result = await pool.query(
        `SELECT id, senderid, sendername, senderyear,
                senderprogram, content, timestamp, group_id
         FROM messages
         WHERE group_id = $1
         ORDER BY timestamp ASC`,
        [groupId]
      );

      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  router.post("/messages", async (req, res) => {
    const { content, group_id } = req.body;

    const groupId = Number(group_id);
    const cleanContent =
      typeof content === "string" ? content.trim() : "";

    if (
      !Number.isInteger(groupId) ||
      groupId <= 0 ||
      !cleanContent ||
      cleanContent.length > 2000
    ) {
      return res.status(400).json({
        error: "Valid group and message content are required",
      });
    }

    try {
      // Get the sender from the authenticated account,
      // not from values supplied by the frontend.
      const userResult = await pool.query(
        `SELECT id, name, yearofstudy, program
         FROM users
         WHERE id = $1`,
        [req.user.id]
      );

      if (userResult.rows.length === 0) {
        return res.status(401).json({
          error: "Authenticated user no longer exists",
        });
      }

      const user = userResult.rows[0];

      const groupResult = await pool.query(
        "SELECT id FROM chat_groups WHERE id = $1",
        [groupId]
      );

      if (groupResult.rows.length === 0) {
        return res.status(404).json({
          error: "Group not found",
        });
      }

      const result = await pool.query(
        `INSERT INTO messages
          (
            group_id,
            senderid,
            sendername,
            senderyear,
            senderprogram,
            content
          )
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, senderid, sendername, senderyear,
                   senderprogram, content, timestamp, group_id`,
        [
          groupId,
          user.id,
          user.name,
          String(user.yearofstudy),
          user.program,
          cleanContent,
        ]
      );

      const newMessage = result.rows[0];

      io.to(`group:${groupId}`).emit("message:new", newMessage);

      res.status(201).json(newMessage);
    } catch (error) {
      console.error("Error posting message:", error);
      res.status(500).json({
        error: "Failed to post message",
      });
    }
  });

  return router;
}

module.exports = createChatRouter;
