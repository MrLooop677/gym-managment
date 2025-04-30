import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      // Navigation
      "Home": "الرئيسية",
      "Dashboard": "لوحة التحكم",
      "Members": "الأعضاء",
      "All Members": "جميع الأعضاء",
      "Add Member": "إضافة عضو",
      "Member Profile": "الملف الشخصي للعضو",
      
      // Member List
      "Name": "الاسم",
      "Email": "البريد الإلكتروني",
      "Phone": "رقم الهاتف",
      "Role": "الدور",
      "Status": "الحالة",
      "Start Date": "تاريخ البدء",
      "End Date": "تاريخ الانتهاء",
      "Actions": "الإجراءات",
      "Search members": "البحث عن الأعضاء",
      "Active": "نشط",
      "Inactive": "غير نشط",
      "Edit": "تعديل",
      "Delete": "حذف",
      "View Profile": "عرض الملف",

      // Member Form
      "Personal Information": "المعلومات الشخصية",
      "First Name": "الاسم الأول",
      "Last Name": "اسم العائلة",
      "Address": "العنوان",
      "City": "المدينة",
      "Country": "الدولة",
      "Postal Code": "الرمز البريدي",
      "Membership Details": "تفاصيل العضوية",
      "Membership Type": "نوع العضوية",
      "Submit": "حفظ",
      "Cancel": "إلغاء",

      // Dashboard
      "Total Members": "إجمالي الأعضاء",
      "Active Members": "الأعضاء النشطين",
      "New Members": "الأعضاء الجدد",
      "Revenue": "الإيرادات",
      "Monthly Statistics": "الإحصائيات الشهرية",
      "Recent Activities": "النشاطات الأخيرة",

      // Authentication
      "signIn": "تسجيل الدخول",
      "username": "اسم المستخدم",
      "password": "كلمة المرور",
      "invalidCredentials": "اسم المستخدم أو كلمة المرور غير صحيحة",
      "logout": "تسجيل الخروج",

      // Common
      "Loading": "جاري التحميل",
      "No results found": "لم يتم العثور على نتائج",
      "Error": "خطأ",
      "Success": "تم بنجاح",
      "Confirm": "تأكيد",
      "Save Changes": "حفظ التغييرات"
    }
  },
  en: {
    translation: {
      // Navigation
      "Home": "Home",
      "Dashboard": "Dashboard",
      "Members": "Members",
      "All Members": "All Members",
      "Add Member": "Add Member",
      "Member Profile": "Member Profile",
      
      // Member List
      "Name": "Name",
      "Email": "Email",
      "Phone": "Phone",
      "Role": "Role",
      "Status": "Status",
      "Start Date": "Start Date",
      "End Date": "End Date",
      "Actions": "Actions",
      "Search members": "Search members",
      "Active": "Active",
      "Inactive": "Inactive",
      "Edit": "Edit",
      "Delete": "Delete",
      "View Profile": "View Profile",

      // Member Form
      "Personal Information": "Personal Information",
      "First Name": "First Name",
      "Last Name": "Last Name",
      "Address": "Address",
      "City": "City",
      "Country": "Country",
      "Postal Code": "Postal Code",
      "Membership Details": "Membership Details",
      "Membership Type": "Membership Type",
      "Submit": "Submit",
      "Cancel": "Cancel",

      // Dashboard
      "Total Members": "Total Members",
      "Active Members": "Active Members",
      "New Members": "New Members",
      "Revenue": "Revenue",
      "Monthly Statistics": "Monthly Statistics",
      "Recent Activities": "Recent Activities",

      // Common
      "Loading": "Loading",
      "No results found": "No results found",
      "Error": "Error",
      "Success": "Success",
      "Confirm": "Confirm",
      "Save Changes": "Save Changes"
    }
  }
};

const i18n = i18next.createInstance();

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ar", // Set Arabic as default language
    fallbackLng: "ar",
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
