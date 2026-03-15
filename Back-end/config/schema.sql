-- ═══════════════════════════════════════════════════
--  TalentLaunch Rwanda — MySQL Database Schema
--  Run this file once to set up all tables:
--    mysql -u root -p < config/schema.sql
-- ═══════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS talentlaunch
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE talentlaunch;

-- ─────────────────────────────────────
--  USERS
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           INT          NOT NULL AUTO_INCREMENT,
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  password     VARCHAR(255) NOT NULL,
  role         ENUM('youth','admin') NOT NULL DEFAULT 'youth',
  location     VARCHAR(100),
  bio          TEXT,
  avatar_url   VARCHAR(255),
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_email (email)
);

-- ─────────────────────────────────────
--  MENTORS
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS mentors (
  id           INT          NOT NULL AUTO_INCREMENT,
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  specialty    VARCHAR(150) NOT NULL,
  bio          TEXT,
  avatar_url   VARCHAR(255),
  contact_info VARCHAR(255),
  is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- ─────────────────────────────────────
--  WORKSHOPS
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS workshops (
  id           INT          NOT NULL AUTO_INCREMENT,
  title        VARCHAR(200) NOT NULL,
  description  TEXT         NOT NULL,
  mentor_id    INT,
  date         DATETIME     NOT NULL,
  location     VARCHAR(200),
  capacity     INT          NOT NULL DEFAULT 30,
  status       ENUM('upcoming','live','completed','cancelled') NOT NULL DEFAULT 'upcoming',
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE SET NULL
);

-- ─────────────────────────────────────
--  WORKSHOP ENROLLMENTS
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS workshop_enrollments (
  id           INT       NOT NULL AUTO_INCREMENT,
  user_id      INT       NOT NULL,
  workshop_id  INT       NOT NULL,
  enrolled_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_enrollment (user_id, workshop_id),
  FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE CASCADE,
  FOREIGN KEY (workshop_id) REFERENCES workshops(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────
--  TALENT SHOWCASE
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS talents (
  id           INT          NOT NULL AUTO_INCREMENT,
  user_id      INT          NOT NULL,
  title        VARCHAR(200) NOT NULL,
  description  TEXT         NOT NULL,
  category     VARCHAR(100) NOT NULL,
  file_url     VARCHAR(255),
  file_type    VARCHAR(50),
  views        INT          NOT NULL DEFAULT 0,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_category (category),
  INDEX idx_user    (user_id)
);