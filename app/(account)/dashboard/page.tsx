"use client";
import React, { useEffect } from "react";
import { useNotificationBreadcrumb } from "@/contexts/NotificationBreadcrumbContext";
import Navbar from "@/components/customers/Headerswitch";

import DirectRequestCard from "@/components/customers/DirectRequest";
export default function ClientDashboard() {
  const { showNotification } = useNotificationBreadcrumb();
  const [activePage, setActivePage] = React.useState("/service-requests");

  const handlePageChange = (path: string) => {
    setActivePage(path);
  }

 useEffect(() => {
  if (showNotification) {
    showNotification({
      message:
        "Security Reminder: EventHub will never ask you to make payments outside the platform. Only complete transactions through our secure system.",
      type: "info",
      icon: "shield",
      dismissible: true,
      autoHide: false,
    });
  }
}, []); 

  const breadcrumbItems = [
    { label: "My Account", href: "/dashboard" },
    { label: "Manage all Posts", href: "/dashboard/service-requests" },
    { label: "Service Request Posts" }, 
  ];

  return (
    <div className="min-h-screen bg-[rgb(255,255,255)]">
      <section className="container mx-auto p-4">
        <Navbar activePage={activePage} onPageChange={handlePageChange} />
        {activePage === "/service-requests" ? (
          <div className=" min-h-screen bg-[#fff] rounded-md shadow-md p-4 mt-4 ">
          
          </div>
        ) : activePage === "/direct-request" ? (
          <DirectRequestCard />
          
        ) : null}
      </section>
    </div>
  );
}


 