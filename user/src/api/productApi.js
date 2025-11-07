export async function getAllProducts() {
  const res = await fetch("http://localhost:4000/api/products");
  return res.json(); // [{ _id, name, description, price, image, category, whatsappNumber, seller }]
}
