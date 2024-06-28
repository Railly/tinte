"use client";

import Script from "next/script";

export default function CounterscaleScript() {
  return (
    <>
      <Script id="counterscale-init" strategy="afterInteractive">
        {`
          (function () {
            window.counterscale = {
              q: [["set", "siteId", "tinte"], ["trackPageview"]],
            };
          })();
        `}
      </Script>
      <Script
        id="counterscale-script"
        src="https://counterscale.raillyhugo.workers.dev/tracker.js"
        strategy="afterInteractive"
      />
    </>
  );
}
