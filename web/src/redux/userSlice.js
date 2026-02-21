import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { loginUser, signupUser } from "../api/authApi"
import {
  saveToken,
  saveUser,
  clearToken,
  clearUser,
  getToken,
  getUser,
} from "../utils/authUtils"

function decodeJWT(token) {
  const payload = token.split(".")[1]
  const decoded = JSON.parse(atob(payload))
  return {
    id: decoded.sub,
    role: decoded.role,
    exp: decoded.exp,
  }
}

const initialState = {
  token: getToken(),
  user: getUser(),
  loading: false,
  error: null,
}

export const login = createAsyncThunk("user/login", async (credentials, thunkAPI) => {
  try {
    const response = await loginUser(credentials) // expects { token, user: { id, name, email, role } }
    const token = response.token
    const decoded = decodeJWT(token)
    const fullUser = {
      ...decoded,
      name: response.user.name,
      email: response.user.email,
      role: response.user.role,
    }

    saveToken(token)
    saveUser(fullUser)
    return { token, user: fullUser }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed")
  }
})

export const signup = createAsyncThunk("user/signup", async (userDetails, thunkAPI) => {
  try {
    const data = await signupUser(userDetails)
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Signup failed")
  }
})

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      state.user = null
      clearToken()
      clearUser()
    },
    updateName(state, action) {
      if (state.user) {
        state.user.name = action.payload;
        saveUser(state.user);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
        localStorage.setItem("role", action.payload.user.role);

        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(signup.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, updateName } = userSlice.actions
export default userSlice.reducer
