import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { memberService, Member } from "../../services/memberService";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { registerLocale } from "react-datepicker";
import { ar } from "date-fns/locale";

// Register Arabic locale
registerLocale("ar", ar);

const EditMember = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      memberService
        .getById(Number(id))
        .then(setMember)
        .catch(() => setError(t("Error loading member details")))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMember((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleDateChange = (date: Date | null, name: string) => {
    if (date && member) {
      const formattedDate = format(date, "yyyy-MM-dd");
      setMember({
        ...member,
        [name]: formattedDate,
      });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;
    try {
      await memberService.update(member.id, member);
      navigate("/members");
    } catch (error) {
      setError(t("Error updating member"));
    }
  };

  if (loading) return <div>{t("تحميل")}...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!member) return <div>{t("لا يوجد عضو")}</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <PageMeta
        title={t("تعديل بيانات العضو")}
        description={t("تعديل بيانات العضو في الجيم")}
      />
      <PageBreadcrumb pageTitle={t("تعديل بيانات العضو")} />
      <h1 className="text-2xl font-bold mb-6">{t("تعديل بيانات العضو")}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
        <div>
          <label className="block font-medium mb-1">{t("الاسم")}</label>
          <input
            type="text"
            name="name"
            value={member.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">{t("الوزن")}</label>
          <input
            type="text"
            name="weight"
            value={member.weight}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">{t("نوع الاشتراك")}</label>
          <input
            type="text"
            name="type"
            value={member.type}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">{t("الهاتف")}</label>
          <input
            type="text"
            name="phone"
            value={member.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">{t("الحالة")}</label>
          <select
            name="status"
            value={member.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Active">{t("نشط")}</option>
            <option value="Inactive">{t("غير نشط")}</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">
            {t("تاريخ بدء الاشتراك")}
          </label>
          <div className="relative">
            <DatePicker
              selected={member.startDate ? new Date(member.startDate) : null}
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

        <div>
          <label className="block font-medium mb-1">
            {t("تاريخ انتهاء الاشتراك")}
          </label>
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

        <button
          type="submit"
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          {t("حفظ التعديلات")}
        </button>
      </form>
    </div>
  );
};

export default EditMember;
