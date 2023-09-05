"use client";
import { Listbox } from "@headlessui/react";
import { useEffect, useState } from "react";
import SpinnerMini from "../static/SpinnerMini";
interface Props {
  currentCurrency?: { name: string; exchangeRateToUSD: number };
}
const Currency = ({
  currentCurrency = { name: "initial", exchangeRateToUSD: 1 },
}: Props) => {
  const [manual, setManual] = useState(false);
  const [selected, setSelected] = useState(currentCurrency);
  const [currencies, setCurrencies] = useState<
    { name: string; rate: string; id: string }[]
  >([]);

  const getCurrencies = async () => {
    try {
      const resp = await fetch("/api/currency");
      const data = await resp.json();

      setCurrencies(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    window.addEventListener("currency", () => {
      const currency = localStorage.getItem("currency");
      if (currency) {
        let selectedCurrency = JSON.parse(currency);
        setSelected({
          name: selectedCurrency.name,
          exchangeRateToUSD: selectedCurrency.rate,
        });
      }
    });
    return () => {
      window.removeEventListener("currency", () => {});
    };
  }, []);
  useEffect(() => {
    getCurrencies();

    let prefCurrency = localStorage.getItem("currency");
    if (prefCurrency) {

      let selectedCurrency = JSON.parse(prefCurrency);
      
      setSelected({
        name: selectedCurrency.name,
        exchangeRateToUSD: selectedCurrency.rate,
      });
    } else {
      setSelected({exchangeRateToUSD:1, name:"usd"})
    }
  }, []);
  useEffect(() => {
    if (manual) {
      localStorage.setItem(
        "currency",
        JSON.stringify({
          name: selected.name,
          rate: selected.exchangeRateToUSD,
        })
      );

      window.dispatchEvent(new Event("currency"));
      setManual(false);
    }
  }, [selected && manual]);
  return (
    <>
      <Listbox value={selected} onChange={setSelected}>
        <Listbox.Button
          className={`p-2 bg-bg_interactive ring-2 ring-primary w-fit relative z-50 hover:bg-link`}
        >
          {selected.name ==='initial' ? <SpinnerMini />: selected?.name.toLocaleUpperCase() }
        </Listbox.Button>
        <Listbox.Options
          className={`absolute bg-primary  flex flex-row z-50 ring-2 ring-primary`}
        >
          {currencies && currencies.length > 0 ? (
            currencies.map((currency) => (
              <Listbox.Option
                onClick={(e) => setManual(true)}
                key={currency.id}
                className={`${
                  selected.name === currency.name ? "hidden" : ""
                } hover:bg-link p-2 transition-all 300ms`}
                value={currency}
              >
                {currency.name.toLocaleUpperCase()}
              </Listbox.Option>
            ))
          ) : (
            <></>
          )}
        </Listbox.Options>
      </Listbox>
    </>
  );
};

export default Currency;
