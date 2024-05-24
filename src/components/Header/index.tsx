import * as React from 'react';
import Logo from '../Base/Logo';

const Header: React.FC = () => {
    return (
        <nav className="flex items-center justify-center flex-wrap bg-violet-400 p-6">
            <div className="flex items-center text-white h-8">
                <div className="mr-2">
                    <Logo />
                </div>
                <h1 className="font-semibold text-xl tracking-tight">
                    Simple Weather App
                </h1>
            </div>
        </nav>
    )
}

export default Header
