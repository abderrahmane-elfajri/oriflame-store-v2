import React, { createContext, useContext, useEffect, useState } from 'react';
import databaseManager from '../services/databaseManager';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@oriflame.com';

  // Mock users storage (in real app, this would be in database)
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('oriflame_users');
    const existingUsers = savedUsers ? JSON.parse(savedUsers) : [];
    
    // Always ensure admin user exists
    const adminExists = existingUsers.find(u => u.email === 'admin@oriflame.com');
    if (!adminExists) {
      existingUsers.push({ 
        email: 'admin@oriflame.com', 
        password: 'admin123secure', 
        role: 'admin',
        id: 'admin-1'
      });
      localStorage.setItem('oriflame_users', JSON.stringify(existingUsers));
    }
    
    return existingUsers;
  });

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('oriflame_current_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAdmin(user?.email === adminEmail);
    }
    setLoading(false);
  }, [adminEmail]);

  async function signup(email, password) {
    try {
      // Check if user already exists
      const existingUser = users.find(user => user.email === email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Create new user
      const newUser = { 
        email, 
        password, 
        role: email === adminEmail ? 'admin' : 'customer',
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('oriflame_users', JSON.stringify(updatedUsers));
      
      // Try to add to SQLite database (non-blocking)
      try {
        console.log('🔄 Attempting to save user to SQLite database...');
        const result = await databaseManager.addUser(newUser);
        if (result && result.success) {
          console.log('✅ User successfully saved to SQLite database');
        } else {
          console.log('⚠️ User saved locally but SQLite sync may have failed');
        }
      } catch (dbError) {
        console.log('⚠️ User saved locally only (SQLite failed):', dbError.message);
      }
      
      // Auto login after signup
      const userWithoutPassword = { 
        email: newUser.email, 
        role: newUser.role, 
        id: newUser.id,
        uid: newUser.id
      };
      setCurrentUser(userWithoutPassword);
      setIsAdmin(userWithoutPassword.email === adminEmail);
      localStorage.setItem('oriflame_current_user', JSON.stringify(userWithoutPassword));
      
      return { user: userWithoutPassword };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      // Find user
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Login user
      const userWithoutPassword = { 
        email: user.email, 
        role: user.role, 
        id: user.id,
        uid: user.id
      };
      setCurrentUser(userWithoutPassword);
      setIsAdmin(userWithoutPassword.email === adminEmail);
      localStorage.setItem('oriflame_current_user', JSON.stringify(userWithoutPassword));
      
      return { user: userWithoutPassword };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async function logout() {
    try {
      setCurrentUser(null);
      setIsAdmin(false);
      localStorage.removeItem('oriflame_current_user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Helper function to get all users (for admin dashboard)
  function getAllUsers() {
    return users.map(user => ({
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }));
  }

  // Helper function to get users from SQLite database
  async function getUsersFromDatabase() {
    try {
      const dbUsers = await databaseManager.getUsers();
      console.log('📊 Retrieved users from SQLite database:', dbUsers.length);
      return dbUsers;
    } catch (error) {
      console.error('❌ Failed to get users from SQLite database:', error);
      return [];
    }
  }

  const value = {
    currentUser,
    isAdmin,
    signup,
    login,
    logout,
    getAllUsers,
    getUsersFromDatabase,
    users
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
