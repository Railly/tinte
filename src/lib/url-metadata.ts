export async function fetchUrlMetadata(url: string): Promise<{
  title: string;
  description: string;
  favicon: string;
}> {
  try {
    const response = await fetch("/api/fetch-meta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (response.ok) {
      return await response.json();
    }

    throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    console.error("Failed to fetch metadata:", error);
    throw error;
  }
}
