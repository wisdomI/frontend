"use client";

import React, { useEffect } from "react";
import { useNotificationBreadcrumb } from "@/contexts/NotificationBreadcrumbContext";
import Navbar from "@/components/customers/Headerswitch";

export default function ClientDashboard() {
  const { showNotification } = useNotificationBreadcrumb();
  const [activePage, setActivePage] = React.useState("/profile");

  const handlePageChange = (path: string) => {
    setActivePage(path);
  };

  useEffect(() => {
    showNotification({
      message:
        "Security Reminder: EventHub will never ask you to make payments outside the platform. Only complete transactions through our secure system.",
      type: "info",
      icon: "shield",
      dismissible: true,
      autoHide: false,
    });
  }, []); // Empty dependency array to run only on mount

  return (
    <div className="container min-h-auto mx-auto mt-2">
      <section className="container mx-auto p-4">
        <Navbar activePage={activePage} onPageChange={handlePageChange} />
        {activePage === "/profile" ? (
          <div className="min-h-screen bg-[#fff] rounded-md"></div>
        ) : null}
      </section>
    </div>
  );
}