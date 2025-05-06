"use client";

import React from 'react';
import { useAuthentication } from '@/core/contexts/authentication';
import { RiGoogleFill } from '@remixicon/react';
import classNames from 'classnames';
import { useTheme } from '@/core/contexts/theme';

const GoogleButton: React.FC = () => {
    const { signInWithGoogle } = useAuthentication();
    const { replaceClassName } = useTheme();

    return (
        <button 
            type="button" 
            className="btn btn-white w-100" 
            onClick={signInWithGoogle}
        >
            <span className="btn__wrap">
                <RiGoogleFill />
                <span className={replaceClassName('ms-2')}>
                    Register with Google
                </span>
            </span>
        </button>
    );
};

GoogleButton.displayName = 'GoogleButton';
export default GoogleButton;