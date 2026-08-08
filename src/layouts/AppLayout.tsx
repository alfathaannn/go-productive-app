import { App, Page } from "konsta/react";
import { Outlet } from "react-router-dom";
import BottomTabbar from "@/components/BottomTabbar";

export default function AppLayout() {
  return (
    <App theme="ios" safeAreas className="!bg-background h-full w-full">
      <Page className="!bg-background" style={{ backgroundColor: 'var(--background)' }}>
        {/* Konten Halaman Aktif */}
        <div className="h-full w-full overflow-auto flex flex-col bg-background">
          <Outlet />
        </div>

        {/* Custom Tabbar Bawah */}
        <BottomTabbar />
      </Page>
    </App>
  );
}
