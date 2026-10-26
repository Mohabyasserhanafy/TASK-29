import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="w-full shadow-xl py-3">
      <div className="container flex justify-between items-center">
        <Link to={"/"} className="text-4xl font-bold">Oline Shop</Link>
        <ul className="flex gap-10">
          <li>
            <Link to={"/"} className="text-lg font-bold hover:text-green-500 duration-300">Home</Link>
          </li>
          <li>
            <Link to={"/about"} className="text-lg font-bold hover:text-green-500 duration-300">About</Link>
          </li>
          <li>
            <Link to={"/contact"} className="text-lg font-bold hover:text-green-500 duration-300">Contact</Link>
          </li>
          <li>
            <Link to={"/products"} className="text-lg font-bold hover:text-green-500 duration-300">Products</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
