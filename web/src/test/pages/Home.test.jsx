import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Home from '../../features/shared/pages/Home'
import productSlice from '../../redux/productSlice'
import userSlice from '../../redux/userSlice'
import cartSlice from '../../redux/cartSlice'
import * as productApi from '../../api/productApi'
import * as categoryApi from '../../api/categoryApi'

// Mock the API functions
jest.mock('../../api/productApi')
jest.mock('../../api/categoryApi')

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock useNavigate
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      product: productSlice,
      user: userSlice,
      cart: cartSlice,
    },
    preloadedState: {
      product: {
        products: [],
        product: null,
        loading: false,
        error: null,
        ...initialState.product,
      },
      user: {
        token: null,
        user: null,
        loading: false,
        error: null,
        ...initialState.user,
      },
      cart: {
        cartItems: [],
        loading: false,
        error: null,
        ...initialState.cart,
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

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockClear()
  })

  test('renders loading state initially', () => {
    const initialState = {
      product: {
        loading: true,
        products: [],
        error: null,
      },
    }

    renderWithProviders(<Home />, { initialState })

    expect(screen.getByText('Loading products...')).toBeInTheDocument()
  })

  test('renders error state when API fails', () => {
    const initialState = {
      product: {
        loading: false,
        products: [],
        error: 'Failed to fetch products',
      },
    }

    renderWithProviders(<Home />, { initialState })

    expect(screen.getByText('Failed to fetch products')).toBeInTheDocument()
  })

  test('renders products when data is loaded', async () => {
    const mockProducts = [
      {
        id: '1',
        name: 'Test Product 1',
        price: 99.99,
        categoryName: 'Electronics',
        imageUrl: 'test-image-1.jpg',
      },
      {
        id: '2',
        name: 'Test Product 2',
        price: 149.99,
        categoryName: 'Books',
        imageUrl: 'test-image-2.jpg',
      },
    ]

    const initialState = {
      product: {
        loading: false,
        products: mockProducts,
        error: null,
      },
    }

    renderWithProviders(<Home />, { initialState })

    expect(screen.getByText('Test Product 1')).toBeInTheDocument()
    expect(screen.getByText('Test Product 2')).toBeInTheDocument()
    expect(screen.getByText('Rs. 99.99')).toBeInTheDocument()
    expect(screen.getByText('Rs. 149.99')).toBeInTheDocument()
    expect(screen.getByText('Electronics')).toBeInTheDocument()
    expect(screen.getByText('Books')).toBeInTheDocument()
  })

  test('renders no products message when products array is empty', () => {
    const initialState = {
      product: {
        loading: false,
        products: [],
        error: null,
      },
    }

    renderWithProviders(<Home />, { initialState })

    expect(screen.getByText('No products found.')).toBeInTheDocument()
  })

  test('shows "Add to Cart" button for authenticated customer users', () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'CUSTOMER',
    }

    const initialState = {
      product: {
        loading: false,
        products: [
          {
            id: '1',
            name: 'Test Product',
            price: 99.99,
            categoryName: 'Electronics',
          },
        ],
        error: null,
      },
      user: {
        token: 'mock-token',
        user: mockUser,
        loading: false,
        error: null,
      },
    }

    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser))

    renderWithProviders(<Home />, { initialState })

    expect(screen.getByText('Add to Cart')).toBeInTheDocument()
  })

  test('shows "Login to Buy" button for unauthenticated users', () => {
    const initialState = {
      product: {
        loading: false,
        products: [
          {
            id: '1',
            name: 'Test Product',
            price: 99.99,
            categoryName: 'Electronics',
          },
        ],
        error: null,
      },
      user: {
        token: null,
        user: null,
        loading: false,
        error: null,
      },
    }

    renderWithProviders(<Home />, { initialState })

    expect(screen.getByText('Login to Buy')).toBeInTheDocument()
  })

  test('handles search functionality', async () => {
    const initialState = {
      product: {
        loading: false,
        products: [
          {
            id: '1',
            name: 'Test Product',
            price: 99.99,
            categoryName: 'Electronics',
          },
        ],
        error: null,
      },
    }

    renderWithProviders(<Home />, { initialState })

    const searchInput = screen.getByPlaceholderText('Search products...')
    expect(searchInput).toBeInTheDocument()

    fireEvent.change(searchInput, { target: { value: 'test search' } })

    await waitFor(() => {
      // Verify that the search value is updated
      expect(searchInput.value).toBe('test search')
    })
  })

  test('renders hero section', () => {
    const initialState = {
      product: {
        loading: false,
        products: [],
        error: null,
      },
    }

    renderWithProviders(<Home />, { initialState })

    expect(screen.getByText('Upgrade your cart with trending picks and flash prices.')).toBeInTheDocument()
    expect(screen.getByText('Fresh arrivals')).toBeInTheDocument()
  })

  test('renders breadcrumbs', () => {
    const initialState = {
      product: {
        loading: false,
        products: [],
        error: null,
      },
    }

    renderWithProviders(<Home />, { initialState })

    expect(screen.getByText('Home')).toBeInTheDocument()
  })
})
