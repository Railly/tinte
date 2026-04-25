interface ThankYouPageProps {
  searchParams?: Promise<{
    checkout_id?: string;
    kit_id?: string;
    plan?: string;
  }>;
}

export default async function ThankYouPage({
  searchParams,
}: ThankYouPageProps) {
  const params = searchParams ? await searchParams : {};
  const kitId = params.kit_id;
  const plan = params.plan === "kit_pack_5" ? "Kit Pack 5" : "Kit Pro";

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-xl rounded-lg border border-[#2b2925] bg-[#171613] p-6">
        <p className="text-[#d8ff5f] text-sm uppercase tracking-[0.18em]">
          Payment received
        </p>
        <h1 className="mt-3 font-semibold text-3xl">
          Your kit is unlocking...
        </h1>
        <p className="mt-3 text-[#a7a096]">
          {plan} is being applied. The premium expansion starts as soon as the
          Polar webhook confirms the order.
        </p>
        {params.checkout_id ? (
          <p className="mt-4 text-[#69645b] text-xs">
            Checkout {params.checkout_id}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          {kitId ? (
            <a
              className="inline-flex h-10 items-center rounded-md bg-[#d8ff5f] px-4 font-medium text-[#10110a] text-sm"
              href={`/k/${kitId}`}
            >
              Go to your kit
            </a>
          ) : null}
          <a
            className="inline-flex h-10 items-center rounded-md border border-[#2b2925] px-4 font-medium text-sm"
            href="/"
          >
            Generate another
          </a>
        </div>
      </section>
    </main>
  );
}
