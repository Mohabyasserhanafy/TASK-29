import { createContext, useState } from "react";

export const globalStore = createContext();

const MainStore = ({ children }) => {
  const [num, setNum] = useState(1);

  const sayHi = () => {
    return <h1>SAY HI</h1>;
  };
  const products = [
    {
      id: 1,
      title: "Wireless Over-Ear Headphones",
      price: 99.99,
      category: "Electronics",
      description: "High-quality wireless headphones with noise cancellation and rich bass.",
      rating: { rate: 4.7, count: 120 },
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Classic Minimalist Watch",
      price: 149.50,
      category: "Accessories",
      description: "Sleek stainless steel wristwatch with a genuine leather strap.",
      rating: { rate: 4.5, count: 85 },
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Ergonomic Mechanical Keyboard",
      price: 79.99,
      category: "Electronics",
      description: "Customizable RGB backlit mechanical keyboard with tactile switches.",
      rating: { rate: 4.8, count: 210 },
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Insulated Stainless Steel Water Bottle",
      price: 24.99,
      category: "Fitness & Outdoor",
      description: "Keeps drinks cold for 24 hours or hot for 12 hours with a leak-proof cap.",
      rating: { rate: 4.6, count: 95 },
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      title: "Modern Running Shoes",
      price: 89.95,
      category: "Footwear",
      description: "Lightweight and breathable sneakers designed for maximum athletic performance.",
      rating: { rate: 4.4, count: 150 },
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      title: "Smart Fitness Tracker Band",
      price: 49.99,
      category: "Electronics",
      description: "Track your daily steps, heart rate, sleep quality, and workouts effortlessly.",
      rating: { rate: 4.3, count: 310 },
      image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 7,
      title: "Minimalist Leather Backpack",
      price: 119.99,
      category: "Accessories",
      description: "Durable and stylish leather backpack with a dedicated laptop compartment.",
      rating: { rate: 4.7, count: 78 },
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 8,
      title: "Portable Bluetooth Speaker",
      price: 59.99,
      category: "Electronics",
      description: "Waterproof wireless speaker delivering crisp 360-degree sound on the go.",
      rating: { rate: 4.6, count: 190 },
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 9,
      title: "Ceramic Coffee Mug Set",
      price: 34.50,
      category: "Home & Kitchen",
      description: "Set of 4 handcrafted matte ceramic mugs for your favorite morning brew.",
      rating: { rate: 4.9, count: 64 },
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const values = {
    num,
    setNum,
    sayHi,
    products
  };

  return <globalStore.Provider value={values}>{children}</globalStore.Provider>;
};

export default MainStore;
