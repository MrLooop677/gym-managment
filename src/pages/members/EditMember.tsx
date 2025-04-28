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
      memberService.getById(id)
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
    console.log("members", member);
  }
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

  if (loading) return <div>{t("Loading")}...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!member) return <div>{t("Member not found!")}</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <PageMeta title={t("Edit Member")} description={t("Edit member details")} />
      <PageBreadcrumb pageTitle={t("Edit Member")} />
      <h1 className="text-2xl font-bold mb-6">{t("Edit Member")}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
        <div>
          <label className="block font-medium mb-1">{t("Name")}</label>
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
          <label className="block font-medium mb-1">{t("Weight")}</label>
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
          <label className="block font-medium mb-1">{t("Type")}</label>
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
          <label className="block font-medium mb-1">{t("Phone")}</label>
          <input
            type="text"
            name="phone"
            value={member.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">{t("Status")}</label>
          <select
            name="status"
            value={member.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Active">{t("Active")}</option>
            <option value="Inactive">{t("Inactive")}</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">{t("Start Date")}</label>
          <input
            type="date"
            name="startDate"
            value={member.startDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">{t("End Date")}</label>
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
          {t("Save Changes")}
        </button>
      </form>
    </div>
  );
};

export default EditMember;
