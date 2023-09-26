// "use client";
// import Notification from "../../static/Notification";
// import React, { useState, Fragment, useReducer } from "react";
// import { Dialog, Transition } from "@headlessui/react";
// import Button from "../Button";

// // Can't import enum type from schema.prisma file for some reason
// enum FormActionKind {
//   INPUT_ITEM,
//   INPUT_DESC,
//   INPUT_AMOUNT,
//   INPUT_IS_PREORDER,
//   INPUT_IS_BUY_ORDER,
//   INPUT_RELEASE,
//   INPUT_PRICE
// }
// interface InputAction {
//   type: FormActionKind;
//   payload: string | number | boolean | Date;
// }
// interface InputState {
//   item: string;
//   description: string;
//   amount: number;
//   preorder: boolean;
//   isBuyOrder: boolean;
//   releaseDate?: Date | null;
//   price: number
// }

// const reducer = (state: InputState, action: InputAction) => {
//   const { type, payload } = action;

//   switch (type) {
//     case FormActionKind.INPUT_ITEM: {
//       return {
//         ...state,
//         item: payload as string,
//       };
//     }
//     case FormActionKind.INPUT_DESC: {
//       return {
//         ...state,
//         description: payload as string,
//       };
//     }
//     case FormActionKind.INPUT_AMOUNT: {
//       return {
//         ...state,
//         amount: payload as number,
//       };
//     }
//     case FormActionKind.INPUT_IS_BUY_ORDER: {
//       return {
//         ...state,
//         isBuyOrder: payload as boolean,
//       };
//     }
//     case FormActionKind.INPUT_IS_PREORDER: {
//       return {
//         ...state,
//         isPreorder: payload as boolean,
//       };
//     }
//     case FormActionKind.INPUT_RELEASE: {
//       return {
//         ...state,
//         releaseDate: payload as Date,
//       };
//     }
//     case FormActionKind.INPUT_PRICE:{
//       return {
//         ...state,
//         price: payload as number
//       }
//     }

//     default:
//       return state;
//   }
// };
// interface Props extends InputState{
//     show: boolean,
//     id: string;
//     stopDisplayingFn: () => void;
//     triggerFetchFn: ()=>void;
// }
// const EditOrder = ({...props}:Props) => {
//     let date = new Date()
//   const [canEdit, setCanEdit] = useState(true)
//   const [notify, setNotify] = useState({
//     show: false,
//     message: "",
//     error: false,
//   });
//   const [state, dispatch] = useReducer(reducer, {
//     item: props.item,
//     description: props.description,
//     amount: props.amount,
//     isBuyOrder: props.isBuyOrder,
//     preorder: props.preorder,
//     releaseDate: props.releaseDate,
//     price: props.price
//   });

//   const handleEdit = async (state: InputState) => {
//     try {
//       const resp = await fetch("/api/orders", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "Application/json",
//         },
//         body: JSON.stringify({state, id: props.id})
//       });
//       const dat = await resp.json();
//       setCanEdit(true)
//       props.triggerFetchFn()
//       if (dat.error) {
//         setNotify({ error: true, show: true, message: dat.error });
//       } else {
//         setNotify({ error: false, show: true, message: dat.message });
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div>

//       <Transition appear show={props.show} as={Fragment}>
//         <Dialog as="div" onClose={() => props.stopDisplayingFn()}>
//           <Transition.Child
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="bg-black/20 fixed inset-0" aria-hidden />
//             <div className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-sm">
//               <Dialog.Panel
//                 className={
//                   "relative p-8 bg-bg_interactive text-text dark:bg-bg_interactive  w-[30rem] shadow-md shadow-black overflow-y-scroll"
//                 }
//               >
//                 <Dialog.Title className={"p-2 font-bold text-xl text-center"}>
//                   Edit Order
//                 </Dialog.Title>
//                 <form onSubmit={(e) => e.preventDefault()}>
//                   <div className="p-4 flex justify-between z-20 ">
//                     <label className="p-1 min-w-[10ch] mr-2">Title</label>
//                     <input
//                     value={state.item}
//                       onChange={(e) =>
//                         dispatch({
//                           type: FormActionKind.INPUT_ITEM,
//                           payload: e.currentTarget.value,
//                         })
//                       }
//                       className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text w-full  h-8"
//                       type="text"
//                     />
//                   </div>
//                   <div className="p-4 flex justify-between ">
//                     <label className="p-1 min-w-[10ch] mr-2 ">
//                       Description
//                     </label>
//                     <textarea
//                     value={state.description}
//                       onChange={(e) =>
//                         dispatch({
//                           type: FormActionKind.INPUT_DESC,
//                           payload: e.currentTarget.value,
//                         })
//                       }
//                       className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text w-full  h-24 resize-none "
//                     />
//                   </div>
//                   <div className="p-4 flex justify-between ">
//                     <label className="p-1 min-w-[10ch] mr-2">
//                       Available items
//                     </label>
//                     <input
//                     value={state.amount}
//                       onChange={(e) =>
//                         dispatch({
//                           type: FormActionKind.INPUT_AMOUNT,
//                           payload: e.currentTarget.value,
//                         })
//                       }
//                       className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text w-full  h-8"
//                       type="number"
                  
//                     />
//                   </div>
//                   <div className="p-4 flex justify-between ">
//                     <label className="p-1 min-w-[10ch] mr-2">
//                       Price
//                     </label>
//                     <input
//                     value={state.price  }
//                       onChange={(e) =>
//                         dispatch({
//                           type: FormActionKind.INPUT_PRICE,
//                           payload: e.currentTarget.value,
//                         })
//                       }
//                       className="p-1 min-w-[15ch] ring-1 ring-text active:ring-link dark:text-interactive_text w-full  h-8"
//                       type="number"
                  
//                     />
//                   </div>
//                   <Notification
//                     message={notify.message}
//                     show={notify.show}
//                     error={notify.error}
//                     onAnimEnd={() =>
//                       setNotify({ error: false, message: "", show: false })
//                     }
//                   />
//                   <div className="p-4 mt-4 flex justify-evenly ">
//                     {canEdit ?  <Button
//                     title="Edit"
//                       text="Edit"
//                       fn={() => {
//                         setCanEdit(false)
//                         handleEdit(state);
//                       }}
//                     />:  <Button
//                     title="Working ..."
//                     text="Editing..."
//                     interactive={false}
//                     bgColor={"bg-bg"}
//                     fn={() => {
                   
//                     }}
//                   />}
                   
//                     <Button title="cancel" text="Cancel" fn={() => props.stopDisplayingFn()} />
//                   </div>
//                 </form>
//               </Dialog.Panel>
//             </div>
//           </Transition.Child>
//         </Dialog>
//       </Transition>
//     </div>
//   );
// };

// export default EditOrder;
