import { IconDashboard, IconUsers, IconUserPlus } from "@tabler/icons-react";

export const navigationConfig = [
  {
    title: "الصفحة الرئيسية",
    path: "/",
    icon: IconDashboard,
  },
  {
    title: "الاعضاء",
    icon: IconUsers,
    children: [
      {
        title: "كل الاعضاء",
        path: "/members",
      },
      {
        title: "اضافه عضو جديد",
        path: "/members/add",
        icon: IconUserPlus,
      },
      {
        title: "الدخل ",
        path: "/daily-income",
        icon: IconUserPlus,
      },
    ],
  },
];

export default navigationConfig;
