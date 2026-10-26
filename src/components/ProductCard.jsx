import { Link } from "react-router";

const ProductCard = ({product}) => {
  return (
    <Link to={`/products/single-product/${product.id}`} className="product rounded-xl shadow-xl flex flex-col items-center gap-3 p-15 text-center">
      <h3 className="text-2xl font-bold">{product.title}</h3>
      <p className="text-4xl font-bold text-green-800">${product.price}</p>
    </Link>
  );
};

export default ProductCard;
