import {useContext} from "react"
import {globalStore} from "../stores/MainStore"

const Button = ({ children }) => {

  const {num} = useContext(globalStore)
    

  return (
    <div className="bg-indigo-500 px-20 py-3 rounded-lg text-white text-xl font-bold cursor-pointer">
      {children + " " + num }
    </div>
  );
};

export default Button;
