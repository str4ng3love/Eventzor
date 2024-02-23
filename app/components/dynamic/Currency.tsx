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
      setSelected({ exchangeRateToUSD: 1, name: "usd" });
    }
  }, []);
  useEffect(() => {
    if (manual) {
      localStorage.setItem(
        "currency",
        JSON.stringify({
          name: selected.name,
          rate: selected.exchangeRateToUSD,
        }),
      );

      window.dispatchEvent(new Event("currency"));
      setManual(false);
    }
  }, [selected && manual]);
  return (
    <>
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <Listbox.Button
            className={`w-fit cursor-pointer p-2 transition-all duration-300 hover:bg-link ${selected.name === `initial` ? "bg-link dark:bg-inherit" : ""}`}
          >
            {selected.name === "initial" ? (
              <SpinnerMini />
            ) : (
              selected?.name.toLocaleUpperCase()
            )}
          </Listbox.Button>
          <Listbox.Options
            className={`absolute left-0 top-0 z-10 flex flex-col bg-bg text-text dark:ring-2 dark:ring-primary`}
          >
            {currencies && currencies.length > 0 ? (
              currencies.map((currency) => (
                <Listbox.Option
                  onClick={(e) => setManual(true)}
                  key={currency.id}
                  className={`${
                    selected.name === currency.name ? "hidden" : ""
                  } cursor-pointer p-2 text-text transition-all duration-300 hover:bg-link hover:text-contrast dark:hover:text-text`}
                  value={currency}
                >
                  {currency.name.toLocaleUpperCase()}
                </Listbox.Option>
              ))
            ) : (
              <></>
            )}
          </Listbox.Options>
        </div>
      </Listbox>
    </>
  );
};

export default Currency;
