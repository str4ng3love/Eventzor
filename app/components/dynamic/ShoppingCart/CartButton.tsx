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
          className={`z-40 cursor-pointer relative first-letter:capitalize hover:-translate-y-1 hover:text-text hover:bg-white hover:shadow-link hover:scale-105 font-bold p-2 text-contrast dark:text-text rounded-xl dark:hover:bg-text dark:hover:shadow-link dark:hover:text-contrast transition-all duration-300 ${bgColor} 
          `}
          onClick={(e) => fn(e)}
          aria-label="Button opens shopping cart"
        >
          <Icon size={size} />
        </button>
      ) : (
        <button
          id="cart-btn"
          title={title}
          className={`z-40 cursor-pointer relative first-letter:capitalize hover:-translate-y-1 hover:text-text hover:bg-white hover:shadow-link hover:scale-105 font-bold p-2 text-contrast dark:text-text rounded-xl dark:hover:bg-text dark:hover:shadow-link dark:hover:text-contrast transition-all duration-300 ${bgColor} 
          `}
          onClick={(e) => fn(e)}
          aria-label="Button opens shopping cart"
        >
          <span className="z-40 absolute bg-secondary flex items-center justify-center rounded-full h-6 w-6 top-0 right-0 -translate-y-[0.5rem] translate-x-[1rem] text-white">
            {newEntries}
          </span>
          <Icon size={size} />
        </button>
      )}
    </>
  );
};

export default CartButton;
