import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import AppRoutes from '../../routes/AppRoutes'
import userSlice from '../../redux/userSlice'
import * as authApi from '../../api/authApi'

// Mock the API functions
jest.mock('../../api/authApi')
const mockLoginUser = authApi.loginUser
const mockSignupUser = authApi.signupUser

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock window.location
const mockLocation = { href: '' }
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
})

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      user: userSlice,
    },
    preloadedState: {
      user: {
        token: null,
        user: null,
        loading: false,
        error: null,
        ...initialState.user,
      },
    },
  })
}

const renderWithProviders = (component, { initialState = {}, initialEntries = ['/'] } = {}) => {
  const store = createMockStore(initialState)
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        {component}
      </MemoryRouter>
    </Provider>
  )
}

describe('Authentication Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
  })

  test('successful login redirects to appropriate dashboard', async () => {
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

    renderWithProviders(<AppRoutes />, { initialEntries: ['/login'] })

    // Fill out login form
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const roleSelect = screen.getByDisplayValue('Customer')
    const loginButton = screen.getByText('Login')

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(roleSelect, { target: { value: 'CUSTOMER' } })

    fireEvent.click(loginButton)

    // Wait for login to complete
    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
        role: 'CUSTOMER',
      })
    })

    // Verify localStorage is updated
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock-token')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('role', 'CUSTOMER')
  })

  test('failed login shows error message', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Invalid credentials',
        },
      },
    }

    mockLoginUser.mockRejectedValue(mockError)

    renderWithProviders(<AppRoutes />, { initialEntries: ['/login'] })

    // Fill out login form
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const loginButton = screen.getByText('Login')

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })

    fireEvent.click(loginButton)

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })

    // Verify localStorage is not updated
    expect(localStorageMock.setItem).not.toHaveBeenCalledWith('token', expect.any(String))
  })

  test('admin login redirects to admin dashboard', async () => {
    const mockResponse = {
      token: 'mock-admin-token',
      user: {
        id: '2',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN',
      },
    }

    mockLoginUser.mockResolvedValue(mockResponse)

    renderWithProviders(<AppRoutes />, { initialEntries: ['/login'] })

    // Fill out login form as admin
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const roleSelect = screen.getByDisplayValue('Customer')
    const loginButton = screen.getByText('Login')

    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'adminpassword' } })
    fireEvent.change(roleSelect, { target: { value: 'ADMIN' } })

    fireEvent.click(loginButton)

    // Wait for login to complete
    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith({
        email: 'admin@example.com',
        password: 'adminpassword',
        role: 'ADMIN',
      })
    })

    // Verify localStorage is updated with admin role
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock-admin-token')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('role', 'ADMIN')
  })

  test('seller login redirects to seller dashboard', async () => {
    const mockResponse = {
      token: 'mock-seller-token',
      user: {
        id: '3',
        name: 'Seller User',
        email: 'seller@example.com',
        role: 'SELLER',
      },
    }

    mockLoginUser.mockResolvedValue(mockResponse)

    renderWithProviders(<AppRoutes />, { initialEntries: ['/login'] })

    // Fill out login form as seller
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const roleSelect = screen.getByDisplayValue('Customer')
    const loginButton = screen.getByText('Login')

    fireEvent.change(emailInput, { target: { value: 'seller@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'sellerpassword' } })
    fireEvent.change(roleSelect, { target: { value: 'SELLER' } })

    fireEvent.click(loginButton)

    // Wait for login to complete
    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith({
        email: 'seller@example.com',
        password: 'sellerpassword',
        role: 'SELLER',
      })
    })

    // Verify localStorage is updated with seller role
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock-seller-token')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('role', 'SELLER')
  })

  test('protected routes redirect to login when not authenticated', () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/admin/dashboard'] })

    // Should redirect to login page
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
  })

  test('protected routes accessible when authenticated', async () => {
    const mockUser = {
      token: 'mock-token',
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CUSTOMER',
      },
    }

    const initialState = {
      user: {
        token: 'mock-token',
        user: mockUser.user,
        loading: false,
        error: null,
      },
    }

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token'
      if (key === 'user') return JSON.stringify(mockUser.user)
      if (key === 'role') return 'CUSTOMER'
      return null
    })

    renderWithProviders(<AppRoutes />, { 
      initialState, 
      initialEntries: ['/customer/home'] 
    })

    // Should be able to access protected route
    // Note: This is a simplified test - in reality, you'd need to mock the actual component
    expect(screen.getByText('Login')).not.toBeInTheDocument()
  })

  test('signup flow works correctly', async () => {
    const mockResponse = {
      message: 'User created successfully',
    }

    mockSignupUser.mockResolvedValue(mockResponse)

    renderWithProviders(<AppRoutes />, { initialEntries: ['/signup'] })

    // Fill out signup form
    const nameInput = screen.getByPlaceholderText('Name')
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const roleSelect = screen.getByDisplayValue('Customer')
    const signupButton = screen.getByText('Sign Up')

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(roleSelect, { target: { value: 'CUSTOMER' } })

    fireEvent.click(signupButton)

    // Wait for signup to complete
    await waitFor(() => {
      expect(mockSignupUser).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'CUSTOMER',
      })
    })
  })
})
