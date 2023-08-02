"use client";
interface Props {
  text: string;
  fn: (e: React.MouseEvent) => void;
}
const Button = ({ fn, text }: Props) => {
  return (
   
      <button className="first-letter:capitalize min-w-[10ch] hover:-translate-y-1 hover:scale-105 font-bold p-2 bg-link text-interactive_text dark:text-text rounded-xl hover:bg-link_active hover:shadow-link hover:text-interactive_text  dark:hover:bg-text dark:hover:shadow-link dark:hover:text-interactive_text transition-all 300ms" onClick={(e) => fn(e)}>{text}</button>
    
  );
};

export default Button;
