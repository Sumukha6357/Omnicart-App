import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Navbar from '../../components/Navbar'
import userSlice from '../../redux/userSlice'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

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

const renderWithProviders = (component, { initialState = {} } = {}) => {
  const store = createMockStore(initialState)
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  )
}

describe('Navbar', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
  })

  test('renders logo and navigation links', () => {
    renderWithProviders(<Navbar />)

    expect(screen.getByText('OmniCart')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Products')).toBeInTheDocument()
  })

  test('shows login and signup links when user is not authenticated', () => {
    const initialState = {
      user: {
        token: null,
        user: null,
        loading: false,
        error: null,
      },
    }

    renderWithProviders(<Navbar />, { initialState })

    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Signup')).toBeInTheDocument()
  })

  test('shows user menu when user is authenticated', () => {
    const initialState = {
      user: {
        token: 'mock-token',
        user: {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'CUSTOMER',
        },
        loading: false,
        error: null,
      },
    }

    renderWithProviders(<Navbar />, { initialState })

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  test('shows different navigation based on user role', () => {
    const adminState = {
      user: {
        token: 'mock-token',
        user: {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'ADMIN',
        },
        loading: false,
        error: null,
      },
    }

    renderWithProviders(<Navbar />, { initialState: adminState })

    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  test('handles logout correctly', () => {
    const initialState = {
      user: {
        token: 'mock-token',
        user: {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'CUSTOMER',
        },
        loading: false,
        error: null,
      },
    }

    renderWithProviders(<Navbar />, { initialState })

    const logoutButton = screen.getByText('Logout')
    expect(logoutButton).toBeInTheDocument()
  })
})
