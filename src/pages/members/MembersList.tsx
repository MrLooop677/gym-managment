import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { memberService, Member } from "../../services/memberService";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

const MembersList = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await memberService.getAll();
      setMembers(data);
    } catch (error) {
      console.error("Error loading members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await memberService.delete(id);
        setMembers(members.filter((member) => member.id !== id));
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <PageMeta
        title="Gym Members | Management Dashboard"
        description="Gym member management dashboard"
      />
      <PageBreadcrumb pageTitle="Members List" />

      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Members List</h1>
          <Link
            to="/members/add"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add New Member
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b">Name</th>
                <th className="px-6 py-3 border-b">Email</th>
                <th className="px-6 py-3 border-b">Role</th>
                <th className="px-6 py-3 border-b">Status</th>
                <th className="px-6 py-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 border-b">{member.name}</td>
                  <td className="px-6 py-4 border-b">{member.email}</td>
                  <td className="px-6 py-4 border-b">{member.role}</td>
                  <td className="px-6 py-4 border-b">{member.status}</td>
                  <td className="px-6 py-4 border-b">
                    <Link
                      to={`/members/${member.id}`}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(member.id!)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
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
};

export default MembersList;
