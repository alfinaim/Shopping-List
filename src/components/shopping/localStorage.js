// LocalStorage utility for shopping lists
const LISTS_KEY = 'shopping_lists';
const ITEMS_KEY = 'shopping_items';

// Generate unique ID
const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Shopping Lists
export const getShoppingLists = () => {
  const lists = localStorage.getItem(LISTS_KEY);
  return lists ? JSON.parse(lists) : [];
};

export const createShoppingList = (name) => {
  const lists = getShoppingLists();
  const newList = {
    id: generateId(),
    name,
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
  };
  lists.push(newList);
  localStorage.setItem(LISTS_KEY, JSON.stringify(lists));
  return newList;
};

export const updateShoppingList = (id, updates) => {
  const lists = getShoppingLists();
  const index = lists.findIndex(list => list.id === id);
  if (index !== -1) {
    lists[index] = { 
      ...lists[index], 
      ...updates, 
      updated_date: new Date().toISOString() 
    };
    localStorage.setItem(LISTS_KEY, JSON.stringify(lists));
    return lists[index];
  }
  return null;
};

export const deleteShoppingList = (id) => {
  const lists = getShoppingLists();
  const filtered = lists.filter(list => list.id !== id);
  localStorage.setItem(LISTS_KEY, JSON.stringify(filtered));
  
  // Also delete all items in this list
  const items = getShoppingItems();
  const filteredItems = items.filter(item => item.shopping_list_id !== id);
  localStorage.setItem(ITEMS_KEY, JSON.stringify(filteredItems));
};

// Shopping Items
export const getShoppingItems = (listId = null) => {
  const items = localStorage.getItem(ITEMS_KEY);
  const allItems = items ? JSON.parse(items) : [];
  
  if (listId) {
    return allItems.filter(item => item.shopping_list_id === listId);
  }
  return allItems;
};

export const createShoppingItem = (itemData) => {
  const items = getShoppingItems();
  const newItem = {
    id: generateId(),
    ...itemData,
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
  };
  items.push(newItem);
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  return newItem;
};

export const updateShoppingItem = (id, updates) => {
  const items = getShoppingItems();
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index] = { 
      ...items[index], 
      ...updates, 
      updated_date: new Date().toISOString() 
    };
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
    return items[index];
  }
  return null;
};

export const deleteShoppingItem = (id) => {
  const items = getShoppingItems();
  const filtered = items.filter(item => item.id !== id);
  localStorage.setItem(ITEMS_KEY, JSON.stringify(filtered));
};

export const getItemCountForList = (listId) => {
  return getShoppingItems(listId).length;
};

// Export/Import
export const exportData = () => {
  const lists = getShoppingLists();
  const items = getShoppingItems();
  const data = { lists, items, exportDate: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `shopping-lists-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.lists && data.items) {
          localStorage.setItem(LISTS_KEY, JSON.stringify(data.lists));
          localStorage.setItem(ITEMS_KEY, JSON.stringify(data.items));
          resolve(data);
        } else {
          reject(new Error('Invalid file format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file);
  });
};