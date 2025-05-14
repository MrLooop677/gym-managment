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
    type: "",
    weight: "",
    status: "Active",
    startDate: "",
    endDate: "",
    phone: "",
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
        title="اضافه عضو جديد | Gym Management"
        description="اضافه عضو جديد to the gym"
      />
      <PageBreadcrumb pageTitle="اضافه عضو جديد" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-6">اضافه عضو جديد</h1>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="space-y-4">
            <div className="mb-4">
              <Label className="block mb-2">الاسم</Label>
              <Input
                type="text"
                name="name"
                value={member.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded text-base"
                required
              />
            </div>

            <div className="mb-4">
              <Label className="block mb-2">نوع الاشتراك</Label>
              <Input
                type="type"
                name="type"
                value={member.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded text-base"
                required
              />
            </div>

            <div className="mb-4">
              <Label className="block mb-2">رقم الهاتف</Label>
              <Input
                type="tel"
                name="phone"
                value={member.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded text-base"
                required
                placeholder="02ءءءءءءء"
              />
            </div>

            <div className="mb-4">
              <Label className="block mb-2">الوزن</Label>
              <Input
                type="text"
                name="weight"
                value={member.weight}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded text-base"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <Label className="block mb-2">تاريخ بدء الاشتراك</Label>
                <Input
                  type="date"
                  name="startDate"
                  value={member.startDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded text-base"
                  required
                />
              </div>

              <div className="mb-4">
                <Label className="block mb-2">تاريخ انتهاء الاشتراك</Label>
                <Input
                  type="date"
                  name="endDate"
                  value={member.endDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded text-base"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <Label className="block mb-2">حالة الاشتراك</Label>
              <select
                name="status"
                value={member.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded text-base"
              >
                <option value="Active">نشط</option>
                <option value="Inactive">غير نشط</option>
              </select>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                اضافه عضو جديد
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddMember;
