import productsData from "@/services/mockData/products.json";

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for this session
let products = [...productsData];

export const productService = {
  async getAll() {
    await delay();
    return [...products];
  },

  async getById(id) {
    await delay();
    const product = products.find(p => p.Id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  },

  async create(productData) {
    await delay();
    const newProduct = {
      Id: Math.max(...products.map(p => p.Id), 0) + 1,
      ...productData
    };
    products.push(newProduct);
    return { ...newProduct };
  },

  async update(id, updates) {
    await delay();
    const index = products.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    products[index] = { ...products[index], ...updates };
    return { ...products[index] };
  },

  async delete(id) {
    await delay();
    const index = products.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    products.splice(index, 1);
    return true;
  }
};