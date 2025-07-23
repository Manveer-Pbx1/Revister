import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = "http://localhost:5000";


export default function Notifications() {
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFrequencyChange = (e) => {
    setFrequency(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/setup-recurring-notification`, { 
        email, 
        frequency 
      });
      alert(response.data);
      console.log("Req:", email, frequency);
      
      const frequencyText = {
        'daily': 'Daily',
        'twice-weekly': 'Twice a Week',
        'weekly': 'Weekly',
        'monthly': 'Monthly'
      };
      
      const message = `Recurring notifications set for ${email} - ${frequencyText[frequency]}`;
      setNotificationMessage(message);
      setIsActive(true);
    } catch (error) {
      alert("Error setting up notifications: " + error.message);
    }
  };

  const handleCancel = async () => {
    try {
      const response = await axios.post(`${API_URL}/cancel-recurring-notification`, { 
        email 
      });
      alert(response.data);
      setNotificationMessage("");
      setIsActive(false);
      setFrequency("");
    } catch (error) {
      alert("Error cancelling notifications: " + error.message);
    }
  };

  return (
    <>
    <div className="w-8 h-8 p-8 font-bold cursor-pointer"
    onClick={()=> navigate('/')}>Back</div>
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-center font-semibold text-2xl text-gray-700 mb-6">
        Set up Recurring Notifications
      </h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-700 text-sm text-center"> 
          Choose how often you'd like to receive reminder emails to revisit your problems and stay consistent with your practice.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-rows-3 gap-6">
        <div className="list flex justify-center items-center ml-auto mr-auto w-[500px] text-center">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            className="border border-gray-300 p-3 w-full mb-2 text-center rounded-lg focus:border-blue-500 focus:outline-none"
            required
          />
        </div>
        <div className="flex justify-center items-center w-[400px] ml-auto mr-auto">
          <select
            value={frequency}
            onChange={handleFrequencyChange}
            className="border border-gray-300 p-3 w-full mb-2 text-center rounded-lg focus:border-blue-500 focus:outline-none"
            required
          >
            <option value="">Select notification frequency</option>
            <option value="daily">Daily</option>
            <option value="twice-weekly">Twice a Week</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="flex justify-center items-center gap-4">
          <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors">
            Set up Recurring Notifications
          </button>
          {isActive && (
            <button 
              type="button" 
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Cancel Notifications
            </button>
          )}
        </div>
      </form>
      {notificationMessage && (
        <div className="mt-6 text-center">
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg">
            <p className="font-semibold">{notificationMessage}</p>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
