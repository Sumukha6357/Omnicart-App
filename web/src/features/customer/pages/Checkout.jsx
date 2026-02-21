import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useContext } from "react";
import { addItem, removeItem, fetchCart } from "../../../redux/cartSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { getProductById } from "../../../redux/productSlice";
import { getAddresses, createAddress, updateAddress, deleteAddress } from "../../../api/addressApi";
import CustomerPageShell from "../../../components/customer/CustomerPageShell";
import { ToastContext } from "../../../context/ToastContext";
import { formatInr } from "../../../utils/formatters";

export default function Checkout() {
  const { cartItems } = useSelector((state) => state.cart);
  const { products } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useContext(ToastContext);
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const userId = storedUser?.id;
  const addressKey = (id) => `addresses:${id || "guest"}`;
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [addressLabel, setAddressLabel] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(true);

  const searchParams = new URLSearchParams(location.search);
  const buyNow = searchParams.get("buyNow") === "1";
  const buyNowProductId = searchParams.get("productId");
  const buyNowQuantity = parseInt(searchParams.get("quantity"), 10) || 1;

  useEffect(() => {
    if (buyNow && buyNowProductId) {
      const product = products.find((p) => String(p.id) === String(buyNowProductId));
      if (!product) {
        dispatch(getProductById(buyNowProductId));
      }
    }
  }, [buyNow, buyNowProductId, products, dispatch]);

  useEffect(() => {
    let active = true;
    const loadAddresses = async () => {
      if (!userId) {
        const raw = localStorage.getItem(addressKey(userId));
        const parsed = raw ? JSON.parse(raw) : [];
        if (Array.isArray(parsed) && active) {
          setAddresses(parsed);
          if (parsed.length > 0) {
            setSelectedAddressId(parsed[0].id);
            setShowAddressForm(false);
          }
        }
        return;
      }
      try {
        const data = await getAddresses(userId);
        if (!active) return;
        const list = Array.isArray(data) ? data : [];
        setAddresses(list);
        if (list.length > 0) {
          setSelectedAddressId(list[0].id);
          setShowAddressForm(false);
        } else {
          setSelectedAddressId("");
          setShowAddressForm(true);
        }
      } catch {
        if (!active) return;
        setAddresses([]);
        setSelectedAddressId("");
        setShowAddressForm(true);
      }
    };
    loadAddresses();
    return () => {
      active = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      localStorage.setItem(addressKey(userId), JSON.stringify(addresses));
    }
  }, [addresses, userId]);

  let displayItems = cartItems;
  const singleProduct = useSelector((state) => state.product.product);
  const productLoading = useSelector((state) => state.product.loading);

  if (buyNow && buyNowProductId) {
    let product = products.find((p) => String(p.id) === String(buyNowProductId));
    if (!product && singleProduct && String(singleProduct.id) === String(buyNowProductId)) {
      product = singleProduct;
    }
    if (product) {
      displayItems = [{ productId: product.id, quantity: buyNowQuantity, price: product.price, name: product.name }];
    } else {
      displayItems = [];
    }
  }

  const total = displayItems.reduce((acc, item) => {
    const product = products.find((p) => p.id === item.productId);
    const price = product ? product.price : item.price;
    return acc + price * item.quantity;
  }, 0);

  const handleQuantityChange = (item, newQuantity) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const uid = user?.id;
    if (!uid || newQuantity < 1) return;
    dispatch(removeItem({ userId: uid, productId: item.productId })).then(() => {
      dispatch(addItem({ userId: uid, productId: item.productId, quantity: newQuantity })).then(() => {
        dispatch(fetchCart({ userId: uid }));
      });
    });
  };

  const handlePlaceOrder = async () => {
    if (!userId) {
      showToast("You must be logged in to place an order.", "info");
      navigate("/login");
      return;
    }

    const selected = addresses.find((a) => a.id === selectedAddressId);
    const address = selected?.text || "";
    if (!address.trim()) {
      showToast("Please select or add an address.", "error");
      return;
    }

    const orderItems = displayItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const price = product?.price ?? item.price;
      return { productId: item.productId, quantity: item.quantity, name: item.name, price };
    });

    const orderData = {
      items: orderItems,
      products: displayItems.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      address,
      total,
      buyNow,
    };

    navigate("/payment", { state: { orderDetails: orderData } });
  };

  const handleDeleteAddress = async (addrId) => {
    if (userId) {
      try {
        await deleteAddress(addrId);
      } catch {
        showToast("Failed to delete address.", "error");
        return;
      }
    }
    const next = addresses.filter((a) => a.id !== addrId);
    setAddresses(next);
    if (selectedAddressId === addrId) {
      const nextSelected = next[0];
      setSelectedAddressId(nextSelected?.id || "");
      setShowAddressForm(next.length === 0);
    }
  };

  const handleSaveAddress = async () => {
    if (!addressLine.trim()) {
      showToast("Enter an address.", "error");
      return;
    }
    if (userId) {
      try {
        if (editingId) {
          const updated = await updateAddress(editingId, { label: addressLabel || "Saved Address", text: addressLine });
          const next = addresses.map((a) => (a.id === editingId ? updated : a));
          setAddresses(next);
          setSelectedAddressId(updated.id);
          setEditingId(null);
        } else {
          const created = await createAddress(userId, { label: addressLabel || "Saved Address", text: addressLine });
          const next = [created, ...addresses];
          setAddresses(next);
          setSelectedAddressId(created.id);
        }
      } catch {
        showToast("Failed to save address.", "error");
        return;
      }
    } else {
      if (editingId) {
        const next = addresses.map((a) => (a.id === editingId ? { ...a, label: addressLabel, text: addressLine } : a));
        setAddresses(next);
        setSelectedAddressId(editingId);
        setEditingId(null);
      } else {
        const newAddress = { id: `addr-${Date.now()}`, label: addressLabel || "Saved Address", text: addressLine };
        const next = [newAddress, ...addresses];
        setAddresses(next);
        setSelectedAddressId(newAddress.id);
      }
    }
    setAddressLabel("");
    setAddressLine("");
    setShowAddressForm(false);
    showToast("Address saved.", "success");
  };

  return (
    <CustomerPageShell
      userRole="customer"
      pageLabel="Checkout"
      title="Checkout"
      subtitle="Confirm address and review your order"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Shipping Address</h3>
              {addresses.length > 0 && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    setAddressLabel("");
                    setAddressLine("");
                    setShowAddressForm(true);
                  }}
                  className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Add New
                </button>
              )}
            </div>

            {addresses.length > 0 && (
              <div className="mb-6 space-y-3">
                {addresses.map((addr) => (
                  <label key={addr.id} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === addr.id}
                      onChange={() => {
                        setSelectedAddressId(addr.id);
                        setShowAddressForm(false);
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{addr.label || "Saved Address"}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{addr.text}</div>
                      <div className="mt-2 flex gap-3 text-sm">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(addr.id);
                            setAddressLabel(addr.label || "");
                            setAddressLine(addr.text || "");
                            setShowAddressForm(true);
                          }}
                          className="font-semibold text-brand-600 hover:text-brand-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="font-semibold text-rose-600 hover:text-rose-700"
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
                  className="rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-700 dark:bg-slate-950"
                  placeholder="Label (e.g. Home, Office)"
                  value={addressLabel}
                  onChange={(e) => setAddressLabel(e.target.value)}
                />
                <input
                  type="text"
                  className="rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-700 dark:bg-slate-950"
                  placeholder="123 Main Street, Bangalore, IN"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                />
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button onClick={handleSaveAddress} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
                    {editingId ? "Save Changes" : "Save Address"}
                  </button>
                  <button
                    onClick={() => {
                      setAddressLabel("");
                      setAddressLine("");
                      setEditingId(null);
                      setShowAddressForm(false);
                    }}
                    className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-4 text-lg font-bold">Your Items</h3>
            {buyNow && productLoading && displayItems.length === 0 && <div>Loading product details...</div>}
            {!productLoading && displayItems.length === 0 && <div>No items to checkout.</div>}
            <div className="space-y-4">
              {displayItems.map((item) => {
                let product = products.find((p) => p.id === item.productId);
                if (!product && singleProduct && String(singleProduct.id) === String(item.productId)) {
                  product = singleProduct;
                }
                const name = item.name || product?.name || item.productId;
                const price = Number(product?.price ?? item.price ?? 0);
                return (
                  <div key={item.productId} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={product?.imageUrl || "/placeholder.jpg"}
                          alt={name}
                          className="h-16 w-16 rounded-lg bg-slate-100 object-contain dark:bg-slate-950"
                        />
                        <div>
                          <div className="font-semibold">{name}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">{formatInr(price)}</div>
                        </div>
                      </div>
                      {!buyNow && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            className="rounded bg-slate-200 px-2 py-1 text-lg dark:bg-slate-800"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item, Number(e.target.value))}
                            className="w-14 rounded border border-slate-300 text-center dark:border-slate-700 dark:bg-slate-950"
                          />
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            className="rounded bg-slate-200 px-2 py-1 text-lg dark:bg-slate-800"
                          >
                            +
                          </button>
                        </div>
                      )}
                      <div className="text-sm font-semibold text-emerald-600">Subtotal: {formatInr(price * item.quantity)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-card border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-bold">Order Summary</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{productLoading && buyNow ? "..." : formatInr(total)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
          </div>
          <div className="my-3 border-t border-slate-200 dark:border-slate-800" />
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span>{productLoading && buyNow ? "..." : formatInr(total)}</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Continue to Payment
          </button>
          <button
            onClick={() => navigate("/customer/home")}
            className="mt-2 w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Back to Products
          </button>
        </aside>
      </div>
    </CustomerPageShell>
  );
}
