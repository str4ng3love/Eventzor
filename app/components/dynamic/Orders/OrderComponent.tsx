// "use client";
// import { Order } from "@prisma/client";
// import { CiMenuKebab } from "react-icons/ci";
// import DropDownMini from "../DropDownMini";

// interface OrderProps extends Order {
//   delFn: (e: React.MouseEvent) => void;
//   editFn: (e: React.MouseEvent) => void;
// }
// const OrderComponent
//  = ({ ...props }: OrderProps) => {
//   return (
//     <tr className="border-b-2 border-black/25 animate-fadeIn -z-50 ">
//       <td className="p-2">
//         <b>{props.item}</b>
//       </td>
//       <td className="p-2">
//         <b>{props.price}</b>
//       </td>
//       <td className="p-2">
//         {props.amount - props.amountSold} / {props.amount}
//       </td>
//       <td className="overflow-visible h-[100%] m-0 p-0 flex items-center justify-center">
//         <DropDownMini
//           items={[
//             {
//               text: "Edit",
//               fn(e) {
//                 props.editFn(e);
//               },
//             },
//             {
//               text: "Delete",
//               fn(e) {
//                 props.delFn(e);
//               },
//             },
//           ]}
//           Icon={CiMenuKebab}
//           bgColor="bg-bg"
//           size="1em"
//         />
//       </td>
//     </tr>
//   );
// };

// export default OrderComponent
// ;
