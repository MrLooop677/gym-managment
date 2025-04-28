import axios from "axios";

const API_URL = "https://plume-numerous-homburg.glitch.me/income";

export interface DailyIncomeEntry {
  id?: number;
  date: string; // YYYY-MM-DD
  amount: number;
  note: string;
}

export const incomeService = {
  // Get all income entries
  getAll: async (): Promise<DailyIncomeEntry[]> => {
    const response = await axios.get<DailyIncomeEntry[]>(API_URL);
    return response.data;
  },

  // Create a new income entry
  create: async (entry: DailyIncomeEntry): Promise<DailyIncomeEntry> => {
    const response = await axios.post<DailyIncomeEntry>(API_URL, entry);
    return response.data;
  },

  // Delete an income entry
  delete: async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
  },

  // Update an income entry
  update: async (id: number, entry: DailyIncomeEntry): Promise<DailyIncomeEntry> => {
    const response = await axios.put<DailyIncomeEntry>(`${API_URL}/${id}`, entry);
    return response.data;
  },
};
