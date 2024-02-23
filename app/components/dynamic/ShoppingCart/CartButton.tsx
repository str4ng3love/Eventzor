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
          className={`relative z-40 cursor-pointer rounded-xl p-2 font-bold text-contrast transition-all duration-300 first-letter:capitalize hover:-translate-y-1 hover:scale-105 hover:bg-white hover:text-text hover:shadow-link dark:text-text dark:hover:bg-text dark:hover:text-contrast dark:hover:shadow-link ${bgColor} 
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
          className={`relative z-40 cursor-pointer rounded-xl p-2 font-bold text-contrast transition-all duration-300 first-letter:capitalize hover:-translate-y-1 hover:scale-105 hover:bg-white hover:text-text hover:shadow-link dark:text-text dark:hover:bg-text dark:hover:text-contrast dark:hover:shadow-link ${bgColor} 
          `}
          onClick={(e) => fn(e)}
          aria-label="Button opens shopping cart"
        >
          <span className="absolute right-0 top-0 z-40 flex h-6 w-6 -translate-y-[0.5rem] translate-x-[1rem] items-center justify-center rounded-full bg-secondary text-white">
            {newEntries}
          </span>
          <Icon size={size} />
        </button>
      )}
    </>
  );
};

export default CartButton;
