import * as React from 'react';
import Header from "../Header";

interface LayoutProps {
    children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="w-full">
            <Header />
            <div className="w-full flex flex-col items-center">
                {children}
            </div>
        </div>
    )
}

export default Layout