// localStorage utility functions for managing items
import { v4 as uuidv4 } from 'uuid';

const ITEMS_KEY = 'revister_items';

// Helper function to get all items from localStorage
export const getItemsFromStorage = () => {
  try {
    const items = localStorage.getItem(ITEMS_KEY);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Error reading items from localStorage:', error);
    return [];
  }
};

// Helper function to save items to localStorage
export const saveItemsToStorage = (items) => {
  try {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
    return true;
  } catch (error) {
    console.error('Error saving items to localStorage:', error);
    return false;
  }
};

// Add a new item
export const addItemToStorage = (itemData) => {
  try {
    const items = getItemsFromStorage();
    const newItem = {
      id: uuidv4(),
      name: itemData.name || '',
      url: itemData.url,
      notes: itemData.notes,
      difficulty: itemData.difficulty,
      completed: itemData.completed || false,
      saved: itemData.saved !== undefined ? itemData.saved : true,
      revisitCount: itemData.revisitCount || 0,
      date: new Date().toISOString()
    };
    
    const updatedItems = [newItem, ...items];
    saveItemsToStorage(updatedItems);
    return newItem;
  } catch (error) {
    console.error('Error adding item to localStorage:', error);
    throw error;
  }
};

// Update an existing item
export const updateItemInStorage = (id, updates) => {
  try {
    const items = getItemsFromStorage();
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      throw new Error('Item not found');
    }
    
    items[itemIndex] = { ...items[itemIndex], ...updates };
    saveItemsToStorage(items);
    return items[itemIndex];
  } catch (error) {
    console.error('Error updating item in localStorage:', error);
    throw error;
  }
};

// Delete an item
export const deleteItemFromStorage = (id) => {
  try {
    const items = getItemsFromStorage();
    const filteredItems = items.filter(item => item.id !== id);
    saveItemsToStorage(filteredItems);
    return true;
  } catch (error) {
    console.error('Error deleting item from localStorage:', error);
    return false;
  }
};

// Toggle completion status
export const toggleItemCompletion = (id) => {
  try {
    const items = getItemsFromStorage();
    const item = items.find(item => item.id === id);
    
    if (!item) {
      throw new Error('Item not found');
    }
    
    return updateItemInStorage(id, { completed: !item.completed });
  } catch (error) {
    console.error('Error toggling item completion:', error);
    throw error;
  }
};

// Increment revisit count
export const incrementRevisitCount = (id) => {
  try {
    const items = getItemsFromStorage();
    const item = items.find(item => item.id === id);
    
    if (!item) {
      throw new Error('Item not found');
    }
    
    return updateItemInStorage(id, { revisitCount: (item.revisitCount || 0) + 1 });
  } catch (error) {
    console.error('Error incrementing revisit count:', error);
    throw error;
  }
};
