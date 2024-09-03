import { Outlet } from "react-router-dom";
import DashHeader from "./DashHeader";
import DahsFooter from "./DashFooter";

const DashLayout = () => {
    return (
        <>
            <DashHeader />
            <div className="dash-container">
                <Outlet />
            </div>
            <DahsFooter />
        </>
    )
}
export default DashLayout;