import React from 'react';
import Logo from '../Logo/Logo';
import { Outlet } from 'react-router';
import AuthImage from "../../assets/assets/authImage.png";

const AuthLayout = () => {
    return (
        <div>
            <Logo></Logo>
            <div className='flex'>
                <div className='flex-1'>
                    <Outlet></Outlet>
                </div>
                <div className='flex-1'>
                    <img src={AuthImage} alt="Auth-Image" />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;