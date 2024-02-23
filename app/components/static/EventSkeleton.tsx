import { CiMenuKebab } from "react-icons/ci";

const EventSkeleton = () => {
  return (
    <tr className="-z-50 animate-fadeIn border-b-2 border-black/25 ">
      <td className="p-2 ">
        <span className="bg-bg_interactive  block h-4 blur-sm"></span>
      </td>
      <td className="p-2">
        {" "}
        <span className="bg-bg_interactive  block h-4 blur-sm"></span>
      </td>
      <td className="p-2">
        {" "}
        <span className="bg-bg_interactive  block h-4 blur-sm"></span>
      </td>
      <td className="p-2">
        {" "}
        <span className="bg-bg_interactive  block h-4 blur-sm"></span>
      </td>
      <td className="p-2">
        {" "}
        <span className="bg-bg_interactive  block h-4 blur-sm"></span>
      </td>
      <td className="m-0 flex h-[100%] items-center justify-center overflow-visible p-0">
        <div className={`flex min-h-[4rem] items-center justify-center `}>
          <div className="text-interactive_text rounded-xl  p-2 font-bold dark:text-text">
            <CiMenuKebab />
          </div>
        </div>
      </td>
    </tr>
  );
};

export default EventSkeleton;
