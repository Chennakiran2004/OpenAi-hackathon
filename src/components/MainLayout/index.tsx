import React from 'react';
import Sidebar from '../Sidebar';
import { useAuth } from '../../contexts/AuthContext';

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { logout } = useAuth();

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar onLogout={logout} />
            <div className="flex-1 ml-64">
                {children}
            </div>
        </div>
    );
}
