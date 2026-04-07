import { configureStore } from '@reduxjs/toolkit'
import userSlice, { login, signup } from '../../redux/userSlice'
import { loginUser, signupUser } from '../../api/authApi'

// Mock the API functions
jest.mock('../../api/authApi')
const mockLoginUser = loginUser
const mockSignupUser = signupUser

describe('userSlice', () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userSlice,
      },
      preloadedState: {
        user: {
          token: null,
          user: null,
          loading: false,
          error: null,
        },
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('initial state', () => {
    test('should have correct initial state', () => {
      const state = store.getState().user
      expect(state.token).toBeNull()
      expect(state.user).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('login thunk', () => {
    test('should handle successful login', async () => {
      const mockResponse = {
        token: 'mock-token',
        user: {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'CUSTOMER',
        },
      }

      mockLoginUser.mockResolvedValue(mockResponse)

      await store.dispatch(login({
        email: 'john@example.com',
        password: 'password123',
        role: 'CUSTOMER',
      }))

      const state = store.getState().user
      expect(state.loading).toBe(false)
      expect(state.token).toBe('mock-token')
      expect(state.user).toEqual(mockResponse.user)
      expect(state.error).toBeNull()
      expect(mockLoginUser).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
        role: 'CUSTOMER',
      })
    })

    test('should handle login failure', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Invalid credentials',
          },
        },
      }

      mockLoginUser.mockRejectedValue(mockError)

      await store.dispatch(login({
        email: 'john@example.com',
        password: 'wrongpassword',
        role: 'CUSTOMER',
      }))

      const state = store.getState().user
      expect(state.loading).toBe(false)
      expect(state.token).toBeNull()
      expect(state.user).toBeNull()
      expect(state.error).toBe('Invalid credentials')
    })

    test('should handle login failure without error message', async () => {
      mockLoginUser.mockRejectedValue(new Error('Network error'))

      await store.dispatch(login({
        email: 'john@example.com',
        password: 'password123',
        role: 'CUSTOMER',
      }))

      const state = store.getState().user
      expect(state.loading).toBe(false)
      expect(state.token).toBeNull()
      expect(state.user).toBeNull()
      expect(state.error).toBe('Login failed')
    })

    test('should set loading to true during login', async () => {
      mockLoginUser.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

      const action = store.dispatch(login({
        email: 'john@example.com',
        password: 'password123',
        role: 'CUSTOMER',
      }))

      expect(store.getState().user.loading).toBe(true)

      await action
      expect(store.getState().user.loading).toBe(false)
    })
  })

  describe('signup thunk', () => {
    test('should handle successful signup', async () => {
      const mockResponse = {
        message: 'User created successfully',
      }

      mockSignupUser.mockResolvedValue(mockResponse)

      await store.dispatch(signup({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'CUSTOMER',
      }))

      const state = store.getState().user
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
      expect(mockSignupUser).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'CUSTOMER',
      })
    })

    test('should handle signup failure', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Email already exists',
          },
        },
      }

      mockSignupUser.mockRejectedValue(mockError)

      await store.dispatch(signup({
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'password123',
        role: 'CUSTOMER',
      }))

      const state = store.getState().user
      expect(state.loading).toBe(false)
      expect(state.error).toBe('Email already exists')
    })
  })

  describe('logout reducer', () => {
    test('should clear user state on logout', () => {
      // Set initial state with user data
      store.dispatch({
        type: 'user/login/fulfilled',
        payload: {
          token: 'mock-token',
          user: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'CUSTOMER',
          },
        },
      })

      expect(store.getState().user.token).toBe('mock-token')
      expect(store.getState().user.user).not.toBeNull()

      // Dispatch logout action
      store.dispatch({ type: 'user/logout' })

      const state = store.getState().user
      expect(state.token).toBeNull()
      expect(state.user).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })
})
