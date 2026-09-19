-- =========================================================
-- StudentHUB Database Schema
-- PostgreSQL
-- =========================================================


-- ---------------------------------------------------------
-- USERS
-- Stores registered StudentHUB accounts.
-- Passwords are stored only as bcrypt hashes.
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,

  username VARCHAR(50) NOT NULL,
  password_hash TEXT NOT NULL,

  name VARCHAR(100) NOT NULL,
  yearofstudy VARCHAR(20) NOT NULL,
  program VARCHAR(100) NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Usernames are case-insensitively unique.
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_lower
  ON users (LOWER(username));


-- ---------------------------------------------------------
-- CHAT GROUPS
-- Represents course-based StudentHUB communities.
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS chat_groups (
  id SERIAL PRIMARY KEY,

  yearofstudy INTEGER NOT NULL
    CHECK (yearofstudy > 0),

  course_code VARCHAR(30) NOT NULL,
  course_name VARCHAR(150) NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prevent duplicate course groups.
CREATE UNIQUE INDEX IF NOT EXISTS idx_chat_groups_course_code
  ON chat_groups (course_code);


-- ---------------------------------------------------------
-- MESSAGES
-- Stores persistent messages for each course group.
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,

  group_id INTEGER NOT NULL
    REFERENCES chat_groups(id)
    ON DELETE CASCADE,

  senderid INTEGER NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,

  sendername VARCHAR(120) NOT NULL,
  senderyear VARCHAR(20) NOT NULL,
  senderprogram VARCHAR(150) NOT NULL,

  content TEXT NOT NULL
    CHECK (
      char_length(content) BETWEEN 1 AND 2000
    ),

  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ---------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_messages_group_timestamp
  ON messages (group_id, timestamp);

CREATE INDEX IF NOT EXISTS idx_messages_sender
  ON messages (senderid);


-- ---------------------------------------------------------
-- DEMO COURSE GROUPS
-- Creates portfolio/demo groups without duplicating them
-- when the schema is executed more than once.
-- ---------------------------------------------------------

INSERT INTO chat_groups (
  yearofstudy,
  course_code,
  course_name
)
VALUES
  (
    3,
    'EECS 2311',
    'Software Development Project'
  ),
  (
    3,
    'EECS 3311',
    'Software Design'
  ),
  (
    3,
    'EECS 3421',
    'Introduction to Database Systems'
  ),
  (
    3,
    'EECS 3216',
    'Computer Network Protocols and Applications'
  ),
  (
    3,
    'EECS 3342',
    'System Specification and Refinement'
  ),
  (
    2,
    'EECS 2030',
    'Advanced Object Oriented Programming'
  ),
  (
    2,
    'EECS 2101',
    'Fundamentals of Data Structures'
  )
ON CONFLICT (course_code)
DO NOTHING;
