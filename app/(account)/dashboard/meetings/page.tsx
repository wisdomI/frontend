"use client";

import React, { useState } from "react";
import GanttChart from "@/components/dashboard/GanttChart";

export default function MeetingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meeting Scheduler</h1>
          <p className="text-gray-600">Manage and schedule your meetings with clients and vendors</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <GanttChart />
        </div>
      </div>
    </div>
  );
}