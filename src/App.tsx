/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { OperationalRibbon } from './components/layout/OperationalRibbon';
import { SiteFooter } from './components/layout/SiteFooter';
import { SiteHeader } from './components/layout/SiteHeader';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { ArtisansPage } from './pages/ArtisansPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { ContactPage } from './pages/ContactPage';
import { DiscoveryQuizPage } from './pages/DiscoveryQuizPage';
import { HistoryPage } from './pages/HistoryPage';
import { HomePage } from './pages/HomePage';
import { PreservationPage } from './pages/PreservationPage';
import { ProcessPage } from './pages/ProcessPage';
import { ProductsPage } from './pages/ProductsPage';
import { StoriesPage } from './pages/StoriesPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917]">
            <SiteHeader />
            <main className="flex-1">
              <OperationalRibbon />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/gioi-thieu" element={<AboutPage />} />
                <Route path="/lich-su" element={<HistoryPage />} />
                <Route path="/quy-trinh" element={<ProcessPage />} />
                <Route path="/san-pham" element={<ProductsPage />} />
                <Route path="/nghe-nhan" element={<ArtisansPage />} />
                <Route path="/thach-thuc" element={<ChallengesPage />} />
                <Route path="/cau-chuyen" element={<StoriesPage />} />
                <Route path="/bao-ton" element={<PreservationPage />} />
                <Route path="/kham-pha" element={<DiscoveryQuizPage />} />
                <Route path="/lien-he" element={<ContactPage />} />
                <Route path="/quan-tri" element={<AdminPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>
            <SiteFooter />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
