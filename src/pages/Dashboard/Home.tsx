import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { memberService, Member } from "../../services/memberService";
import { FaWhatsapp } from "react-icons/fa";

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  expiringMembers: number;
  expiredMembers: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeMembers: 0,
    expiringMembers: 0,
    expiredMembers: 0,
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // WhatsApp helpers (copied from MembersList)
  const isSubscriptionExpired = (endDate: string) => {
    const today = new Date();
    const subscriptionEnd = new Date(endDate);
    return subscriptionEnd < today;
  };
  const shouldShowWhatsApp = (member: Member) => {
    return isSubscriptionExpired(member.endDate) && member.phone;
  };
  const createWhatsAppLink = (
    phone: string | undefined,
    memberName: string,
    endDate: string,
    member: Member
  ) => {
    if (!phone) return "#";
    const cleanPhone = phone.replace(/\D/g, "");
    const message = shouldShowWhatsApp(member)
      ? `السلام عليكم  ${memberName}  عميلنا العزيز تم انتهاء اشتراكك ف يوم     ${new Date(
          endDate
        ).toLocaleDateString()}.    `
      : "السلام عليكم معك فريق اداره hero gym ";
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  };

  // Renew logic
  const handleRenew = async (member: Member) => {
    const today = new Date();
    const startDate = today.toISOString().split("T")[0];
    const newEnd = new Date(today);
    newEnd.setMonth(newEnd.getMonth() + 1);
    const endDate = newEnd.toISOString().split("T")[0];
    try {
      await memberService.update(member.id!, {
        ...member,
        startDate,
        endDate,
      });
      // Remove from expired list
      setMembers((prev) => prev.map((m) => m.id === member.id ? { ...m, startDate, endDate } : m));
    } catch (error) {
      alert("Failed to renew membership");
    }
  };

  useEffect(() => {
    async function fetchMembers() {
      try {
        const data = await memberService.getAll();
        setMembers(data);
        // Calculate stats
        const today = new Date();
        setStats({
          totalMembers: data.length,
          activeMembers: data.filter((m: Member) => m.status === "Active").length,
          expiringMembers: data.filter((m: Member) => new Date(m.endDate) > today && new Date(m.endDate).getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000).length, // expiring in 7 days
          expiredMembers: data.filter((m: Member) => new Date(m.endDate) < today).length,
        });
      } catch (error) {
        console.error("Error loading members", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, []);

  // Filter for expired memberships
  const expiredMemberships = members.filter((member) => new Date(member.endDate) < new Date() && member.name.toLowerCase().includes(search.toLowerCase()));

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
        {/* Search Bar for Expired Members */}
        <div className="mb-4 flex justify-end m-2">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xs border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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
                  WhatsApp
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">Loading...</td>
                </tr>
              ) : expiredMemberships.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">No expired memberships found.</td>
                </tr>
              ) : (
                expiredMemberships.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-gray-200 dark:border-gray-800"
                  >
                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(member.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {shouldShowWhatsApp(member) && (
                        <a
                          href={createWhatsAppLink(member.phone, member.name, member.endDate, member)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-500 hover:text-green-600"
                          title="Send WhatsApp"
                        >
                          <FaWhatsapp size={22} />
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="text-sm text-brand-500 hover:text-brand-600"
                        onClick={() => handleRenew(member)}
                      >
                        Renew
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
