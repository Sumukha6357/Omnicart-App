import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { removeItem, fetchCart } from "../../../redux/cartSlice"

export default function Cart() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { products } = useSelector(state => state.product)
  const cart = useSelector(state => state.cart.cartItems) || []

  const handleCheckout = () => {
    navigate("/checkout")
  }

  // Calculate total using latest product price
  const total = cart.reduce((acc, item) => {
    const product = products.find(p => p.id === item.productId)
    const price = product ? product.price : item.price
    return acc + price * item.quantity
  }, 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          <Link to="/customer/home" className="hover:text-blue-600">Customer</Link>
          <span className="mx-2">/</span>
          <span>Cart</span>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Your Cart</h2>
            <p className="text-sm text-gray-600 dark:text-slate-300">
              Review items and proceed to secure checkout.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-sm">
            <div className="text-sm text-gray-600 dark:text-slate-300">Items</div>
            <div className="text-lg font-bold">{cart.length}</div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center shadow-sm">
            <div className="text-lg font-semibold mb-2">Your cart is empty</div>
            <div className="text-sm text-gray-600 dark:text-slate-300 mb-6">
              Add products to see them here.
            </div>
            <button
              onClick={() => {
                const user = JSON.parse(localStorage.getItem('user'))
                const role = user?.role?.toLowerCase()
                if (role === "customer") {
                  navigate("/customer/home")
                } else {
                  navigate("/")
                }
              }}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const product = products.find(p => p.id === item.productId)
                const price = product?.price ?? item.price
                const subtotal = price * item.quantity
                return (
                  <div
                    key={item.productId}
                    className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-4 sm:p-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={product?.imageUrl || item.imageUrl || "/placeholder.jpg"}
                          alt={product?.name || item.name || "Product"}
                          className="w-20 h-20 object-contain border dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-950"
                        />
                        <div>
                          <p className="font-semibold text-lg">{product?.name || item.name || "Unnamed Product"}</p>
                          <p className="text-sm text-gray-600 dark:text-slate-300">
                            Rs. {price} - Qty {item.quantity}
                          </p>
                          <p className="text-sm font-semibold text-green-600 mt-1">
                            Subtotal: Rs. {subtotal}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          const user = JSON.parse(localStorage.getItem('user'))
                          const userId = user?.id
                          if (!userId) {
                            alert('You must be logged in to remove from cart.')
                            return
                          }
                          await dispatch(removeItem({ userId, productId: item.productId }))
                          await dispatch(fetchCart({ userId }))
                        }}
                        className="sm:self-start text-red-600 hover:text-red-800 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-6 h-fit">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-slate-300 mb-2">
                <span>Subtotal</span>
                <span>Rs. {total}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-slate-300 mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t dark:border-slate-800 my-3"></div>
              <div className="flex items-center justify-between text-lg font-bold mb-4">
                <span>Total</span>
                <span>Rs. {total}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 mb-3"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => navigate('/orders')}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                View Order History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


