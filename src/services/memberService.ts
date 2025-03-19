import axios from "axios";

const API_URL = "https://plume-numerous-homburg.glitch.me/members";

export interface Member {
  id?: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export const memberService = {
  // Get all members
  getAll: async () => {
    const response = await axios.get<Member[]>(API_URL);
    return response.data;
  },

  // Get single member
  getById: async (id: number) => {
    const response = await axios.get<Member>(`${API_URL}/${id}`);
    return response.data;
  },

  // Create member
  create: async (member: Member) => {
    const response = await axios.post<Member>(API_URL, member);
    return response.data;
  },

  // Update member
  update: async (id: number, member: Member) => {
    const response = await axios.put<Member>(`${API_URL}/${id}`, member);
    return response.data;
  },

  // Delete member
  delete: async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
