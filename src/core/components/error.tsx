/**
 * @name ErrorHandler
 * @file error.ts
 * @description use to show error message.
 */

// Modules
import React from 'react'
import PropTypes from 'prop-types'
import { GlobalError } from 'react-hook-form'

interface Props {
    root?: Record<string, GlobalError> & GlobalError
}

const propTypes = {
    /**
     * Set input form field validation key
     */
    root: PropTypes.any
}


/**
 * 
 * Get error element
 * @param message 
 * @returns 
 */
function errorEl(message: string) {
    return (
        <span className='invalid-feedback fw-medium d-block'>
            {message}
        </span>
    )
}

const ErrorHandler: React.FC<Props> = ({root}) => {

    if (root) {
        if (root.type === 'required') {
            return errorEl('This field is required.')

        } else if (root.type === 'pattern') {
            if (root.message === 'email') {
                return errorEl('Provide a valid email id.')
            } else if (root.message === 'password') {
                return errorEl('At least 8 characters, 1 letter, 1 number and 1 special character.')
            } else if (root.message === 'phone') {
                return errorEl('Enter valid mobile number.')
            }

        } else if (root.type === 'minLength') {
            return errorEl('Field must have ' + root.message + ' characters.')
        }
        
    }

    return null
}


ErrorHandler.propTypes = propTypes as any
ErrorHandler.displayName = 'ErrorHandler'

export default ErrorHandler