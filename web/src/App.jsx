import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes"; // Import your route config

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow px-4 py-6 sm:px-6 lg:px-8 animate-[toast-in_280ms_ease-out]">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;



