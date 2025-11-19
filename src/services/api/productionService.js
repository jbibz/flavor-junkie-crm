import productionData from "@/services/mockData/production.json";

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for this session
let production = [...productionData];

export const productionService = {
  async getAll() {
    await delay();
    return [...production];
  },

  async getById(id) {
    await delay();
    const batch = production.find(p => p.Id === id);
    if (!batch) {
      throw new Error("Production batch not found");
    }
    return { ...batch };
  },

  async getByProductId(productId) {
    await delay();
    return production.filter(p => p.productId === productId);
  },

  async create(productionData) {
    await delay();
    const newBatch = {
      Id: Math.max(...production.map(p => p.Id), 0) + 1,
      ...productionData
    };
    production.push(newBatch);
    return { ...newBatch };
  },

  async update(id, updates) {
    await delay();
    const index = production.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Production batch not found");
    }
    production[index] = { ...production[index], ...updates };
    return { ...production[index] };
  },

  async delete(id) {
    await delay();
    const index = production.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Production batch not found");
    }
    production.splice(index, 1);
    return true;
  }
};