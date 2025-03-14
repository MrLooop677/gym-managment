import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { memberService, Member } from "../../services/memberService";

const AddMember = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState<Omit<Member, "id">>({
    name: "",
    email: "",
    role: "",
    status: "Active",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await memberService.create(member);
      navigate("/members");
    } catch (error) {
      console.error("Error creating member:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <PageMeta
        title="Add New Member | Gym Management"
        description="Add new member to the gym"
      />
      <PageBreadcrumb pageTitle="Add New Member" />

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Add New Member</h1>
        <form onSubmit={handleSubmit} className="max-w-lg">
          <div className="mb-4">
            <Label>Name</Label>
            <Input
              type="text"
              name="name"
              value={member.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={member.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <Label>Role</Label>
            <Input
              type="text"
              name="role"
              value={member.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <Label>Status</Label>
            <select
              name="status"
              value={member.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Member
          </button>
        </form>
      </div>
    </>
  );
};

export default AddMember;
