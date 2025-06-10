import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { memberService, Member } from "../../services/memberService";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { registerLocale } from "react-datepicker";
import { ar } from "date-fns/locale";

// Register Arabic locale
registerLocale("ar", ar);

const AddMember = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState<
    Omit<Member, "id"> & { subscriptionPrice: number }
  >({
    name: "",
    type: "",
    weight: "",
    status: "Active",
    startDate: "",
    endDate: "",
    phone: "",
    subscriptionPrice: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create the member
      const newMember = await memberService.create({
        ...member,
        subscriptionPrice: Number(member.subscriptionPrice),
      });

      // Add subscription income entry
      if (newMember.subscriptionPrice > 0) {
        const incomeResponse = await axios.get(
          "https://plume-numerous-homburg.glitch.me/income"
        );
        const incomeData = incomeResponse.data;

        const newEntry = {
          amount: Number(newMember.subscriptionPrice),
          date: new Date().toISOString().split("T")[0],
          type: "subscription",
          memberId: newMember.id,
        };

        const updatedEntries = [...(incomeData.dailyEntries || []), newEntry];

        await axios.put("https://plume-numerous-homburg.glitch.me/income", {
          ...incomeData,
          dailyEntries: updatedEntries,
        });
      }

      navigate("/members"); // Navigate to Income page to trigger refresh
    } catch (error) {
      console.error("Error creating member or updating income:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMember((prev) => ({
      ...prev,
      [name]: name === "subscriptionPrice" ? Number(value) : value,
    }));
  };

  const handleDateChange = (date: Date | null, name: string) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      setMember((prev) => ({
        ...prev,
        [name]: formattedDate,
      }));
    }
  };

  const CalendarIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );

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
                type="text"
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
                placeholder="02xxxxxxxx"
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

            <div className="mb-4">
              <Label className="block mb-2">سعر الاشتراك (شهري)</Label>
              <Input
                name="subscriptionPrice"
                value={member.subscriptionPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded text-base"
                required
                placeholder="ادخل سعر الاشتراك الشهري"
                min="0"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <Label className="block mb-2">تاريخ بدء الاشتراك</Label>
                <div className="relative">
                  <DatePicker
                    selected={
                      member.startDate ? new Date(member.startDate) : null
                    }
                    onChange={(date) => handleDateChange(date, "startDate")}
                    dateFormat="yyyy-MM-dd"
                    locale="ar"
                    showPopperArrow={false}
                    customInput={
                      <div className="relative">
                        <input
                          type="text"
                          value={member.startDate}
                          readOnly
                          className="w-full px-3 py-2 border rounded text-base pr-10"
                          placeholder="اختر التاريخ"
                        />
                        <CalendarIcon />
                      </div>
                    }
                  />
                </div>
              </div>

              <div className="mb-4">
                <Label className="block mb-2">تاريخ انتهاء الاشتراك</Label>
                <div className="relative">
                  <DatePicker
                    selected={member.endDate ? new Date(member.endDate) : null}
                    onChange={(date) => handleDateChange(date, "endDate")}
                    dateFormat="yyyy-MM-dd"
                    locale="ar"
                    showPopperArrow={false}
                    customInput={
                      <div className="relative">
                        <input
                          type="text"
                          value={member.endDate}
                          readOnly
                          className="w-full px-3 py-2 border rounded text-base pr-10"
                          placeholder="اختر التاريخ"
                        />
                        <CalendarIcon />
                      </div>
                    }
                  />
                </div>
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

            <div className="mt-6 bg-gray-100">
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
