import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import { addItem, removeItem, fetchCart } from "../../../redux/cartSlice"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { getProductById } from "../../../redux/productSlice"
import { getAddresses, createAddress, updateAddress, deleteAddress } from "../../../api/addressApi"

export default function Checkout() {
  const { cartItems } = useSelector((state) => state.cart)
  const { products } = useSelector((state) => state.product)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [address, setAddress] = useState("")
  const [paymentMode, setPaymentMode] = useState("COD")
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"))
    } catch {
      return null
    }
  })()
  const userId = storedUser?.id
  const addressKey = (id) => `addresses:${id || "guest"}`
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState("")
  const [addressLabel, setAddressLabel] = useState("")
  const [addressLine, setAddressLine] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(true)

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

  useEffect(() => {
    let active = true
    const loadAddresses = async () => {
      if (!userId) {
        const raw = localStorage.getItem(addressKey(userId))
        const parsed = raw ? JSON.parse(raw) : []
        if (Array.isArray(parsed) && active) {
          setAddresses(parsed)
          if (parsed.length > 0) {
            setSelectedAddressId(parsed[0].id)
            setAddress(parsed[0].text)
            setShowAddressForm(false)
          }
        }
        return
      }
      try {
        const data = await getAddresses(userId)
        if (!active) return
        const list = Array.isArray(data) ? data : []
        setAddresses(list)
        if (list.length > 0) {
          setSelectedAddressId(list[0].id)
          setAddress(list[0].text)
          setShowAddressForm(false)
        } else {
          setSelectedAddressId("")
          setAddress("")
          setShowAddressForm(true)
        }
      } catch (err) {
        if (!active) return
        setAddresses([])
        setSelectedAddressId("")
        setAddress("")
        setShowAddressForm(true)
      }
    }
    loadAddresses()
    return () => {
      active = false
    }
  }, [userId])

  useEffect(() => {
    if (!userId) {
      localStorage.setItem(addressKey(userId), JSON.stringify(addresses))
    }
  }, [addresses, userId])

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
    if (!userId) {
      alert("You must be logged in to place an order.")
      navigate("/login")
      return
    }

    const orderItems = displayItems.map((item) => {
      const product = products.find((p) => p.id === item.productId)
      const price = product?.price ?? item.price
      return {
        productId: item.productId,
        quantity: item.quantity,
        name: item.name,
        price,
      }
    })

    const orderData = {
      items: orderItems,
      products: displayItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      address,
      total,
      buyNow,
    }

    navigate("/payment", {
      state: {
        orderDetails: orderData,
      },
    })
  }

  const handleDeleteAddress = async (addrId) => {
    if (userId) {
      try {
        await deleteAddress(addrId)
      } catch (err) {
        alert("Failed to delete address. Please try again.")
        return
      }
    }
    const next = addresses.filter((a) => a.id !== addrId)
    setAddresses(next)
    if (selectedAddressId === addrId) {
      const nextSelected = next[0]
      setSelectedAddressId(nextSelected?.id || "")
      setAddress(nextSelected?.text || "")
      setShowAddressForm(next.length === 0)
    }
  }

  const handleSaveAddress = async () => {
    if (!addressLine.trim()) {
      alert("Enter an address.")
      return
    }
    if (userId) {
      try {
        if (editingId) {
          const updated = await updateAddress(editingId, {
            label: addressLabel || "Saved Address",
            text: addressLine,
          })
          const next = addresses.map((a) => (a.id === editingId ? updated : a))
          setAddresses(next)
          setSelectedAddressId(updated.id)
          setAddress(updated.text)
          setEditingId(null)
        } else {
          const created = await createAddress(userId, {
            label: addressLabel || "Saved Address",
            text: addressLine,
          })
          const next = [created, ...addresses]
          setAddresses(next)
          setSelectedAddressId(created.id)
          setAddress(created.text)
        }
      } catch (err) {
        alert("Failed to save address. Please try again.")
        return
      }
    } else {
      if (editingId) {
        const next = addresses.map((a) =>
          a.id === editingId ? { ...a, label: addressLabel, text: addressLine } : a
        )
        setAddresses(next)
        setSelectedAddressId(editingId)
        setAddress(addressLine)
        setEditingId(null)
      } else {
        const newAddress = {
          id: `addr-${Date.now()}`,
          label: addressLabel || "Saved Address",
          text: addressLine,
        }
        const next = [newAddress, ...addresses]
        setAddresses(next)
        setSelectedAddressId(newAddress.id)
        setAddress(newAddress.text)
      }
    }
    setAddressLabel("")
    setAddressLine("")
    setShowAddressForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          <Link to="/customer/home" className="hover:text-blue-600">Customer</Link>
          <span className="mx-2">/</span>
          <span>Checkout</span>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Checkout</h2>
            <p className="text-sm text-gray-600 dark:text-slate-300">
              Confirm shipping and review your order.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Shipping Address</h3>
                {addresses.length > 0 && (
                  <button
                    onClick={() => {
                      setEditingId(null)
                      setAddressLabel("")
                      setAddressLine("")
                      setShowAddressForm(true)
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Add New
                  </button>
                )}
              </div>

              {addresses.length > 0 && (
                <div className="space-y-3 mb-6">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className="flex items-start gap-3 border dark:border-slate-800 rounded-xl p-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => {
                          setSelectedAddressId(addr.id)
                          setAddress(addr.text)
                          setShowAddressForm(false)
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-semibold">{addr.label || "Saved Address"}</div>
                        <div className="text-sm text-gray-600 dark:text-slate-300">{addr.text}</div>
                        <div className="mt-2 flex gap-3 text-sm">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(addr.id)
                              setAddressLabel(addr.label || "")
                              setAddressLine(addr.text || "")
                              setShowAddressForm(true)
                            }}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleDeleteAddress(addr.id)
                            }}
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {showAddressForm && (
                <div className="grid grid-cols-1 gap-3">
                  <input
                    type="text"
                    className="w-full border dark:border-slate-700 px-4 py-2 rounded"
                    placeholder="Label (e.g. Home, Office)"
                    value={addressLabel}
                    onChange={(e) => setAddressLabel(e.target.value)}
                  />
                  <input
                    type="text"
                    className="w-full border dark:border-slate-700 px-4 py-2 rounded"
                    placeholder="123 Main Street, Bangalore, IN"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                  />
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleSaveAddress}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      {editingId ? "Save Changes" : "Save Address"}
                    </button>
                    <button
                      onClick={() => {
                        setAddressLabel("")
                        setAddressLine("")
                        setEditingId(null)
                        setShowAddressForm(false)
                      }}
                      className="bg-gray-200 dark:bg-slate-800 text-gray-800 dark:text-slate-100 px-4 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">Your Items</h3>
              {buyNow && productLoading && displayItems.length === 0 && (
                <div>Loading product details...</div>
              )}
              {!productLoading && displayItems.length === 0 && (
                <div>No items to checkout.</div>
              )}
              <div className="space-y-4">
                {displayItems.map(item => {
                  let product = products.find(p => p.id === item.productId);
                  if (!product && singleProduct && String(singleProduct.id) === String(item.productId)) {
                    product = singleProduct;
                  }
                  const name = item.name || product?.name || item.productId;
                  const price = product?.price ?? item.price;
                  return (
                    <div
                      key={item.productId}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border dark:border-slate-800 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={product?.imageUrl || "/placeholder.jpg"}
                          alt={name}
                          className="w-16 h-16 object-contain border dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-950"
                        />
                        <div>
                          <div className="font-semibold">{name}</div>
                          <div className="text-sm text-gray-600 dark:text-slate-300">
                            Rs. {price}
                          </div>
                        </div>
                      </div>
                      {!buyNow && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            className="px-2 py-1 bg-gray-200 dark:bg-slate-800 rounded text-lg"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={e => handleQuantityChange(item, Number(e.target.value))}
                            className="w-14 border dark:border-slate-700 rounded text-center"
                          />
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            className="px-2 py-1 bg-gray-200 dark:bg-slate-800 rounded text-lg"
                          >
                            +
                          </button>
                        </div>
                      )}
                      <div className="text-sm font-semibold text-green-600">
                        Subtotal: Rs. {price * item.quantity}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-6 h-fit">
            <h3 className="text-lg font-bold mb-4">Order Summary</h3>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-slate-300 mb-2">
              <span>Subtotal</span>
              <span>Rs. {productLoading && buyNow ? "..." : total}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-slate-300 mb-2">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t dark:border-slate-800 my-3"></div>
            <div className="flex items-center justify-between text-lg font-bold mb-4">
              <span>Total</span>
              <span>Rs. {productLoading && buyNow ? "..." : total}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Continue to Payment
            </button>
            <button
              onClick={() => {
                try {
                  const user = JSON.parse(localStorage.getItem("user"));
                  const role = user?.role?.toLowerCase();
                  if (role === "customer") {
                    navigate("/customer/home");
                    return;
                  }
                } catch {}
                navigate("/");
              }}
              className="w-full mt-3 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

