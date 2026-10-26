import { useContext } from "react";
import { globalStore } from "../stores/MainStore";
import { useParams } from "react-router";


const SingleProduct = () => {

  const {productId} = useParams()

  const {products} = useContext(globalStore)

  const product = products.find((product) => product.id == productId )

  return (
    <div className="min-h-screen py-30">
      <div className="container grid grid-cols-2 gap-10">
        <img className="rounded-lg" src={product.image} alt={product.title} />
        <div className="content shadow-2xl rounded-lg p-10 flex flex-col gap-5 justify-center">
          <h2 className="text-5xl font-bold text-sky-500">{product.title}</h2>
          <h2 className="text-3xl font-bold">{product.description}</h2>
          <h2 className="text-5xl font-bold text-yellow-300">${product.price}</h2>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
