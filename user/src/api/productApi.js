export async function getAllProducts() {
  const res = await fetch("https://femcloudfinal2025.onrender.com/api/products");
  return res.json(); // [{ _id, name, description, price, image, category, whatsappNumber, seller }]
}
