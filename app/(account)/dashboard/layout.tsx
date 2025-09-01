import React from "react";
import Sidebar from "@/components/customers/SidebarMenu";
import Breadcrumb from "@/components/customers/BreadCrumbmenu";

type Props = {
    children: React.ReactNode;
};

export default function AccountLayout({ children }: Props) {

    return (
        <div className="flex flex-col min-h-screen ">
            {/* Breadcrumb Section - aligned with header container */}
            <div className="bg-white  border-gray-200">
                <div className="container mx-auto px-8 md:px-12 lg:px-16 py-3">
                    <Breadcrumb />
                </div>
            </div>

           
            <div className="container mx-auto px-8 md:px-12 lg:px-16 py-6 flex-1">
                <div className="flex gap-6 items-start">
                    {/* Left Sidebar */}
                    <div className="w-64 flex-shrink-0">
                       
                        <div className="mb-4 mt-4 ">
                            <h2 className="text-[20px] font-semibold font-heading text-gray-900 pb-2">My Account</h2>
                        </div>

                        {/* Sidebar Menu */}
                        <Sidebar />
                    </div>

                    {/* Main Content */}
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}