import { IconDashboard, IconUsers, IconUserPlus } from "@tabler/icons-react";

export const navigationConfig = [
  {
    title: "Dashboard",
    path: "/",
    icon: IconDashboard,
  },
  {
    title: "Members",
    icon: IconUsers,
    children: [
      {
        title: "All Members",
        path: "/members",
      },
      {
        title: "Add Member",
        path: "/members/add",
        icon: IconUserPlus,
      },
    ],
  },
];

export default navigationConfig;
