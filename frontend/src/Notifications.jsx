import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Notifications() {
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  // Load the notification message from local storage when the component mounts
  useEffect(() => {
    const savedNotificationMessage = localStorage.getItem("notificationMessage");
    if (savedNotificationMessage) {
      setNotificationMessage(savedNotificationMessage);
    }
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://revister-1.onrender.com/send-notification", { email, time });
      alert(response.data);
      console.log("Req:", email, time);
    } catch (error) {
      alert("Error sending notification: " + error.message);
    }

    const message = `Notification set for ${email} at ${time}`;
    setNotificationMessage(message);
    localStorage.setItem("notificationMessage", message);
  };

  return (
    <div>
      <h1 className="text-center font-semibold text-2xl text-gray-700">
        Get Started with setting up Notifications.
      </h1>
      <form onSubmit={handleSubmit} className="grid grid-rows-3 gap-4">
        <div className="flex justify-center items-center ml-auto mr-auto w-[500px] text-center">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            className="border p-1 w-full mb-2 text-center"
            required
          />
        </div>
        <div className="flex justify-center items-center w-[180px] ml-auto mr-auto">
          <input
            type="datetime-local"
            placeholder="Enter the time for the notification"
            value={time}
            onChange={handleTimeChange}
            className="border p-1 w-full mb-2"
            required
          />
        </div>
        <div className="flex justify-center items-center">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg">
            Set up Notifications
          </button>
        </div>
      </form>
      {notificationMessage && (
        <div className="mt-4 text-center">
          <p>{notificationMessage}</p>
        </div>
      )}
    </div>
  );
}
