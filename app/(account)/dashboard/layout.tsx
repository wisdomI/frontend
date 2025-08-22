// ...existing code...
import React from "react";
import Sidebar from "@/components/customers/SidebarMenu";
import { Asul } from "next/font/google";
import Breadcrumb from "@/components/customers/BreadCrumbmenu";
type Props = {
    children: React.ReactNode;
};

export default function AccountLayout({ children }: Props) {
    const containerStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial",
        backgroundColor: "#fff"
    };

    const headerStyle: React.CSSProperties = {
        padding: "12px 20px",
       
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fff",
        zIndex: 20,
    };

    const topRowGridStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "250px 1fr", // sidebar (left) and main (right)
        gap: 20,
        padding: 20,
        flex: 1, // allow main area to grow
        background: "#fff",
    };

    const leftColumnStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: 12,
    };

    const breadcrumbStyle: React.CSSProperties = {
        background: "#fff",
        padding: "8px 12px",
        
        fontSize: 14,
    };

    const sidebarStyle: React.CSSProperties = {
    
       
  
    };

    const mainStyle: React.CSSProperties = {
   
        padding:2,
        borderRadius: 8,
       
        minHeight: 200,
    };

    const notifBadgeStyle: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 20,
        background: "#f0f5ff",
        color: "#0b63ff",
        fontWeight: 600,
        fontSize: 13,
    };

    return (
        <div style={containerStyle}>
            <header style={headerStyle}>

               {/* <nav style={breadcrumbStyle} aria-label="Breadcrumb">
                        <span style={{ color: "#6b7280" }}>My Account</span>
                        <span style={{ margin: "0 8px", color: "#9ca3af" }}>{'>'} </span>
                        <span style={{ color: "#111827", fontWeight: 600 }}>Account</span>
                    </nav> */}
                 <Breadcrumb />
                
            </header>

            <div style={topRowGridStyle}>
                <div style={leftColumnStyle}>
                   <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <h2 className=" font-heading  font-semibold text-2xl text-gray-800">My Account</h2>
                    
                </div>


                    <aside style={sidebarStyle}>
                        {/* Sidebar content goes here */}
                       <Sidebar /> 
                    </aside>
                </div>

                <main style={mainStyle}>
                    {/* Main content lives to the right of the sidebar */}
                    {children}
                </main>
            </div>
        </div>
    );
  }