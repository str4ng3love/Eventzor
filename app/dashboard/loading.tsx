import SpinnerMini from "@/app/components/static/SpinnerMini";
import React from "react";

const loading = () => {
  return (
    <main className="flex min-h-screenReducedBy4p5Rem flex-col items-center justify-center bg-black/20">
      <SpinnerMini borderSize="border-[10px]" h="h-20" w="w-20" />
      <span className="mt-32 text-3xl font-bold">
        Loading&nbsp;.&nbsp;.&nbsp;.
      </span>
    </main>
  );
};

export default loading;
