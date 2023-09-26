// "use client";
// import { useState } from "react";
// import OrderComponent from "./OrderComponent";
// import AddOrder from "./AddOrder";
// import OrderSkeleton from "../../static/OrderSkeleton";

// import { sortOrders } from "@/helpers/sort";
// import DropDown from "../DropDown";
// import Notification, { NotificationObj } from "../../static/Notification";
// import EditOrder from "./EditOrder";
// interface Props {
//   orders: Order[];
// }
// export const OrderBrowser = ({ orders }: Props) => {
//   const [ordersArr, setOrdersArr] = useState(orders);
//   const [optimisticComp, setOptimisticComp] = useState(false);
//   const [sorter, setSorter] = useState("order");
//   const [notify, setNotify] = useState<NotificationObj>();
//   const [edit, setEdit] = useState<{ show: boolean; order: Order | null }>({
//     show: false,
//     order: null,
//   });
//   const getOrder = async (id?: string) => {
//     try {
//       let resp;
//       id
//         ? (resp = await fetch(`/api/orders/${id}`))
//         : (resp = await fetch("/api/orders/latest"));

//       const data = await resp.json();

//       if (data) {
//         id
//           ? setOrdersArr((prev) =>
//               prev.map((o) =>
//                 o.id === id
//                   ? {
//                       amount: data.amount,
//                       amountSold: data.amountSold,
//                       description: data.description,
//                       id,
//                       isBuyOrder: data.isBuyOrder,
//                       item: data.item,
//                       merchantName: data.merchantName,
//                       preorder: data.preorder,
//                       price: data.price,
//                       releaseDate: data.releaseDate,
//                     }
//                   : o
//               )
//             )
//           : setOrdersArr((prev) => [...prev, data]);

//         setOptimisticComp(false);
//       } else {
//         setNotify({
//           show: true,
//           error: true,
//           message: "Could not fetch the order. Please try again.",
//         });
//       }
//     } catch (error) {
//       if (error) {
//         setNotify({
//           show: true,
//           error: true,
//           message: "Could not fetch the order. Please try again.",
//         });
//       }
//     }
//   };
//   const SortOrders = (e: React.MouseEvent) => {
//     let target = e.currentTarget.innerHTML.toLowerCase();
//     if (!target) {
//       return null;
//     }
//     if (sorter !== target) {
//       setSorter(target);
//       setOrdersArr((prev) => {
//         return [...sortOrders(prev, target)];
//       });
//     } else {
//       setOrdersArr((prev) => {
//         return [...prev.reverse()];
//       });
//     }
//   };
//   const deleteOrder = async (id: string) => {
//     try {
//       const cachedEntry = ordersArr.filter((e) => e.id == id);
//       setOrdersArr((prev) => [...prev.filter((e) => e.id != id)]);

//       const resp = await fetch("/api/orders", {
//         method: "DELETE",
//         headers: {
//           "content-type": "application/json",
//         },
//         body: JSON.stringify({ id }),
//       });
//       const message = await resp.json();
//       if (resp.ok) {
//         setNotify({ error: false, show: true, message: message.message });
//       } else if (message.error) {
//         setOrdersArr((prev) => [...prev, ...cachedEntry]);
//         setNotify({ error: true, show: true, message: message.error });
//       }
//     } catch (error) {
//       setNotify({ error: true, show: true, message: "Something went wrong" });
//     }
//   };
//   return (
//     <>
//       <div className="my-4 px-8 flex flex-col">
//         <div className="flex justify-end gap-4 text-sm items-center">
//           <DropDown
//             title="Sort by"
//             fn={(e) => {
//               SortOrders(e);
//             }}
//             items={["Item", "Price", "Amount"]}
//           />
//           <AddOrder
//             fn={(e) => {
//               setOptimisticComp(true);
//             }}
//             refetchTrigger={()=> getOrder()}
//           />
//         </div>
//         <table className="my-8  w-full text-sm table">
//           <tbody className="">
//             <tr className="border-b-2 border-black/25 bg-black/40 table-row">
//               <th className="p-2 text-start">Item</th>
//               <th className="p-2 text-start">Price</th>
//               <th className="p-2 text-start">Amount</th>
//               <th className="p-2 text-start"></th>
//             </tr>
//             {ordersArr.length > 0 ? (
//               ordersArr.map((order) => (
//                 <OrderComponent {...order} delFn={() => {deleteOrder(order.id)}} editFn={() => setEdit({show:true, order})} key={order.id}/>
//               ))
//             ) : (
//               <tr className="w-full flex justify-center p-8">
//                 <td>No Orders in Database</td>
//               </tr>
//             )}
//             {optimisticComp ? <OrderSkeleton /> : <></>}
//           </tbody>
//         </table>
//         {notify ? (
//           <Notification
//             error={notify.error}
//             message={notify.message}
//             show={notify.show}
//             onAnimEnd={() => {
//               setNotify({ error: false, message: "", show: false });
//             }}
//           />
//         ) : (
//           <></>
//         )}
//         {edit.show && edit.order ? (
//           <EditOrder 
//             {...edit.order}
//             show={edit.show}
//             stopDisplayingFn={() => {
//               setEdit({ show: false, order: null });
//             }}
//             triggerFetchFn={() => getOrder(edit.order?.id)}
//           />
          
//         ) : (
//           <></>
//         )}
        
//       </div>
//     </>
//   );
// };
