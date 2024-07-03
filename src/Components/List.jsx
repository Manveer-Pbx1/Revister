import React, { useState, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
import Header from "./Header";

export default function List() {
  const [items, setItems] = useState([]);
  const [revisitCount, setRevisitCount] = useState(0);
  const [newItem, setNewItem] = useState({
    name: "",
    url: "",
    notes: "",
    difficulty: "",
    completed: false,
    saved: false,
  });
  const [initialDivHidden, setInitialDivHidden] = useState(false);

  // Load saved items and revisits from local storage when the component mounts
  useEffect(() => {
    const savedItems = localStorage.getItem("savedListing");
    const savedRevisits = localStorage.getItem("revisits");
    
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        setItems(parsedItems);
      } catch (error) {
        console.error("Failed to parse items from local storage", error);
      }
    }
    
    if (savedRevisits) {
      setRevisitCount(parseInt(savedRevisits, 10));
    }
  }, []);

  const addItem = () => {
    const date = new Date();
    const updatedItems = [...items, { ...newItem, id: Date.now(), date: date }];
    setItems(updatedItems);
    setNewItem({
      name: "",
      url: "",
      notes: "",
      difficulty: "",
      completed: false,
      saved: false,
    });
    setInitialDivHidden(true);
    localStorage.setItem("savedListing", JSON.stringify(updatedItems));
  };

  const updateItem = (id, key, value) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, [key]: value } : item
    );
    setItems(updatedItems);
    localStorage.setItem("savedListing", JSON.stringify(updatedItems));
  };

  const toggleCompletion = (id) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setItems(updatedItems);
    localStorage.setItem("savedListing", JSON.stringify(updatedItems));
  };

  const saveItem = (id) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, saved: true } : item
    );
    setItems(updatedItems);
    localStorage.setItem("savedListing", JSON.stringify(updatedItems));
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
          <div className="border-2 text-center rounded-full w-[750px] p-2 mb-4">
            <CiCirclePlus
              className="text-4xl text-red-500 ml-auto mr-auto cursor-pointer hover:text-red-400"
              onClick={addItem}
            />
            <br />
            <p className="text-2xl text-blue-400 font-semibold">
              Go ahead! Add a Listing.
            </p>
          </div>
        )}
        {items.map(
          (item) =>
            !item.completed && (
              <div
                key={item.id}
                className="border-2 rounded p-2 w-[750px] mb-2"
              >
                <div className="h-6 w-6 relative right-[25px] bottom-[25px] -rotate-45">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      const newRevisitCount = revisitCount + 1;
                      setRevisitCount(newRevisitCount);
                      localStorage.setItem("revisits", newRevisitCount.toString());
                    }}
                  >
                    {getIcon(item.url)}
                  </a>
                </div>
                {item.saved ? (
                  <>
                    <p className="text-xl font-semibold -translate-y-7">
                      {item.url
                        .split("/")[4]
                        .split("-")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
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
                    <p className="text-md translate-x-2 h-[80px] overflow-y-auto ">
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
                      Revisits: { }
                    </span>
                  </>
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
                  </>
                )}
                <div className="flex justify-between items-center">
                  {!item.saved && (
                    <button
                      onClick={() => saveItem(item.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            )
        )}
        {items.length > 0 && (
          <div className="border-2 rounded p-2 w-[750px] mb-4 text-center">
            <CiCirclePlus
              className="text-4xl text-red-500 ml-auto mr-auto cursor-pointer hover:text-red-400 mb-2"
              onClick={addItem}
            />
          </div>
        )}
      </div>
    </>
  );
}
