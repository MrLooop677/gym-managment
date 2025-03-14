import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  expiringMembers: number;
  expiredMembers: number;
}

export default function Dashboard() {
  const [stats] = useState<DashboardStats>({
    totalMembers: 150,
    activeMembers: 120,
    expiringMembers: 15,
    expiredMembers: 15,
  });

  const [expiringMemberships] = useState([
    { id: 1, name: "John Doe", endDate: "2024-04-01" },
    { id: 2, name: "Jane Smith", endDate: "2024-04-02" },
    // Add more mock data
  ]);

  return (
    <>
      <PageMeta
        title="Dashboard | Gym Management"
        description="Gym management dashboard"
      />
      <PageBreadcrumb pageTitle="Dashboard" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stats Cards */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Members
          </h3>
          <p className="mt-2 text-3xl font-semibold text-gray-800 dark:text-white/90">
            {stats.totalMembers}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Active Members
          </h3>
          <p className="mt-2 text-3xl font-semibold text-success-500">
            {stats.activeMembers}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Expiring Soon
          </h3>
          <p className="mt-2 text-3xl font-semibold text-warning-500">
            {stats.expiringMembers}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Expired Members
          </h3>
          <p className="mt-2 text-3xl font-semibold text-danger-500">
            {stats.expiredMembers}
          </p>
        </div>
      </div>

      {/* Expiring Memberships Table */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
          Expiring Memberships
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100/50 dark:bg-gray-800/50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {expiringMemberships.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-gray-200 dark:border-gray-800"
                >
                  <td className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                    {member.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {member.endDate}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-sm text-brand-500 hover:text-brand-600">
                      Renew
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
