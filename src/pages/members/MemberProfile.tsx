import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { memberService, Member } from "../../services/memberService";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface InBodyRecord {
  date: string;
  weight: number;
  musclePercentage: number;
  fatPercentage: number;
}

interface MemberDetails {
  id: number;
  name: string;
  phone: string;
  startDate: string;
  endDate: string;
  status: string;
  inbodyRecords: InBodyRecord[];
}

const MemberProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMember();
  }, [id]);

  const loadMember = async () => {
    try {
      const data = await memberService.getById(Number(id));
      setMember(data);
    } catch (error) {
      console.error("Error loading member:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMember((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;

    try {
      await memberService.update(Number(id), member);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!member) return <div>Member not found</div>;

  return (
    <>
      <PageMeta
        title={`${member.name} | Member Profile`}
        description="Member profile and InBody tracking"
      />
      <PageBreadcrumb pageTitle="Member Profile" />

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">
          {isEditing ? "Edit Member" : "Member Profile"}
        </h1>

        <form onSubmit={handleSubmit} className="max-w-lg">
          <div className="mb-4">
            <label className="block mb-2">Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={member.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            ) : (
              <div className="px-3 py-2">{member.name}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-2">Email:</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={member.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            ) : (
              <div className="px-3 py-2">{member.email}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-2">Weight:</label>
            {isEditing ? (
              <input
                type="text"
                name="weight"
                value={member.weight}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            ) : (
              <div className="px-3 py-2">{member.weight}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-2">Status:</label>
            {isEditing ? (
              <select
                name="status"
                value={member.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            ) : (
              <div className="px-3 py-2">{member.status}</div>
            )}
          </div>

          <div className="flex gap-4">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Member Details Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
            Member Details
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
              <p className="text-base font-medium text-gray-800 dark:text-white/90">
                {member.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
              <p className="text-base font-medium text-gray-800 dark:text-white/90">
                {member.phone}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Membership Period
              </p>
              <p className="text-base font-medium text-gray-800 dark:text-white/90">
                {member.startDate} - {member.endDate}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-medium text-white ${
                  member.status === "active"
                    ? "bg-success-500"
                    : member.status === "expiring"
                    ? "bg-warning-500"
                    : "bg-danger-500"
                }`}
              >
                {member.status}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="col-span-full rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
            Progress Chart
          </h2>
          <div className="h-[400px] w-full">
            <LineChart
              width={800}
              height={350}
              data={member.inbodyRecords}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="weight" stroke="#8884d8" />
              <Line
                type="monotone"
                dataKey="musclePercentage"
                stroke="#82ca9d"
              />
              <Line type="monotone" dataKey="fatPercentage" stroke="#ff7300" />
            </LineChart>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberProfile;
