import { cache, Suspense } from "react"

const getProducts = cache(async () => {
  const res = await fetch("/api/products", {
    next: { revalidate: 60 },
  })
  return res.json()
})

async function ProductList() {
  const products = await getProducts()
  return (
    <ul>
      {products.map((p: { id: string; name: string }) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  )
}

export default function ProductsPage() {
  return (
    <main>
      <h1>Products</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <ProductList />
      </Suspense>
    </main>
  )
}
