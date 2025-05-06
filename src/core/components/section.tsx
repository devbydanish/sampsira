import React from 'react'
import classNames from 'classnames'

interface Props {
    id?: string
    children: React.ReactNode
    className?: string
}

const Section: React.FC<Props> = ({ id, children, className }) => {
    return (
        <section
            id={id}
            className={classNames(
                'section',
                'py-5',
                className
            )}
        >
            <div className="container">
                {children}
            </div>
        </section>
    )
}

export default Section