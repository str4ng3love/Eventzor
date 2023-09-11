"use client";

import { useEffect, useState } from "react";
import SpinnerMini from "./SpinnerMini";

interface Props {
  price: number;
}

const PriceDisplay = ({ price }: Props) => {
  const [currency, setCurrency] = useState({ name: "initial", rate: 1 });
  useEffect(() => {
    window.addEventListener("currency", () => {
      const currency = localStorage.getItem("currency");
      if (currency) {
        let selectedCurrency = JSON.parse(currency);
        setCurrency({
          name: selectedCurrency.name,
          rate: selectedCurrency.rate,
        });
      } else {
        setCurrency({
          name: "usd",
          rate: 1,
        });
      }
    });
    return () => {
      window.removeEventListener("currency", () => {});
    };
  }, []);
  useEffect(() => {
    let prefCurrency = localStorage.getItem("currency");
    if (prefCurrency) {
      let selectedCurrency = JSON.parse(prefCurrency);
      setCurrency({
        name: selectedCurrency.name,
        rate: selectedCurrency.rate,
      });
    }
    if (!prefCurrency) {
      setCurrency({
        name: "usd",
        rate: 1,
      });
    }
  }, []);
  return (
    <span className="flex items-center justify-center">
      {currency.name !== "initial" ? (
        (price * currency.rate).toFixed(2)
      ) : (
        <SpinnerMini borderSize="border-[4px]" h="h-4" w="w-4" />
      )}
      &nbsp;
      {currency.name !== "initial" ? currency.name.toLocaleUpperCase() : ""}
    </span>
  );
};

export default PriceDisplay;
