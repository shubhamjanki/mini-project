import React from "react";
// Update the import path if the folder or file name is different, e.g.:
import AppHeader from '../_component/AppHeader';
// Or, if the file is named 'appHeader.tsx':
// import AppHeader from './_component/appHeader'
const DashboardLayout = ({children}:any) => {
  return (
    <div>
        <AppHeader/>
        {children}
    </div>
)
};

export default DashboardLayout;
