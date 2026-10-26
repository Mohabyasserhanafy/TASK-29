import { useContext } from "react";
import ProductCard from "../components/ProductCard";
import { globalStore } from "../stores/MainStore";

const Products = () => {

    const {products} = useContext(globalStore)

  return (
    <div className="">
      <h2 className="my-10 text-4xl font-bold text-center">Products</h2>
      <div className="container grid grid-cols-2 gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
