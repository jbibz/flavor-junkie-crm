import componentsData from "@/services/mockData/components.json";

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for this session
let components = [...componentsData];

export const componentService = {
  async getAll() {
    await delay();
    return [...components];
  },

  async getById(id) {
    await delay();
    const component = components.find(c => c.Id === id);
    if (!component) {
      throw new Error("Component not found");
    }
    return { ...component };
  },

  async create(componentData) {
    await delay();
    const newComponent = {
      Id: Math.max(...components.map(c => c.Id), 0) + 1,
      ...componentData
    };
    components.push(newComponent);
    return { ...newComponent };
  },

  async update(id, updates) {
    await delay();
    const index = components.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Component not found");
    }
    components[index] = { ...components[index], ...updates };
    return { ...components[index] };
  },

  async delete(id) {
    await delay();
    const index = components.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Component not found");
    }
    components.splice(index, 1);
    return true;
  }
};