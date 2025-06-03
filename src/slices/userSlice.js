import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get user info from localStorage
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
  loading: false,
  error: null,
  users: [],
  success: false,
  successDelete: false,
  successUpdate: false,
  loadingUpdate: false,
  errorUpdate: null,
};

// Login user
export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/users/login',
        { email, password },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Register user
export const register = createAsyncThunk(
  'user/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/users',
        { name, email, password },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get user profile
export const getUserDetails = createAsyncThunk(
  'user/getUserDetails',
  async (id, { getState, rejectWithValue }) => {
    try {
      console.log('getUserDetails called with id:', id);
      
      const {
        user: { userInfo },
      } = getState();

      if (!userInfo) {
        console.error('No userInfo found in state');
        return rejectWithValue('Not authorized, no token');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      console.log('Making API call to:', `/api/users/${id}`);
      const { data } = await axios.get(`/api/users/${id}`, config);
      console.log('getUserDetails response:', data);

      return data;
    } catch (error) {
      console.error('getUserDetails error:', error);
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (user, { getState, rejectWithValue }) => {
    try {
      const {
        user: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put('/api/users/profile', user, config);

      localStorage.setItem('userInfo', JSON.stringify(data));

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get all users
export const getUsers = createAsyncThunk(
  'user/getUsers',
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        user: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get('/api/users', config);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id, { getState, rejectWithValue }) => {
    try {
      const {
        user: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.delete(`/api/users/${id}`, config);

      return id; // Return the id of the deleted user
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Update user (by Admin)
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user, { getState, rejectWithValue }) => {
    try {
      const {
        user: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/users/${user._id}`,
        user,
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.user = null;
      state.users = []; // Clear users list on logout
      state.error = null;
      state.success = false; // Reset success for profile update
      state.successDelete = false; // Reset success for user delete
      state.successUpdate = false; // Reset user update by admin status
      localStorage.removeItem('userInfo');
      // Also clear cart data
      localStorage.removeItem('cartItems');
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');
      // Redirect to login page will be handled in the component
    },
    clearError: (state) => {
      state.error = null;
    },
    resetUserUpdate: (state) => {
      state.loadingUpdate = false;
      state.errorUpdate = null;
      state.successUpdate = false;
    },
    resetDeleteUser: (state) => {
      state.successDelete = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get user details
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.user = null; // Clear previous user details
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.success = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get all users
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successDelete = true;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user (by Admin)
      .addCase(updateUser.pending, (state) => {
        state.loadingUpdate = true;
        state.errorUpdate = null;
        state.successUpdate = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loadingUpdate = false;
        state.successUpdate = true;
        state.user = action.payload; // Update the user details in state
        // Optionally, update the users list if needed
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.errorUpdate = action.payload;
      });
  },
});

export const { logout, clearError, resetUserUpdate, resetDeleteUser } = userSlice.actions;

export default userSlice.reducer; 