import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="flex bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;