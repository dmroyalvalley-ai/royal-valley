import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata: Metadata = {
  title: "إدارة برامج العمرة | رويال فالي",
  robots: { index: false, follow: false },
  alternates: { canonical: "/admin/" },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
