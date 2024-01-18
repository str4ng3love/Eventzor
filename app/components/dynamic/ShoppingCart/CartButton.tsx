import { IconType } from "react-icons";

interface Props {
  Icon: IconType;
  fn: (e: React.MouseEvent) => void;
  size?: string;
  bgColor?: string;
  title?: string;
  newEntries: number;
}
//TO DO: change button to Button component
const CartButton = ({ Icon, fn, size, bgColor, title, newEntries }: Props) => {
  return (
    <>
      {newEntries === 0 ? (
        <button
          title={title}
          className={`cursor-pointer  relative first-letter:capitalize hover:-translate-y-1  hover:scale-105 font-bold p-2 text-interactive_text dark:text-text rounded-xl hover:bg-link_active hover:shadow-link hover:text-interactive_text dark:hover:bg-text dark:hover:shadow-link dark:hover:text-interactive_text transition-all duration-300 ${bgColor} `}
          onClick={(e) => fn(e)}
        >
          <Icon size={size} />
        </button>
      ) : (
        <button
          id="cart-btn"
          title={title}
          className={`cursor-pointer relative first-letter:capitalize hover:-translate-y-1  hover:scale-105 font-bold p-2 text-interactive_text dark:text-text rounded-xl hover:bg-link_active hover:shadow-link hover:text-interactive_text dark:hover:bg-text dark:hover:shadow-link dark:hover:text-interactive_text transition-all duration-300 ${bgColor} 
          `}
          onClick={(e) => fn(e)}
        >
          <span className="absolute bg-secondary flex items-center justify-center rounded-full h-6 w-6 top-0 right-0 -translate-y-[0.5rem] translate-x-[1rem] text-white">
            {newEntries}
          </span>
          <Icon size={size} />
        </button>
      )}
    </>
  );
};

export default CartButton;
