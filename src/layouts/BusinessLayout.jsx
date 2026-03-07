import Footer from '@/components/Footer';
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar';
import { business, notifications } from '@/data/businessData';
import HomePageBusiness from '@/pages/businesses/HomePageBusiness';
import ProfilePageBusiness from '@/pages/businesses/ProfilePageBusiness';
import QuanLyThucTap from '@/pages/businesses/QuanLyThucTap';
import XacNhanThucTap from '@/pages/businesses/XacNhanThucTap';

import React, { useState } from 'react'

const MENU = [
  { label: "Trang chu", page: "home", group: null },
  { label: "Xac nhan thuc tap", page: "xac-nhan-thuc-tap", group: null },
  { label: "Quan ly thuc tap", page: "quan-ly-thuc-tap", group: null },
];

const PAGE_TITLES = {
  home: "Trang chu",
  profile: "Thong tin doanh ngiep",
  "xac-nhan-thuc-tap": "Xac nhan thuc tap",
  "quan-ly-thuc-tap": "Quan ly thuc tap",
};

function renderPage(page, navigate) {
  switch (page) {
    case "home": return <HomePageBusiness onNavigate={navigate} />;
    case "profile": return <ProfilePageBusiness />;
    case "xac-nhan-thuc-tap": return <XacNhanThucTap/>;
    case "quan-ly-thuc-tap": return <QuanLyThucTap />;
    default: return <HomePageBusiness onNavigate={navigate} />;
  }
}

const BusinessLayout = () => {
  const [page, setPage] = useState("home");
  const navigate = (p) => setPage(p);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <Header onNavigate={navigate} notifications = {notifications} name ={business.tenDN}/>
      <div className="flex flex-1 overflow-hidden"> 
        <Sidebar onNavigate={navigate} page={page} MENU={MENU}/>
        <div className="flex-1 flex flex-col overflow-y-auto">
          {page !== "home" && (
            <div className="bg-white border-b border-gray-200 px-6 py-2 flex items-center gap-1.5 text-xs text-gray-400">
              <button onClick={() => navigate("home")} className="hover:text-[#5c60c0] transition">Trang chu</button>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-600 font-medium">{PAGE_TITLES[page]}</span>
            </div>
          )}
          <div className="flex-1 bg-gray-50">{renderPage(page, navigate)}</div>
          
        </div>
      </div>
      <Footer/> 
    </div>


  )
}

export default BusinessLayout
