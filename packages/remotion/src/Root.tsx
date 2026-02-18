import React from "react";
import { Composition } from "remotion";
import { AnimatedIde } from "./compositions/AnimatedIde";
import { AnimatedIdePropsSchema } from "./schema";
import { calculateAnimatedIdeMetadata } from "./lib/calculate-metadata";
import type { AnimatedIdeProps } from "./types";

const DEFAULT_PROPS: AnimatedIdeProps = {
  settings: {
    theme: "one-hunter",
    mode: "dark",
  },
  durationPerStep: 120,
  transitionDuration: 30,
  steps: [
    {
      fileName: "page.tsx",
      filePath: ["app", "products"],
      lang: "tsx",
      code: `export default function ProductsPage() {
  return (
    <main>
      <h1>Products</h1>
    </main>
  )
}`,
    },
    {
      fileName: "page.tsx",
      filePath: ["app", "products"],
      lang: "tsx",
      code: `async function getProducts() {
  const res = await fetch("/api/products")
  return res.json()
}

export default async function ProductsPage() {
  const products = await getProducts()
  return (
    <main>
      <h1>Products</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </main>
  )
}`,
    },
    {
      fileName: "page.tsx",
      filePath: ["app", "products"],
      lang: "tsx",
      code: `import { cache } from "react"

const getProducts = cache(async () => {
  const res = await fetch("/api/products", {
    next: { revalidate: 60 },
  })
  return res.json()
})

export default async function ProductsPage() {
  const products = await getProducts()
  return (
    <main>
      <h1>Products</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </main>
  )
}`,
    },
  ],
};

const totalFrames =
  DEFAULT_PROPS.steps.length * DEFAULT_PROPS.durationPerStep +
  (DEFAULT_PROPS.steps.length - 1) * DEFAULT_PROPS.transitionDuration;

export function RemotionRoot() {
  return (
    <Composition
      id="AnimatedIde"
      component={AnimatedIde as unknown as React.ComponentType<Record<string, unknown>>}
      durationInFrames={totalFrames}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={DEFAULT_PROPS as unknown as Record<string, unknown>}
      schema={AnimatedIdePropsSchema}
      calculateMetadata={calculateAnimatedIdeMetadata as any}
    />
  );
}
