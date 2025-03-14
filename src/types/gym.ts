export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  startDate: string;
  endDate: string;
  status: "active" | "expiring" | "expired";
  monthlyFee: number;
}

export interface InBodyRecord {
  id: number;
  memberId: number;
  date: string;
  weight: number;
  musclePercentage: number;
  fatPercentage: number;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  expiringMembers: number;
  expiredMembers: number;
}
