import React, { useState, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
import Header from "./Header";
import {
  getItemsFromStorage,
  addItemToStorage,
  updateItemInStorage,
  toggleItemCompletion,
  incrementRevisitCount as incrementRevisitCountInStorage
} from "./utils/localStorage";
import { syncWithExtension } from "./utils/extensionSync";

export default function List() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    url: "",
    notes: "",
    difficulty: "",
    completed: false,
    saved: false,
    revisitCount: 0,
  });
  const [initialDivHidden, setInitialDivHidden] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [showNewItemForm, setShowNewItemForm] = useState(false);

  useEffect(() => {
    fetchItems();
    
    // Listen for storage events (from extension or other tabs)
    const handleStorageChange = () => {
      fetchItems();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const fetchItems = async () => {
    try {
      // First try to sync with extension
      const syncedItems = await syncWithExtension();
      
      if (syncedItems) {
        // Sort by date descending (newest first)
        const sortedItems = syncedItems.sort((a, b) => new Date(b.date) - new Date(a.date));
        setItems(sortedItems);
      } else {
        // Fallback to localStorage only
        const storedItems = getItemsFromStorage();
        const sortedItems = storedItems.sort((a, b) => new Date(b.date) - new Date(a.date));
        setItems(sortedItems);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      // Fallback to localStorage
      const storedItems = getItemsFromStorage();
      const sortedItems = storedItems.sort((a, b) => new Date(b.date) - new Date(a.date));
      setItems(sortedItems);
    }
  };

  const handleNewItemChange = (key, value) => {
    setNewItem({ ...newItem, [key]: value });
  };

  const showAddForm = () => {
    setShowNewItemForm(true);
    setInitialDivHidden(true);
  };

  const cancelAddForm = () => {
    setShowNewItemForm(false);
    setNewItem({
      name: "",
      url: "",
      notes: "",
      difficulty: "",
      completed: false,
      saved: false,
      revisitCount: 0,
    });
    if (items.length === 0) {
      setInitialDivHidden(false);
    }
  };

  const addItem = () => {
    try {
      if (!newItem.url || !newItem.notes || !newItem.difficulty) {
        alert("URL, notes, and difficulty are required");
        return;
      }

      const itemToAdd = { ...newItem, saved: true };
      const savedItem = addItemToStorage(itemToAdd);
      setItems([savedItem, ...items]);
      setNewItem({
        name: "",
        url: "",
        notes: "",
        difficulty: "",
        completed: false,
        saved: false,
        revisitCount: 0,
      });
      setShowNewItemForm(false);
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Error adding item: " + error.message);
    }
  };

  const updateItem = (id, key, value) => {
    try {
      const updates = { [key]: value };
      updateItemInStorage(id, updates);
      
      setItems(items.map(item => 
        item.id === id ? { ...item, [key]: value } : item
      ));
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const toggleCompletion = (id) => {
    try {
      const updatedItem = toggleItemCompletion(id);
      setItems(items.map(item => 
        item.id === id ? updatedItem : item
      ));
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
  };

  const saveItem = (id) => {
    try {
      updateItemInStorage(id, { saved: true });
      setItems(items.map(item => 
        item.id === id ? { ...item, saved: true } : item
      ));
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const startEditing = (id) => {
    setEditingItemId(id);
  };

  const cancelEditing = () => {
    setEditingItemId(null);
  };

  const saveChanges = (id) => {
    saveItem(id);
    setEditingItemId(null);
  };

  const incrementRevisitCount = (id) => {
    try {
      const updatedItem = incrementRevisitCountInStorage(id);
      setItems(items.map(item => 
        item.id === id ? updatedItem : item
      ));
    } catch (error) {
      console.error("Error incrementing revisit count:", error);
    }
  };

  const getIcon = (url) => {
    if (url.includes("leetcode")) {
      return (
        <img
          src="https://cdn.iconscout.com/icon/free/png-512/free-leetcode-3628885-3030025.png?f=webp&w=512"
          alt="LeetCode Icon"
        />
      );
    } else if (url.includes("geeksforgeeks")) {
      return (
        <img
          src="https://img.icons8.com/color/480w/GeeksforGeeks.png"
          alt="GeeksforGeeks Icon"
        />
      );
    } else if (url.includes("codechef")) {
      return (
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyjpdztXS6-ldj8Njcp1wfOYNGka-Y-1OnBw&s"
          alt="CodeChef Icon"
        />
      );
    } else if (url.includes("codeforces")) {
      return (
        <img
          src="https://cdn.iconscout.com/icon/free/png-256/free-code-forces-3629285-3031869.png?f=webp&w=256"
          alt="Codeforces Icon"
        />
      );
    } else if (url.includes("hackerrank")) {
      return (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/65/HackerRank_logo.png"
          alt="HackerRank Icon"
        />
      );
    }
    return null;
  };

  return (
    <>
      <Header />
      <div className="flex justify-center items-center flex-col">
        {!initialDivHidden && items.length === 0 && (
          <div className="list border-2 text-center rounded-full w-[750px] p-2 mb-4">
            <CiCirclePlus
              className="text-4xl text-red-500 ml-auto mr-auto cursor-pointer hover:text-red-400"
              onClick={showAddForm}
            />
          </div>
        )}

        {showNewItemForm && (
          <div className="list border-2 rounded p-2 w-[750px] mb-4">
            <input
              type="text"
              value={newItem.url}
              onChange={(e) => handleNewItemChange("url", e.target.value)}
              placeholder="URL of the problem"
              className="border p-1 w-full mb-2"
            />
            <textarea
              value={newItem.notes}
              onChange={(e) => handleNewItemChange("notes", e.target.value)}
              placeholder="Notes"
              className="border p-1 w-full mb-2"
            />
            <div className="text-lg space-x-3 mb-2">
              <input
                type="radio"
                className="h-4 w-4"
                name="difficulty-new"
                value="Easy"
                checked={newItem.difficulty === "Easy"}
                onChange={(e) => handleNewItemChange("difficulty", e.target.value)}
              />
              <label className="text-green-600 font-semibold">Easy</label>
              <input
                type="radio"
                className="h-4 w-4"
                name="difficulty-new"
                value="Medium"
                checked={newItem.difficulty === "Medium"}
                onChange={(e) => handleNewItemChange("difficulty", e.target.value)}
              />
              <label className="text-yellow-600 font-semibold">Medium</label>
              <input
                type="radio"
                className="h-4 w-4"
                name="difficulty-new"
                value="Hard"
                checked={newItem.difficulty === "Hard"}
                onChange={(e) => handleNewItemChange("difficulty", e.target.value)}
              />
              <label className="text-red-600 font-semibold">Hard</label>
            </div>
            <div className="flex justify-between">
              <button
                onClick={addItem}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                Save
              </button>
              <button
                onClick={cancelAddForm}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {items.map(
          (item) =>
            !item.completed && (
              <div
                key={item.id}
                className="list border-2 rounded p-2 w-[750px] mb-2"
              >
                <div className="h-6 w-6 relative right-[25px] bottom-[25px] -rotate-45">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => incrementRevisitCount(item.id)}
                  >
                    {getIcon(item.url)}
                  </a>
                </div>
                {item.saved && editingItemId !== item.id ? (
                  <a>
                    <p className="text-xl font-semibold -translate-y-7 hover:text-[#246dad]">
                    <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => incrementRevisitCount(item.id)}
                  >
                      {item.url && item.url.split("/")[4]
                        ? item.url
                            .split("/")[4]
                            .split("-")
                            .map(
                              (word) => word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                        : "No Title"}
                        </a>
                      <span
                        className={
                          item.difficulty === "Easy"
                            ? "text-green-600 px-4 text-sm bg-green-100 rounded-full p-2 ml-5"
                            : item.difficulty === "Medium"
                            ? "text-yellow-600 text-sm bg-yellow-100 rounded-full p-2 px-4 ml-5"
                            : "text-red-600 text-sm bg-red-100 rounded-full p-2 px-4 ml-5"
                        }
                      >
                        {item.difficulty}
                      </span>
                    </p>
                    <p className="text-sm translate-x-2 h-[80px] overflow-y-auto text-gray-700 font-bold font-sans">
                      {item.notes}
                    </p>
                    <div className="relative float-right bottom-[125px]">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        className="h-5 w-5 cursor-pointer"
                        onChange={() => toggleCompletion(item.id)}
                      />
                    </div>
                    <div className="text-gray-500 text-sm relative float-right">
                      {new Date(item.date).toLocaleString()}
                    </div>
                    <span className="font-semibold text-orange-400">
                      Revisits:  {0 || item.revisitCount}
                    </span>
                    <button
                      onClick={() => startEditing(item.id)}
                      className="bg-yellow-500 text-white px-2 py-1 font-bold rounded ml-2"
                    >
                      Edit
                    </button>
                  </a>
                ) : (
                  <>
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) =>
                        updateItem(item.id, "url", e.target.value)
                      }
                      placeholder="URL of the problem"
                      className="border p-1 w-full mb-2"
                    />
                    <textarea
                      value={item.notes}
                      onChange={(e) =>
                        updateItem(item.id, "notes", e.target.value)
                      }
                      placeholder="Notes"
                      className="border p-1 w-full mb-2"
                    />
                    <div className="text-lg space-x-3 mb-2">
                      <input
                        type="radio"
                        className="h-4 w-4"
                        name={`difficulty-${item.id}`}
                        value="Easy"
                        checked={item.difficulty === "Easy"}
                        onChange={(e) =>
                          updateItem(item.id, "difficulty", e.target.value)
                        }
                      />
                      <label className="text-green-600 font-semibold">
                        Easy
                      </label>
                      <input
                        type="radio"
                        className="h-4 w-4"
                        name={`difficulty-${item.id}`}
                        value="Medium"
                        checked={item.difficulty === "Medium"}
                        onChange={(e) =>
                          updateItem(item.id, "difficulty", e.target.value)
                        }
                      />
                      <label className="text-yellow-600 font-semibold">
                        Medium
                      </label>
                      <input
                        type="radio"
                        className="h-4 w-4"
                        name={`difficulty-${item.id}`}
                        value="Hard"
                        checked={item.difficulty === "Hard"}
                        onChange={(e) =>
                          updateItem(item.id, "difficulty", e.target.value)
                        }
                      />
                      <label className="text-red-600 font-semibold">Hard</label>
                    </div>
                    <div className="flex justify-between">
                      <button
                        onClick={() => saveChanges(item.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            )
        )}
        {items.length > 0 && !showNewItemForm && (
          <div className="list border-2 text-center rounded-full w-[750px] p-2 mb-4">
            <CiCirclePlus
              className="text-4xl text-red-500 ml-auto mr-auto cursor-pointer hover:text-red-400"
              onClick={showAddForm}
            />
          </div>
        )}
      </div>
    </>
  );
}