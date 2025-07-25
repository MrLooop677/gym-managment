import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { memberService, Member } from "../../services/memberService";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useTranslation } from "react-i18next";

const MembersList = () => {
  const { t } = useTranslation();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await memberService.getAll();
      setMembers(data);
    } catch (error) {
      console.error(t("Error loading members:"), error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t("هل انت متاكد من حذف هذا العضو؟"))) {
      try {
        await memberService.delete(id);
        setMembers(members.filter((member) => member.id !== id));
      } catch (error) {
        console.error(t("Error deleting member:"), error);
      }
    }
  };

  const isSubscriptionExpired = (endDate: string) => {
    const today = new Date();
    const subscriptionEnd = new Date(endDate);
    return subscriptionEnd < today;
  };

  /**
   * Build a WhatsApp link with a prefilled message.
   */
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
    // strip out non-digits
    const cleanPhone = phone.replace(/\D/g, "");
    // craft your message
    const message = shouldShowWhatsApp(member)
      ? `السلام عليكم ${memberName} لقد تم انتهاء اشتراكك في Heros Gym بتاريخ ${new Date(
          endDate
        ).toLocaleDateString()}.`
      : `السلام عليكم ${memberName} لقد تم بدا اشتراكك في Heros Gym بتاريخ ${new Date(
          member.startDate
        ).toLocaleDateString()} إلى ${new Date(
          member.endDate
        ).toLocaleDateString()}. شكرا لاختياركم HEROS GYM (جيم الأبطال)`;
    // encode it for a URL
    const encodedMessage = encodeURIComponent(message);
    // return the full wa.me link
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  };

  if (loading) return <div>{t("Loading")}...</div>;

  return (
    <>
      <PageMeta
        title={t("جميع الاعضاء ")}
        description={t("جميع الاعضاء في الجيم")}
      />
      <PageBreadcrumb pageTitle={t("جميع الاعضاء")} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-4 flex justify-end m-2">
          <input
            type="text"
            placeholder={t("البحث بواسطه الاسم")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xs border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">
            {t("جميع الاعضاء")}
          </h1>
          <Link
            to="/members/add"
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
          >
            {t("اضافه عضو جديد")}
          </Link>
        </div>

        {/* Mobile view: Card layout */}
        <div className="block xxl:hidden">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className={`mb-4 rounded-lg shadow p-4 ${
                isSubscriptionExpired(member.endDate)
                  ? "bg-red-100"
                  : "bg-white"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{member.name}</h3>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    member.status === t("Active")
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {t(member.status)}
                </span>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">{t("نوع الاشتراك")}:</span>{" "}
                  {member.type}
                </p>
                <p>
                  <span className="font-medium">{t("رقم الهاتف")}:</span>{" "}
                  {member.phone}
                </p>
                <p>
                  <span className="font-medium">{t("الوزن")}:</span>{" "}
                  {t(member.weight)}
                </p>
                <p>
                  <span className="font-medium">
                    {t("تاريخ بدايه الاشتراك")}:
                  </span>{" "}
                  {new Date(member.startDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">
                    {t("تاريخ انتهاء الاشتراك")}:
                  </span>{" "}
                  {new Date(member.endDate).toLocaleDateString()}
                </p>
                <div className="flex space-x-2 mt-4 bg-gray-100">
                  {/* <Link
                    to={`/members/${member.id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    {t("View Profile")}
                  </Link> */}
                  <Link
                    to={`/members/edit/${member.id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    {t("تعديل")}
                  </Link>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    {t("حذف")}
                  </button>

                  <a
                    href={createWhatsAppLink(
                      member.phone,
                      member.name,
                      member.endDate,
                      member
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    واتس اب
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop view: Table layout */}
        <div className="hidden xxl:block overflow-x-auto">
          <div className="min-w-full">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b">{t("الاسم")}</th>
                  <th className="px-6 py-3 border-b">{t("نوع الاشتراك")}</th>
                  <th className="px-6 py-3 border-b">{t("رقم الهاتف")}</th>
                  <th className="px-6 py-3 border-b">{t("الوزن")}</th>
                  <th className="px-6 py-3 border-b">{t("الحالة")}</th>
                  <th className="px-6 py-3 border-b">
                    {t("تاريخ بدايه الاشتراك")}
                  </th>
                  <th className="px-6 py-3 border-b">
                    {t("تاريخ انتهاء الاشتراك")}
                  </th>
                  <th className="px-6 py-3 border-b">{t("العمليات")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className={
                      isSubscriptionExpired(member.endDate) ? "bg-red-50" : ""
                    }
                  >
                    <td className="px-6 py-4 border-b">{member.name}</td>
                    <td className="px-6 py-4 border-b">{member.type}</td>
                    <td className="px-6 py-4 border-b">{member.phone}</td>
                    <td className="px-6 py-4 border-b">{t(member.weight)}</td>
                    <td className="px-6 py-4 border-b">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          member.status === t("Active")
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {t(member.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b">
                      {new Date(member.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {new Date(member.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 border-b">
                      <div className="flex space-x-2">
                        {/* <Link
                          to={`/members/${member.id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          {t("View")}
                        </Link> */}
                        <Link
                          to={`/members/edit/${member.id}`}
                          className="text-yellow-500 hover:text-yellow-700"
                        >
                          {t("Edit")}
                        </Link>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          {t("Delete")}
                        </button>

                        <a
                          href={createWhatsAppLink(
                            member.phone,
                            member.name,
                            member.endDate,
                            member
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-500 hover:text-green-700"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default MembersList;
