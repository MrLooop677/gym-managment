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

  // Add function to check if subscription has ended
  const isSubscriptionExpired = (endDate: string) => {
    const today = new Date();
    const subscriptionEnd = new Date(endDate);
    return subscriptionEnd < today;
  };

  // Modified function to handle undefined/null phone numbers
  const createWhatsAppLink = (phone: string | undefined) => {
    if (!phone) return '#'; // Return a fallback link if phone is undefined/null
    
    // Remove any non-numeric characters from phone number
    const cleanPhone = phone.replace(/\D/g, '');
    
    // If the phone number doesn't start with '+' or country code, you might want to add one
    // For example, if the numbers are local to your country:
    // return `https://wa.me/1${cleanPhone}`; // for US numbers (1 is country code)
    return `https://wa.me/${cleanPhone}`;
  };

  // Add function to check if WhatsApp button should be shown
  const shouldShowWhatsApp = (member: Member) => {
    return isSubscriptionExpired(member.endDate) && member.phone;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <PageMeta
        title="Gym Members | Management Dashboard"
        description="Gym member management dashboard"
      />
      <PageBreadcrumb pageTitle="Members List" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Members List</h1>
          <Link
            to="/members/add"
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
          >
            Add New Member
          </Link>
        </div>

        {/* Mobile view: Card layout */}
        <div className="block lg:hidden">
          {members.map((member) => (
            <div 
              key={member.id}
              className={`mb-4 rounded-lg shadow p-4 ${
                isSubscriptionExpired(member.endDate) ? 'bg-red-100' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{member.name}</h3>
                <span className={`px-2 py-1 rounded text-sm ${
                  member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {member.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Email:</span> {member.email}</p>
                <p><span className="font-medium">Phone:</span> {member.phone}</p>
                <p><span className="font-medium">Role:</span> {member.role}</p>
                <p><span className="font-medium">Start Date:</span> {new Date(member.startDate).toLocaleDateString()}</p>
                <p><span className="font-medium">End Date:</span> {new Date(member.endDate).toLocaleDateString()}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={`/members/${member.id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  View
                </Link>
                {shouldShowWhatsApp(member) && (
                  <a
                    href={createWhatsAppLink(member.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    WhatsApp
                  </a>
                )}
                <button
                  onClick={() => handleDelete(member.id!)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop view: Table layout */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b">Name</th>
                <th className="px-6 py-3 border-b">Email</th>
                <th className="px-6 py-3 border-b">Phone</th>
                <th className="px-6 py-3 border-b">Role</th>
                <th className="px-6 py-3 border-b">Status</th>
                <th className="px-6 py-3 border-b">Start Date</th>
                <th className="px-6 py-3 border-b">End Date</th>
                <th className="px-6 py-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr 
                  key={member.id}
                  className={`${
                    isSubscriptionExpired(member.endDate) 
                      ? 'bg-red-100' 
                      : ''
                  }`}
                >
                  <td className="px-6 py-4 border-b">{member.name}</td>
                  <td className="px-6 py-4 border-b">{member.email}</td>
                  <td className="px-6 py-4 border-b">{member.phone}</td>
                  <td className="px-6 py-4 border-b">{member.role}</td>
                  <td className="px-6 py-4 border-b">{member.status}</td>
                  <td className="px-6 py-4 border-b">
                    {new Date(member.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {new Date(member.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 border-b">
                    <Link
                      to={`/members/${member.id}`}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      View
                    </Link>
                    {shouldShowWhatsApp(member) && (
                      <a
                        href={createWhatsAppLink(member.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-4"
                      >
                        WhatsApp
                      </a>
                    )}
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
