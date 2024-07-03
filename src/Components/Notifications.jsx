import React, { useState } from "react";
import axios from "axios"
export default function Notifications() {
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // This is where you would send the email and time to your backend or email service.
    // For example, you could use fetch or axios to post the data to your server.
    try {
        const response = await axios.post('http://localhost:5000/send-notification', { email, time });
        alert(response.data);
        console.log("Req:", email, time)
      } catch (error) {
        alert('Error sending notification: ' + error.message);
      }
    console.log("Email:", email);
    console.log("Time:", time);

    // Placeholder for actual email sending logic
    alert(`Notification set for ${email} at ${time}`);
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
    </div>
  );
}
