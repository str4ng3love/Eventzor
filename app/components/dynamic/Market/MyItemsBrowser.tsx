"use client";

import { MarketItem } from "@prisma/client";
import { useEffect, useState } from "react";
import DropDown from "../DropDown";
import { sortItems } from "@/helpers/sort";
import Notification, { NotificationObj } from "../../static/Notification";
import OrderSkeleton from "../../static/OrderSkeleton";

import EditItem from "./EditItem";
import AddNewItem from "./AddNewItem";
import SpinnerMini from "../../static/SpinnerMini";
import MyItemComponent from "./MyItemComponent";

const MyItemsBrowser = () => {
  const [itemsArr, setItemsArr] = useState<MarketItem[] | null>(null);
  const [optimisticComp, setOptimisticComp] = useState(false);
  const [sorter, setSorter] = useState("order");
  const [notify, setNotify] = useState<NotificationObj>();
  const [edit, setEdit] = useState<{ show: boolean; item: MarketItem | null }>({
    show: false,
    item: null,
  });

  const getItem = async (id?: string) => {
    try {
      let resp;
      id
        ? (resp = await fetch(`/api/items/${id}`))
        : (resp = await fetch("/api/items/latest"));

      const data = await resp.json();

      if (data && itemsArr) {
        id
          ? setItemsArr((prev) =>
              prev
                ? prev.map((i) => (i.id === id ? { ...i, ...data } : i))
                : null,
            )
          : setItemsArr((prev) => (prev ? [...prev, data] : null));

        setOptimisticComp(false);
      } else {
        setNotify({
          show: true,
          error: true,
          message: "Could not fetch the order. Please try again.",
        });
      }
    } catch (error) {
      if (error) {
        setNotify({
          show: true,
          error: true,
          message: "Could not fetch the order. Please try again.",
        });
      }
    }
  };

  const getItems = async () => {
    try {
      const resp = await fetch("/api/items", { cache: "no-store" });
      const items = await resp.json();
      if (items.error) {
        setNotify({ error: true, show: true, message: items.error });
      } else {
        return items.items;
      }
    } catch (error) {
      setNotify({
        error: true,
        show: true,
        message: `Cannot fetch data, try again later`,
      });
      console.log(error);
    }
  };
  const SortItems = (e: React.MouseEvent) => {
    let target = e.currentTarget.innerHTML.toLowerCase();
    if (!target) {
      return null;
    }
    if (sorter !== target) {
      setSorter(target);
      setItemsArr((prev) => {
        return prev ? [...sortItems(prev, target)] : null;
      });
    } else {
      setItemsArr((prev) => {
        return prev ? [...prev.reverse()] : null;
      });
    }
  };
  const deleteItem = async (id: string) => {
    try {
      const cachedEntry = itemsArr?.filter((i) => i.id == id);

      setItemsArr((prev) =>
        prev ? [...prev.filter((i) => i.id !== id)] : null,
      );

      const resp = await fetch("/api/items", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const message = await resp.json();
      if (resp.ok) {
        setNotify({ error: false, show: true, message: message.message });
      } else if (message.error) {
        setItemsArr((prev) =>
          prev && cachedEntry ? [...prev, ...cachedEntry] : null,
        );
        setNotify({ error: true, show: true, message: message.error });
      }
    } catch (error) {
      setNotify({ error: true, show: true, message: "Something went wrong" });
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const items = await getItems();
      setItemsArr(items);
    };
    fetch();
  }, []);
  if (itemsArr === null) {
    return (
      <div className="flex min-h-screenReducedBy50percent items-center justify-center">
        <SpinnerMini h="h-32" w="w-32" borderSize="border-[1rem]" />
      </div>
    );
  } else {
    return (
      <>
        <div className="my-4 flex flex-col px-8">
          <div className="flex items-center justify-end gap-4 text-sm">
            <DropDown
              title="Sort by"
              fn={(e) => {
                SortItems(e);
              }}
              items={["Item", "Price", "Amount"]}
            />
            <AddNewItem
              optimisticFnClnUp={() => setOptimisticComp(false)}
              optimisticFn={(e) => {
                setOptimisticComp(true);
              }}
              refetchTrigger={() => {
                getItem();
              }}
            />
          </div>

          <table className="my-8  table w-full text-sm">
            <thead>
              <tr className="table-row border-b-2 border-black/25 bg-black/40">
                <th className="p-2 text-start">Item</th>
                <th className="p-2 text-start">Price</th>
                <th className="p-2 text-start">Sold&nbsp;/&nbsp;Amount</th>
                <th className="p-2 text-start"></th>
                <th className="p-2 text-start"></th>
              </tr>
            </thead>

            <tbody className="">
              {itemsArr?.map((item, i) => (
                <MyItemComponent
                  isEmpty={item.images.length === 0}
                  key={i}
                  {...item}
                  delFn={() => {
                    deleteItem(item.id);
                  }}
                  editFn={() => {
                    setEdit({ show: true, item });
                  }}
                />
              ))}
              {itemsArr.length === 0 ? (
                <tr className="flex w-full justify-center p-8">
                  <td>No Items in Database</td>
                </tr>
              ) : (
                <></>
              )}

              {optimisticComp ? <OrderSkeleton /> : <></>}
            </tbody>
          </table>
          {edit.show && edit.item ? (
            <EditItem
              {...edit.item}
              show={edit.show}
              stopDisplayingFn={() => {
                setEdit({ show: false, item: null });
              }}
              triggerFetchFn={() => {
                getItem(edit.item?.id);
              }}
              type={edit.item.itemType}
              isPreorder={edit.item.preorder}
            />
          ) : (
            <></>
          )}
        </div>
        {notify ? (
          <Notification
            error={notify.error}
            message={notify.message}
            show={notify.show}
            onAnimEnd={() => {
              setNotify({ error: false, message: "", show: false });
            }}
          />
        ) : (
          <></>
        )}
      </>
    );
  }
};
export default MyItemsBrowser;
