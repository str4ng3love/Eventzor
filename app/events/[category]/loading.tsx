import SpinnerMini from "@/app/components/static/SpinnerMini";

const loading = () => {
  return (
    <main className="flex min-h-screenReducedBy6Rem flex-col items-center justify-center">
      <SpinnerMini borderSize="border-[10px]" h="h-20" w="w-20" />
      <span className="mt-32 text-3xl font-bold">
        Loading&nbsp;.&nbsp;.&nbsp;.
      </span>
    </main>
  );
};

export default loading;
