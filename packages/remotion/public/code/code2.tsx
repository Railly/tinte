async function getProducts() {
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
}
