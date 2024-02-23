"use client";

type Props = {
  amount: number;
  amountSold: number;
};

const DisplayStock = ({ amount, amountSold }: Props) => {
  const stock = `w-[${(((amount - amountSold) / amount) * 100).toFixed(0)}%]`;
  const sold = `w-[${((amountSold / amount) * 100).toFixed(0)}%]`;

  if (amount - amountSold === 0) {
    return <span>Out of Stock</span>;
  }

  return (
    <span
      className={`group relative flex w-[100%] min-w-[5rem] items-center justify-between  rounded-sm px-1 ring-1 ring-text sm:mx-4`}
    >
      <span className="absolute w-full animate-fadeOut bg-black/30 text-center text-sm text-contrast group-hover:animate-fadeIn dark:text-text">
        {amount} / {amountSold}
      </span>
      <span className={`block ${stock} h-4 bg-link`} />
      <span className={`block ${sold} h-4`} />
    </span>
  );
};

export default DisplayStock;
