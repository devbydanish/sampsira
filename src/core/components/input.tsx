/**
 * @name Input
 * @file input.tsx
 * @description input component
 */
"use client"

// Modules
import React, { forwardRef } from 'react' // Import forwardRef from React
import PropTypes from 'prop-types'
// import { PolymorphicComponentPropsWithoutRef } from '@/core/types'; // Commented out

export interface InputProps {
    as?: 'input' | 'textarea' | 'select';
    type?: string;
    options?: { value: string; label: string }[];
    placeholder?: string;
    label?: string;
    id?: string;
    className?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const propTypes = {
    /**
     * @default 'input'
     * The underlying HTML element to use when rendering the Input.
     *
     * @type ('input'|'textarea'|elementType)
     */
    as: PropTypes.elementType,

    /**
     * The HTML input `type`, which is only relevant if `as` is `'input'` (the default).
     */
    type: PropTypes.string,

    /**
     * Set input label 
     */
    label: PropTypes.string, // label prop is here in propTypes
}

const defaultComponent = 'input';

// Define Input component using forwardRef directly
const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, InputProps>(({
    as: Component = defaultComponent,
    type = 'text',
    label,
    id,
    placeholder,
    className,
    value,
    onChange,
    ...props
}, ref) => {
    return (
        <>
            {label && (
                <label htmlFor={id} className='form-label fw-medium'>
                    {label}
                </label>
            )}
            <Component
                ref={ref}
                id={id}
                type={Component === 'input' ? type : undefined}
                placeholder={placeholder}
                className={className}
                value={value}
                onChange={onChange}
                {...props}
            />
        </>
    );
});


Input.propTypes = propTypes as any
Input.displayName = 'Input'

export default Input