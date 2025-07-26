import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

const IncomeManager = () => {
  const [dailyEntries, setDailyEntries] = useState([]);
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");
  const [totalObject, setTotalObject] = useState(null);
  const [loading, setLoading] = useState(false);
  const baseUrl = "https://687a60b8abb83744b7ec9790.mockapi.io/api/gym/income";

  // Fetch on mount
  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(baseUrl);
      const daily = data.filter(
        (entry) => entry.type === "daily" || entry.type === "subscription"
      );
      const total = data.find((entry) => entry.type === "total");
      setDailyEntries(daily);
      setTotalObject(total);
    } catch (error) {
      console.error("فشل في جلب الدخل:", error);
      alert("فشل في جلب الدخل. راجع وحدة التحكم للمزيد من التفاصيل.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    setLoading(true);
    try {
      const parsedAmount = parseFloat(amount);
      if (!note || isNaN(parsedAmount) || !totalObject) {
        alert("يرجى إدخال ملاحظة ومبلغ صحيح.");
        return;
      }
      const newEntry = {
        note,
        amount: parsedAmount,
        data: dayjs().format("YYYY-MM-DD"),
        type: "daily",
      };

      // Use the response from the backend, which includes the assigned id
      const response = await axios.post(baseUrl, newEntry);
      const createdEntry = response.data;

      const updatedDaily = [...dailyEntries, createdEntry];
      setDailyEntries(updatedDaily);

      const dailyIncome = updatedDaily.reduce(
        (acc, curr) => acc + curr.amount,
        0
      );
      const newTotal = {
        ...totalObject,
        dailyIncome,
        monthlyIncome: totalObject.monthlyIncome + parsedAmount,
        yearlyIncome: totalObject.yearlyIncome + parsedAmount,
      };
      await axios.put(`${baseUrl}/${totalObject.id}`, newTotal);
      setTotalObject(newTotal);

      setNote("");
      setAmount("");
    } catch (error) {
      console.error("فشل في إضافة الإدخال:", error);
      alert("فشل في إضافة الإدخال. راجع وحدة التحكم للمزيد من التفاصيل.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId, entryAmount) => {
    setLoading(true);
    try {
      // Delete from backend
      await axios.delete(`${baseUrl}/${entryId}`);

      // Remove from local state
      const updatedEntries = dailyEntries.filter(
        (entry) => entry.id !== entryId
      );
      setDailyEntries(updatedEntries);

      // Recalculate totals
      const dailyIncome = updatedEntries.reduce(
        (acc, curr) => acc + curr.amount,
        0
      );

      // Update monthly and yearly only if the deleted entry is from today/this month/this year
      // For simplicity, always subtract the amount (like your add logic)
      const newTotal = {
        ...totalObject,
        dailyIncome,
        monthlyIncome: totalObject.monthlyIncome - entryAmount,
        yearlyIncome: totalObject.yearlyIncome - entryAmount,
      };

      await axios.put(`${baseUrl}/${totalObject.id}`, newTotal);
      setTotalObject(newTotal);
    } catch (error) {
      alert("فشل في حذف الإدخال. راجع وحدة التحكم للمزيد من التفاصيل.");
      console.error("فشل في حذف الإدخال:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodayEntries = async () => {
    setLoading(true);
    try {
      const today = dayjs().format("YYYY-MM-DD");
      // Find all daily/subscription entries for today
      const todayEntries = dailyEntries.filter(
        (entry) =>
          (entry.type === "daily" || entry.type === "subscription") &&
          (entry.data === today || entry.date === today)
      );
      // Delete each entry from backend
      for (const entry of todayEntries) {
        await axios.delete(`${baseUrl}/${entry.id}`);
      }
      // Remove from local state
      const remainingEntries = dailyEntries.filter(
        (entry) =>
          !(
            (entry.type === "daily" || entry.type === "subscription") &&
            (entry.data === today || entry.date === today)
          )
      );
      setDailyEntries(remainingEntries);

      // Reset daily income in totalObject
      if (totalObject) {
        const updatedTotal = { ...totalObject, dailyIncome: 0 };
        await axios.put(`${baseUrl}/${totalObject.id}`, updatedTotal);
        setTotalObject(updatedTotal);
      }
    } catch (error) {
      alert("فشل في حذف إدخالات اليوم. راجع وحدة التحكم للمزيد من التفاصيل.");
      console.error("فشل في حذف إدخالات اليوم:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetDailyIfNeeded = async () => {
    setLoading(true);
    const today = dayjs().format("YYYY-MM-DD");
    // Find the latest date among daily/subscription entries
    const relevantEntries = dailyEntries.filter(
      (entry) => entry.type === "daily" || entry.type === "subscription"
    );
    const lastEntryDate = relevantEntries[0]?.data;
    if (lastEntryDate && lastEntryDate !== today) {
      // Delete all daily and subscription entries
      for (const entry of relevantEntries) {
        await axios.delete(`${baseUrl}/${entry.id}`);
      }
      // Reset daily income in totalObject
      if (totalObject) {
        const updatedTotal = { ...totalObject, dailyIncome: 0 };
        await axios.put(`${baseUrl}/${totalObject.id}`, updatedTotal);
        setTotalObject(updatedTotal);
      }
      // Remove deleted entries from local state
      const remainingEntries = dailyEntries.filter(
        (entry) => entry.type !== "daily" && entry.type !== "subscription"
      );
      setDailyEntries(remainingEntries);
    }
    setLoading(false);
  };

  const resetMonthlyIfNeeded = async () => {
    setLoading(true);
    const currentMonth = dayjs().format("MM");
    const entriesThisMonth = dailyEntries.filter(
      (entry) => dayjs(entry.data).format("MM") === currentMonth
    );
    if (entriesThisMonth.length === 0 && totalObject.monthlyIncome !== 0) {
      const updatedTotal = { ...totalObject, monthlyIncome: 0, dailyIncome: 0 };
      await axios.put(`${baseUrl}/${totalObject.id}`, updatedTotal);
      setTotalObject(updatedTotal);
    }
    setLoading(false);
  };

  useEffect(() => {
    resetDailyIfNeeded();
    resetMonthlyIfNeeded();
  }, [dailyEntries]);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-50 flex items-center justify-center py-8"
    >
      {loading && (
        <div className="fixed inset-0 bg-blue-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-2">
          <span role="img" aria-label="calendar">
            📅
          </span>{" "}
          متتبع الدخل اليومي
        </h2>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="ملاحظة"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            disabled={loading}
          />
          <input
            type="number"
            placeholder="المبلغ"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-40 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            disabled={loading}
          />
          <button
            onClick={handleAddEntry}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition-colors text-lg flex items-center gap-2 shadow"
            disabled={loading}
          >
            <span role="img" aria-label="add">
              ➕
            </span>{" "}
            إضافة إدخال
          </button>
        </div>
        <hr className="my-6" />
        <h3 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <span role="img" aria-label="money">
            💰
          </span>{" "}
          الإدخالات اليومية
        </h3>
        <button
          onClick={handleDeleteTodayEntries}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded transition-colors text-lg flex items-center gap-2 shadow mb-4"
          disabled={loading}
        >
          <span role="img" aria-label="delete">
            🗑️
          </span>
          حذف إدخالات اليوم
        </button>
        <ul className="mb-8 space-y-2">
          {dailyEntries.map((entry) => (
            <li
              key={entry.id}
              className="bg-gray-100 rounded px-4 py-2 flex justify-between items-center text-lg"
            >
              <span>
                {entry.data || entry.date} - {entry.note}: {entry.amount}{" "}
                <span className="text-green-600 font-bold">ج.م</span>
                {entry.type === "subscription" && (
                  <span className="ml-2 text-blue-500">- اشتراك</span>
                )}
              </span>
              <button
                onClick={() => handleDeleteEntry(entry.id, entry.amount)}
                className="text-red-600 hover:text-red-800 transition-colors ml-4"
                title="حذف"
                disabled={loading}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
        <h3 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <span role="img" aria-label="chart">
            📊
          </span>{" "}
          الملخص
        </h3>
        {totalObject && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded p-4 text-center">
              <p className="text-lg font-medium text-blue-800">اليومي</p>
              <p className="text-2xl font-bold text-blue-900">
                {totalObject.dailyIncome}{" "}
                <span className="text-green-600">ج.م</span>
              </p>
            </div>
            <div className="bg-green-50 rounded p-4 text-center">
              <p className="text-lg font-medium text-green-800">الشهري</p>
              <p className="text-2xl font-bold text-green-900">
                {totalObject.monthlyIncome}{" "}
                <span className="text-green-600">ج.م</span>
              </p>
            </div>
            <div className="bg-yellow-50 rounded p-4 text-center">
              <p className="text-lg font-medium text-yellow-800">السنوي</p>
              <p className="text-2xl font-bold text-yellow-900">
                {totalObject.yearlyIncome}{" "}
                <span className="text-green-600">ج.م</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeManager;
