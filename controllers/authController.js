// controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { pool } = require('../config/db');
const { validationResult } = require('express-validator');

function signToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// ── POST /api/auth/register ──────────────────────────
async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, password, location } = req.body;

  try {
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1', [email]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Email is already registered.' });
    }

    const hashed = await bcrypt.hash(password, 12);

    const result = await pool.query(
      'INSERT INTO users (name, email, password, location) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, hashed, location || null]
    );

    const user = { id: result.rows[0].id, name, email, role: 'youth' };
    const token = signToken(user);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: { id: user.id, name, email, role: 'youth', location: location || null },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}

// ── POST /api/auth/login ─────────────────────────────
async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT id, name, email, password, role, location, bio, avatar_url FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = signToken(user);
    const { password: _pw, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}

// ── POST /api/auth/admin (protected, admin-only) ─────
async function createAdmin(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, password, location } = req.body;

  try {
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1', [email]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Email is already registered.' });
    }

    const hashed = await bcrypt.hash(password, 12);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role, location) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, email, hashed, 'admin', location || null]
    );

    const user = {
      id: result.rows[0].id,
      name,
      email,
      role: 'admin',
      location: location || null,
    };

    return res.status(201).json({
      success: true,
      message: 'Admin account created successfully.',
      user,
    });
  } catch (err) {
    console.error('Create admin error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}

// ── GET /api/auth/me (protected) ─────────────────────
async function getMe(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, location, bio, avatar_url, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.status(200).json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('GetMe error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
}

// ── PUT /api/auth/me (protected) ─────────────────────
async function updateProfile(req, res) {
  try {
    const { name, email, location, bio } = req.body;
    const avatar_url = req.file ? `/uploads/${req.file.filename}` : undefined;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    const currentRows = await pool.query(
      'SELECT id, email FROM users WHERE id = $1', [req.user.id]
    );
    if (currentRows.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const currentUser = currentRows.rows[0];

    if (email !== currentUser.email) {
      const emailCheck = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2', [email, req.user.id]
      );
      if (emailCheck.rows.length > 0) {
        return res.status(409).json({ success: false, message: 'Email is already in use by another account.' });
      }
    }

    const fields = [];
    const values = [];
    let paramCount = 1;

    fields.push(`name = $${paramCount++}`);     values.push(name);
    fields.push(`email = $${paramCount++}`);    values.push(email);
    fields.push(`location = $${paramCount++}`); values.push(location || null);
    fields.push(`bio = $${paramCount++}`);      values.push(bio || null);

    if (avatar_url !== undefined) {
      fields.push(`avatar_url = $${paramCount++}`);
      values.push(avatar_url);
    }

    values.push(req.user.id);

    await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount}`,
      values
    );

    const updatedResult = await pool.query(
      'SELECT id, name, email, role, location, bio, avatar_url, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    const updatedUser = updatedResult.rows[0];
    const newToken = signToken(updatedUser);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      token: newToken,
      user: updatedUser,
    });
  } catch (err) {
    console.error('UpdateProfile error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
}

module.exports = { register, login, createAdmin, getMe, updateProfile };
