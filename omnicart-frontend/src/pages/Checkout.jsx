import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import { placeOrderThunk } from "../redux/orderSlice"
import { clearCart, addItem, removeItem, fetchCart } from "../redux/cartSlice"
import { useNavigate, useLocation } from "react-router-dom"
import { getProductById } from "../redux/productSlice"

export default function Checkout() {
  const { cartItems } = useSelector((state) => state.cart)
  const { products } = useSelector((state) => state.product)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [address, setAddress] = useState("")
  const [paymentMode, setPaymentMode] = useState("COD")

  // Check for buyNow mode via query params
  const searchParams = new URLSearchParams(location.search);
  const buyNow = searchParams.get("buyNow") === "1";
  const buyNowProductId = searchParams.get("productId");
  const buyNowQuantity = parseInt(searchParams.get("quantity"), 10) || 1;

  // For Buy Now, fetch product if not present
  useEffect(() => {
    if (buyNow && buyNowProductId) {
      const product = products.find(p => String(p.id) === String(buyNowProductId));
      if (!product) {
        dispatch(getProductById(buyNowProductId));
      }
    }
  }, [buyNow, buyNowProductId, products, dispatch]);

  let displayItems = cartItems;
  // For single product fallback
  const singleProduct = useSelector((state) => state.product.product);
  const productLoading = useSelector((state) => state.product.loading);

  if (buyNow && buyNowProductId) {
    let product = products.find(p => String(p.id) === String(buyNowProductId));
    if (!product && singleProduct && String(singleProduct.id) === String(buyNowProductId)) {
      product = singleProduct;
    }
    if (product) {
      displayItems = [{ productId: product.id, quantity: buyNowQuantity, price: product.price, name: product.name }];
    } else {
      displayItems = [];
    }
  }

  // Calculate total using latest product price
  const total = displayItems.reduce((acc, item) => {
    const product = products.find(p => p.id === item.productId);
    const price = product ? product.price : item.price;
    return acc + price * item.quantity;
  }, 0);

  // Quantity change handler
  const handleQuantityChange = (item, newQuantity) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
    if (!userId) return;
    if (newQuantity < 1) return;
    // Remove and re-add with new quantity
    dispatch(removeItem({ userId, productId: item.productId })).then(() => {
      dispatch(addItem({ userId, productId: item.productId, quantity: newQuantity })).then(() => {
        dispatch(fetchCart({ userId }));
      });
    });
  };

  const handlePlaceOrder = async () => {
    // Get userId from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
    if (!userId) {
      alert('You must be logged in to place an order.');
      navigate('/login');
      return;
    }
    const orderData = {
      items: displayItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      address,
      total,
    }
    await dispatch(placeOrderThunk({ userId, orderRequest: orderData }))
    if (!buyNow) dispatch(clearCart())
    navigate("/payment", { state: { orderDetails: orderData } })
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6">🧾 Checkout</h2>

        {/* Shipping Info */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Shipping Address</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded"
            placeholder="123 Main Street, Bangalore, IN"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
        </div>

        {/* Payment Method removed, now handled in Payment page */}

        {/* Cart or Buy Now Items with Quantity Controls */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Your Items</h3>
          {buyNow && productLoading && displayItems.length === 0 && (
            <div>Loading product details...</div>
          )}
          {!productLoading && displayItems.length === 0 && (
            <div>No items to checkout.</div>
          )}
          {displayItems.map(item => {
            // Use name and price from item if present (for buyNow), else fallback to products array
            let product = products.find(p => p.id === item.productId);
            if (!product && singleProduct && String(singleProduct.id) === String(item.productId)) {
              product = singleProduct;
            }
            const name = item.name || product?.name || item.productId;
            const price = product?.price ?? item.price;
            return (
              <div key={item.productId} className="flex items-center justify-between border-b py-2">
                <div>
                  <span className="font-semibold">{name}</span>
                  <span className="ml-2 text-gray-600">₹{price}</span>
                </div>
                {!buyNow && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      className="px-2 py-1 bg-gray-200 rounded text-lg"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={e => handleQuantityChange(item, Number(e.target.value))}
                      className="w-14 border rounded text-center"
                    />
                    <button
                      onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-200 rounded text-lg"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Order Summary */}
        <div className="mb-4">
          <p className="text-xl font-bold">Total: ₹{productLoading && buyNow ? '...' : total}</p>
        </div>

        {/* Go Back to Products Page */}
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700 mb-4"
        >
          ← Go Back to Products Page
        </button>
        {/* Place Order */}
        <button
          onClick={handlePlaceOrder}
          className="mt-2 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          🛒 Place Order
        </button>
      </div>
    </div>
  )
}
