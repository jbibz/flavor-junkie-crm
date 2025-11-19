import salesData from "@/services/mockData/sales.json";

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for this session
let sales = [...salesData];

export const salesService = {
  async getAll() {
    await delay();
    return [...sales];
  },

  async getById(id) {
    await delay();
    const sale = sales.find(s => s.Id === id);
    if (!sale) {
      throw new Error("Sale not found");
    }
    return { ...sale };
  },

  async create(saleData) {
    await delay();
    const newSale = {
      Id: Math.max(...sales.map(s => s.Id), 0) + 1,
      ...saleData
    };
    sales.push(newSale);
    return { ...newSale };
  },

  async update(id, updates) {
    await delay();
    const index = sales.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Sale not found");
    }
    sales[index] = { ...sales[index], ...updates };
    return { ...sales[index] };
  },

  async delete(id) {
    await delay();
    const index = sales.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Sale not found");
    }
    sales.splice(index, 1);
    return true;
  }
};