import { Outlet } from "react-router-dom";

function Admin() {
  return (
    <div>
      {/* <div className="flex h-full flex-1 flex-col px-[22px] md:flex pt-3"> */}
        <Outlet />
      
    </div>
  );
}

export default Admin;
