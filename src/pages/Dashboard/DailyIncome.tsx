import { useEffect, useState } from "react";
import axios from "axios";

export default function DailyIncome() {
  const [dailyAmount, setDailyAmount] = useState<number>(0);
  const [dailyIncomeEntries, setDailyIncomeEntries] = useState<
    { amount: number; date: string }[]
  >([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [yearlyIncome, setYearlyIncome] = useState<number>(0);

  // Get current month and year for filtering
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  const currentYear = currentDate.getFullYear();

  // Fetch data from the JSON server
  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        // Fetch members
        const membersResponse = await axios.get(
          "https://plume-numerous-homburg.glitch.me/members"
        );
        const members = membersResponse.data;

        // Fetch income data
        const incomeResponse = await axios.get(
          "https://plume-numerous-homburg.glitch.me/income"
        );
        const incomeData = incomeResponse.data;

        // Set daily income entries
        setDailyIncomeEntries(incomeData.dailyEntries || []);

        // Calculate subscription income for the current month
        const activeMembers = members.filter(
          (member: any) => member.status === "Active"
        );
        const subscriptionIncome = activeMembers.reduce(
          (acc: number, member: any) => {
            const startDate = new Date(member.startDate);
            const endDate = new Date(member.endDate);
            const memberMonth = startDate.getMonth() + 1;
            const memberYear = startDate.getFullYear();

            // Check if the subscription is valid for the current month
            if (
              memberYear === currentYear &&
              memberMonth <= currentMonth &&
              endDate >= currentDate
            ) {
              return acc + (Number(member.subscriptionPrice) || 0);
            }
            return acc;
          },
          0
        );

        // Calculate daily income for the current month
        const monthlyDailyIncome = (incomeData.dailyEntries || []).reduce(
          (acc: number, entry: { amount: number; date: string }) => {
            const entryDate = new Date(entry.date);
            if (
              entryDate.getMonth() + 1 === currentMonth &&
              entryDate.getFullYear() === currentYear
            ) {
              return acc + entry.amount;
            }
            return acc;
          },
          0
        );

        // Calculate daily income for the current year
        const yearlyDailyIncome = (incomeData.dailyEntries || []).reduce(
          (acc: number, entry: { amount: number; date: string }) => {
            const entryDate = new Date(entry.date);
            if (entryDate.getFullYear() === currentYear) {
              return acc + entry.amount;
            }
            return acc;
          },
          0
        );

        // Set income values
        const totalMonthlyIncome = subscriptionIncome + monthlyDailyIncome;
        const totalYearlyIncome = subscriptionIncome + yearlyDailyIncome;

        setMonthlyIncome(totalMonthlyIncome);
        setYearlyIncome(totalYearlyIncome);
        setTotalIncome(yearlyDailyIncome + subscriptionIncome); // Total income for the year

        // Update income data on the server
        await axios.put("https://plume-numerous-homburg.glitch.me/income", {
          dailyEntries: incomeData.dailyEntries || [],
          totalIncome: totalYearlyIncome,
          monthlyIncome: totalMonthlyIncome,
          yearlyIncome: totalYearlyIncome,
        });
      } catch (error) {
        console.error("Error fetching or updating income data:", error);
      }
    };

    fetchIncomeData();
  }, []); // Run once on mount to initialize data

  // Handle adding daily income
  const handleAddIncome = async () => {
    if (dailyAmount <= 0) {
      alert("Please enter a valid daily income amount.");
      return;
    }

    const newEntry = {
      amount: dailyAmount,
      date: currentDate.toISOString().split("T")[0],
    };
    const newEntries = [...dailyIncomeEntries, newEntry];
    setDailyIncomeEntries(newEntries);
    setDailyAmount(0); // Reset input

    // Recalculate incomes
    const monthlyDailyIncome = newEntries.reduce((acc, entry) => {
      const entryDate = new Date(entry.date);
      if (
        entryDate.getMonth() + 1 === currentMonth &&
        entryDate.getFullYear() === currentYear
      ) {
        return acc + entry.amount;
      }
      return acc;
    }, 0);

    const yearlyDailyIncome = newEntries.reduce((acc, entry) => {
      const entryDate = new Date(entry.date);
      if (entryDate.getFullYear() === currentYear) {
        return acc + entry.amount;
      }
      return acc;
    }, 0);

    // Fetch members again to calculate subscription income
    try {
      const membersResponse = await axios.get(
        "https://plume-numerous-homburg.glitch.me/members"
      );
      const members = membersResponse.data;

      const subscriptionIncome = members
        .filter((member: any) => member.status === "Active")
        .reduce((acc: number, member: any) => {
          const startDate = new Date(member.startDate);
          const endDate = new Date(member.endDate);
          const memberMonth = startDate.getMonth() + 1;
          const memberYear = startDate.getFullYear();

          if (
            memberYear === currentYear &&
            memberMonth <= currentMonth &&
            endDate >= currentDate
          ) {
            return acc + (Number(member.subscriptionPrice) || 0);
          }
          return acc;
        }, 0);

      const newMonthlyIncome = subscriptionIncome + monthlyDailyIncome;
      const newYearlyIncome = subscriptionIncome + yearlyDailyIncome;

      setMonthlyIncome(newMonthlyIncome);
      setYearlyIncome(newYearlyIncome);
      setTotalIncome(newYearlyIncome);

      // Update server with new daily income entry
      await axios.put("https://plume-numerous-homburg.glitch.me/income", {
        dailyEntries: newEntries,
        totalIncome: newYearlyIncome,
        monthlyIncome: newMonthlyIncome,
        yearlyIncome: newYearlyIncome,
      });
    } catch (error) {
      console.error("Error updating daily income:", error);
      alert("Failed to update daily income.");
    }
  };

  // Handle resetting daily income entries
  const handleResetIncome = async () => {
    try {
      setDailyIncomeEntries([]);
      setTotalIncome(0);
      setMonthlyIncome(0);
      setYearlyIncome(0);

      // Reset income data on the server
      await axios.put("https://plume-numerous-homburg.glitch.me/income", {
        dailyEntries: [],
        totalIncome: 0,
        monthlyIncome: 0,
        yearlyIncome: 0,
      });
    } catch (error) {
      console.error("Error resetting income:", error);
      alert("Failed to reset income.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Daily Income</h1>
      <div style={{ margin: "20px 0" }}>
        <h2>Total Income (This Year): ${totalIncome.toFixed(2)}</h2>
        <h2>Monthly Income (June 2025): ${monthlyIncome.toFixed(2)}</h2>
        <h2>Yearly Income (2025): ${yearlyIncome.toFixed(2)}</h2>
      </div>

      <div style={{ margin: "20px 0" }}>
        <h3>Add Daily Income</h3>
        <input
          type="number"
          value={dailyAmount}
          onChange={(e) => setDailyAmount(Number(e.target.value))}
          placeholder="Enter daily income"
          style={{ padding: "10px", marginRight: "10px" }}
        />
        <button
          onClick={handleAddIncome}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
          }}
        >
          Add Daily Income
        </button>
        <button
          onClick={handleResetIncome}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            marginLeft: "10px",
          }}
        >
          Reset Income
        </button>
      </div>

      <h3>Daily Income Entries (This Month):</h3>
      {dailyIncomeEntries.length > 0 ? (
        <ul>
          {dailyIncomeEntries
            .filter((entry) => {
              const entryDate = new Date(entry.date);
              return (
                entryDate.getMonth() + 1 === currentMonth &&
                entryDate.getFullYear() === currentYear
              );
            })
            .map((entry, index) => (
              <li key={index}>
                ${entry.amount.toFixed(2)} - {entry.date}
              </li>
            ))}
        </ul>
      ) : (
        <p>No daily income entries for this month.</p>
      )}
    </div>
  );
}
