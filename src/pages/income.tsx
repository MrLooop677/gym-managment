import { useEffect, useState } from "react";
import axios from "axios";

interface IncomeEntry {
  id: string;
  amount: number;
  date: string;
  type: "daily" | "subscription";
  memberId?: string;
}

interface Note {
  text: string;
  timestamp: string; // ISO string, e.g., "2025-06-03T18:54:00.000Z"
}

interface IncomeData {
  dailyEntries: IncomeEntry[];
  totalIncome: number;
  monthlyIncome: number;
  yearlyIncome: number;
  dailyIncome: number;
  notes: Note[];
}

export default function Income() {
  const [incomeData, setIncomeData] = useState<IncomeData>({
    dailyEntries: [],
    totalIncome: 0,
    monthlyIncome: 0,
    yearlyIncome: 0,
    dailyIncome: 0,
    notes: [],
  });
  const [dailyAmount, setDailyAmount] = useState<number>(0);
  const [noteText, setNoteText] = useState<string>(""); // State for note input
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const currentDay = currentDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const incomeResponse = await axios.get(
          "https://plume-numerous-homburg.glitch.me/income"
        );
        const income = incomeResponse.data;

        // Calculate daily income (today only)
        const dailyIncome = (income.dailyEntries || [])
          .filter((entry: IncomeEntry) => entry.date === currentDay)
          .reduce((acc: number, entry: IncomeEntry) => acc + entry.amount, 0);

        // Calculate monthly income (all entries for current month)
        const monthlyIncome = (income.dailyEntries || [])
          .filter((entry: IncomeEntry) => {
            const entryDate = new Date(entry.date);
            return (
              entryDate.getMonth() + 1 === currentMonth &&
              entryDate.getFullYear() === currentYear
            );
          })
          .reduce((acc: number, entry: IncomeEntry) => acc + entry.amount, 0);

        // Calculate yearly income (all entries for current year)
        const yearlyIncome = (income.dailyEntries || [])
          .filter((entry: IncomeEntry) => {
            const entryDate = new Date(entry.date);
            return entryDate.getFullYear() === currentYear;
          })
          .reduce((acc: number, entry: IncomeEntry) => acc + entry.amount, 0);

        const updatedIncomeData = {
          dailyEntries: income.dailyEntries || [],
          totalIncome: yearlyIncome,
          monthlyIncome: monthlyIncome,
          yearlyIncome: yearlyIncome,
          dailyIncome: dailyIncome,
          notes: income.notes || [],
        };

        setIncomeData(updatedIncomeData);

        // Update server with calculated totals
        await axios.put(
          "https://plume-numerous-homburg.glitch.me/income",
          updatedIncomeData
        );
      } catch (error) {
        console.error("Error fetching income data:", error);
      }
    };

    fetchIncomeData();
  }, [refreshTrigger, currentDay]);

  const handleAddDailyIncome = async () => {
    if (dailyAmount <= 0) {
      alert("Please enter a valid daily income amount.");
      return;
    }

    const newEntry: IncomeEntry = {
      id: Date.now().toString(),
      amount: dailyAmount,
      date: currentDay,
      type: "daily",
    };

    try {
      const newEntries = [...incomeData.dailyEntries, newEntry];

      // Recalculate incomes
      const dailyIncome = newEntries
        .filter((entry) => entry.date === currentDay)
        .reduce((acc, entry) => acc + entry.amount, 0);

      const monthlyIncome = newEntries
        .filter((entry) => {
          const entryDate = new Date(entry.date);
          return (
            entryDate.getMonth() + 1 === currentMonth &&
            entryDate.getFullYear() === currentYear
          );
        })
        .reduce((acc, entry) => acc + entry.amount, 0);

      const yearlyIncome = newEntries
        .filter((entry) => {
          const entryDate = new Date(entry.date);
          return entryDate.getFullYear() === currentYear;
        })
        .reduce((acc, entry) => acc + entry.amount, 0);

      const updatedIncomeData = {
        dailyEntries: newEntries,
        totalIncome: yearlyIncome,
        monthlyIncome: monthlyIncome,
        yearlyIncome: yearlyIncome,
        dailyIncome: dailyIncome,
        notes: incomeData.notes,
      };

      await axios.patch(
        "https://plume-numerous-homburg.glitch.me/income",
        updatedIncomeData
      );
      setIncomeData(updatedIncomeData);
      setDailyAmount(0);
    } catch (error) {
      console.error("Error adding daily income:", error);
      alert("Failed to add daily income.");
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) {
      alert("Please enter a valid note.");
      return;
    }

    const newNote: Note = {
      text: noteText,
      timestamp: new Date().toISOString(),
    };

    try {
      const updatedNotes = [...incomeData.notes, newNote];
      const updatedIncomeData = {
        ...incomeData,
        notes: updatedNotes,
      };

      await axios.put(
        "https://plume-numerous-homburg.glitch.me/income",
        updatedIncomeData
      );
      setIncomeData(updatedIncomeData);
      setNoteText(""); // Clear input
    } catch (error) {
      console.error("Error adding note:", error);
      alert("Failed to add note.");
    }
  };

  const handleResetIncome = async () => {
    try {
      const resetData = {
        dailyEntries: [],
        totalIncome: 0,
        monthlyIncome: 0,
        yearlyIncome: 0,
        dailyIncome: 0,
        notes: [], // Preserve notes
      };

      await axios.put(
        "https://plume-numerous-homburg.glitch.me/income",
        resetData
      );
      setIncomeData(resetData);
    } catch (error) {
      console.error("Error resetting income:", error);
      alert("Failed to reset income.");
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      // Filter out the entry to be deleted using the unique ID
      const updatedEntries = incomeData.dailyEntries.filter(
        (entry) => entry.id !== entryId
      );

      // Recalculate incomes after deletion
      const dailyIncome = updatedEntries
        .filter((entry) => entry.date === currentDay)
        .reduce((acc, entry) => acc + entry.amount, 0);

      const monthlyIncome = updatedEntries
        .filter((entry) => {
          const entryDate = new Date(entry.date);
          return (
            entryDate.getMonth() + 1 === currentMonth &&
            entryDate.getFullYear() === currentYear
          );
        })
        .reduce((acc, entry) => acc + entry.amount, 0);

      const yearlyIncome = updatedEntries
        .filter((entry) => {
          const entryDate = new Date(entry.date);
          return entryDate.getFullYear() === currentYear;
        })
        .reduce((acc, entry) => acc + entry.amount, 0);

      const updatedIncomeData = {
        ...incomeData,
        dailyEntries: updatedEntries,
        totalIncome: yearlyIncome,
        monthlyIncome: monthlyIncome,
        yearlyIncome: yearlyIncome,
        dailyIncome: dailyIncome,
      };

      // Send the updated data to the server
      await axios.put(
        "https://plume-numerous-homburg.glitch.me/income",
        updatedIncomeData
      );

      // Update the state
      setIncomeData(updatedIncomeData);
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry.");
    }
  };

  const handleDeleteNote = async (index: number) => {
    try {
      // Create a new array without the deleted note
      const updatedNotes = incomeData.notes.filter((_, i) => i !== index);

      const updatedIncomeData = {
        ...incomeData,
        notes: updatedNotes,
      };

      // Send the updated data to the server
      await axios.put(
        "https://plume-numerous-homburg.glitch.me/income",
        updatedIncomeData
      );

      // Update the state
      setIncomeData(updatedIncomeData);
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note.");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        direction: "rtl",
      }}
    >
      <h1>إدارة الدخل</h1>
      <button
        onClick={handleRefresh}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          marginBottom: "20px",
        }}
      >
        تحديث البيانات
      </button>
      <div style={{ margin: "20px 0" }}>
        <h2>إجمالي الدخل لهذا اليوم: ج.م{incomeData.dailyIncome.toFixed(2)}</h2>

        <h2>
          الدخل الشهري (يونيو 2025): ج.م{incomeData.monthlyIncome.toFixed(2)}
        </h2>
        <h2>الدخل السنوي (2025): ج.م{incomeData.yearlyIncome.toFixed(2)}</h2>
      </div>

      <div style={{ margin: "20px 0" }}>
        <h3>إضافة دخل يومي</h3>
        <input
          value={dailyAmount}
          onChange={(e) => setDailyAmount(Number(e.target.value))}
          placeholder="أدخل مبلغ الدخل اليومي"
          style={{
            padding: "10px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleAddDailyIncome}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
          }}
        >
          إضافة دخل يومي
        </button>
        {/* <button
          onClick={handleResetIncome}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            marginLeft: "10px",
          }}
        >
          إعادة تعيين الدخل
        </button> */}
      </div>

      <div style={{ margin: "20px 0" }}>
        <h3>إضافة ملاحظة</h3>
        <input
          type="text"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="أدخل ملاحظة"
          style={{
            padding: "10px",
            marginRight: "10px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleAddNote}
          style={{
            padding: "10px 20px",
            backgroundColor: "#17a2b8",
            color: "white",
            border: "none",
          }}
        >
          إضافة ملاحظة
        </button>
      </div>

      <h3>سجل الدخل (هذا الشهر):</h3>
      {incomeData.dailyEntries.length > 0 ? (
        <ul>
          {incomeData.dailyEntries
            .filter((entry) => {
              const entryDate = new Date(entry.date);
              return (
                entryDate.getMonth() + 1 === currentMonth &&
                entryDate.getFullYear() === currentYear
              );
            })
            .map((entry) => (
              <li key={entry.id}>
                ج.م{entry.amount.toFixed(2)} - {entry.date} (
                {entry.type === "daily" ? "يومي" : "اشتراك"})
                <span
                  onClick={() => handleDeleteEntry(entry.id)}
                  style={{
                    cursor: "pointer",
                    marginLeft: "10px",
                    color: "red",
                  }}
                >
                  🗑️
                </span>
              </li>
            ))}
        </ul>
      ) : (
        <p>لا توجد سجلات دخل لهذا الشهر.</p>
      )}

      <h3>الملاحظات:</h3>
      {incomeData.notes.length > 0 ? (
        <ul>
          {incomeData.notes.map((note, index) => (
            <li key={index}>
              {note.text} -{" "}
              {new Date(note.timestamp).toLocaleString("ar-EG", {
                dateStyle: "short",
                timeStyle: "short",
              })}
              <span
                onClick={() => handleDeleteNote(index)}
                style={{
                  cursor: "pointer",
                  marginLeft: "10px",
                  color: "red",
                }}
              >
                🗑️
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>لا توجد ملاحظات.</p>
      )}
    </div>
  );
}
