import React, { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { SiLeetcode } from "react-icons/si";

export default function List() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    url: "",
    notes: "",
    completed: false,
    saved: false,
  });
  const [initialDivHidden, setInitialDivHidden] = useState(false);

  const addItem = () => {
    const date = new Date();
    setItems([...items, { ...newItem, id: Date.now(), date: date }]);
    setNewItem({
      name: "",
      url: "",
      notes: "",
      completed: false,
      saved: false,
    });
    setInitialDivHidden(true);
  };

  const updateItem = (id, key, value) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  };

  const toggleCompletion = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const saveItem = (id) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, saved: true } : item))
    );
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
      return <img src="https://img.icons8.com/color/480w/GeeksforGeeks.png" />;
    } else if (url.includes("codechef")) {
      return <img  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyjpdztXS6-ldj8Njcp1wfOYNGka-Y-1OnBw&s" />;
    }
    else if(url.includes("codeforces")){
        return <img src="https://cdn.iconscout.com/icon/free/png-256/free-code-forces-3629285-3031869.png?f=webp&w=256"/>
    }
    else if(url.includes("hackerrank")){
        return <img src="https://upload.wikimedia.org/wikipedia/commons/6/65/HackerRank_logo.png"/>
    }
  };
  return (
    <div className="flex justify-center items-center flex-col">
      {!initialDivHidden && (
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
            <div key={item.id} className="border-2 rounded p-2 w-[750px] mb-2">
              <div className=" h-6 w-6 relative right-[25px] bottom-[25px] -rotate-45">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {getIcon(item.url)}
                </a>
              </div>
              {item.saved ? (
                <>
                  <p className="text-xl font-semibold -translate-y-7">
                    {item.name}
                  </p>
                  <p className="text-lg translate-x-2 h-[80px] overflow-y-auto ">
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
                    {item.date.toLocaleString()}
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      updateItem(item.id, "name", e.target.value)
                    }
                    placeholder="Name of the problem"
                    className="border p-1 w-full mb-2"
                  />
                  <input
                    type="text"
                    value={item.url}
                    onChange={(e) => updateItem(item.id, "url", e.target.value)}
                    placeholder="URL of the problem"
                    className="border p-1 w-full mb-2"
                  />
                  <textarea
                    value={item.notes}
                    onChange={(e) =>
                      updateItem(item.id, "notes", e.target.value)
                    }
                    placeholder="Notes"
                    className="border p-1 w-full"
                  />
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
  );
}
