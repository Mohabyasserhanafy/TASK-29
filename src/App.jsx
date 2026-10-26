import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { Route, Routes } from "react-router";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import Navbar from "./components/Navbar";
import SingleProduct from "./pages/SingleProduct";

export default function App() {
  return (
    <div>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/single-product/:productId" element={<SingleProduct />} />
        <Route path="*" element={<NotFound />}  />
      </Routes>
    </div>
  );
}
