import { CiMenuKebab } from "react-icons/ci";


const EventSkeleton = () => {
  return (
    <tr className="border-b-2 border-black/25 animate-fadeIn -z-50 ">
      <td className="p-2 "><span className="bg-bg_interactive  blur-sm h-4 block"></span></td>
      <td className="p-2">   <span className="bg-bg_interactive  blur-sm h-4 block"></span></td>
      <td className="p-2">   <span className="bg-bg_interactive  blur-sm h-4 block"></span></td>
      <td className="p-2">   <span className="bg-bg_interactive  blur-sm h-4 block"></span></td>
      <td className="p-2">   <span className="bg-bg_interactive  blur-sm h-4 block"></span></td>
      <td className="overflow-visible h-[100%] m-0 p-0 flex items-center justify-center">
   <div  className={`min-h-[4rem] flex items-center justify-center `}
        >
  <div className="font-bold p-2  text-interactive_text dark:text-text rounded-xl">

          <CiMenuKebab />
  </div>
   </div>
      </td>
    </tr>
  );
};

export default EventSkeleton
