import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { memberService, Member } from "../../services/memberService";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useTranslation } from "react-i18next";

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
        .getById(id)
        .then(setMember)
        .catch(() => setError(t("Error loading member details")))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;
    try {
      await memberService.update(member.id, member);
      navigate("/members");
    } catch (err) {
      setError(t("Error updating member"));
    }
  };

  if (loading) return <div>{t("تحميل")}...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!member) return <div>{t("لا يوجد عضو")}</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <PageMeta
        title={t("تعديل بيانات العضو")} // "Edit Member | Gym Management"
        description={t("تعديل بيانات العضو في الجيم")} // "Edit member details in the gym"
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
          <input
            type="date"
            name="startDate"
            value={member.startDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">
            {t("تاريخ انتهاء الاشتراك")}
          </label>
          <input
            type="date"
            name="endDate"
            value={member.endDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          {t("حفظ التعديلات")} {/* "Save Changes" */}
        </button>
      </form>
    </div>
  );
};

export default EditMember;
