import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { removeItem, fetchCart } from "../redux/cartSlice"

export default function Cart({ placeOrder }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { products } = useSelector(state => state.product)
  const cart = useSelector(state => state.cart.cartItems) || [];

  const handleCheckout = () => {
    placeOrder();
    navigate("/checkout")
  }

  // Calculate total using latest product price
  const total = cart.reduce((acc, item) => {
    const product = products.find(p => p.id === item.productId);
    const price = product ? product.price : item.price;
    return acc + price * item.quantity;
  }, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/")}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800 font-bold"
      >
        <span className="text-2xl mr-1">&#60;</span> Home
      </button>
      <h2 className="text-2xl font-bold mb-4">Your Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => {
            const product = products.find(p => p.id === item.productId);
            return (
              <div key={item.productId} className="flex items-center justify-between border-b py-4">
                <div className="flex items-center gap-4">
                  <img src={product?.imageUrl || "/placeholder.jpg"} alt={product?.name || "Product"} className="w-16 h-16 object-contain border rounded" />
                  <div>
                    <p className="font-semibold">{product?.name || "Unnamed Product"}</p>
                    <p>₹{product?.price ?? item.price} x {item.quantity}</p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    const user = JSON.parse(localStorage.getItem('user'));
                    const userId = user?.id;
                    if (!userId) {
                      alert('You must be logged in to remove from cart.');
                      return;
                    }
                    await dispatch(removeItem({ userId, productId: item.productId }));
                    await dispatch(fetchCart({ userId }));
                  }}
                  className="ml-4 text-red-600 hover:text-red-800 font-bold"
                >
                  Remove
                </button>
              </div>
            );
          })}
          <div className="text-right mt-6 flex flex-col items-end gap-2">
            <p className="text-xl font-bold">Total: ₹{total}</p>
            <button
              onClick={handleCheckout}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View Order History
            </button>
          </div>
        </>
      )}
    </div>
  )
}
