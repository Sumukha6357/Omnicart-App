import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes"; // Import your route config
import { useState } from "react";

function App() {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  // Adds a product to the cart (if already in cart, increase quantity)
  const addToCart = (product) => {
    console.log('addToCart called with:', product);
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Place order: move cart to orders and clear cart
  const placeOrder = () => {
    if (cart.length > 0) {
      setOrders((prevOrders) => [
        ...prevOrders,
        { id: Date.now(), items: cart, date: new Date().toLocaleString() }
      ]);
      setCart([]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar cart={cart} />
      <main className="flex-grow px-4 py-6">
        <AppRoutes cart={cart} addToCart={addToCart} orders={orders} placeOrder={placeOrder} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
