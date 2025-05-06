"use client"

import React, { useState, useRef, useEffect } from 'react'
import { RiCloseLine } from '@remixicon/react'
import classNames from 'classnames'

interface Props {
    options: string[]
    selected: string[]
    onChange: (selected: string[]) => void
    placeholder: string
    className?: string
    error?: boolean
}

const MultiSelect: React.FC<Props> = ({
    options,
    selected,
    onChange,
    placeholder,
    className,
    error
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selected.includes(option)
    )

    const handleRemove = (optionToRemove: string) => {
        onChange(selected.filter(item => item !== optionToRemove))
    }

    const handleSelect = (option: string) => {
        onChange([...selected, option])
        setSearchTerm('')
    }

    return (
        <div className="position-relative" ref={wrapperRef}>
            <div
                className={classNames(
                    'form-control cursor-text min-height-auto',
                    error && 'is-invalid',
                    className
                )}
                onClick={() => setIsOpen(true)}
            >
                <div className="d-flex flex-wrap gap-2 align-items-center">
                    {selected.map((item) => (
                        <span
                            key={item}
                            className="badge bg-primary d-flex align-items-center"
                        >
                            {item}
                            <button
                                type="button"
                                className="btn btn-link text-white p-0 ms-2"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemove(item)
                                }}
                            >
                                <RiCloseLine size={16} />
                            </button>
                        </span>
                    ))}
                    <input
                        type="text"
                        className="border-0 flex-grow-1 bg-transparent"
                        placeholder={selected.length === 0 ? placeholder : ''}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                    />
                </div>
            </div>
            {isOpen && (
                <div className="position-absolute top-100 start-0 w-100 mt-1 border rounded bg-white shadow-sm z-1">
                    {filteredOptions.length > 0 ? (
                        <ul className="list-unstyled m-0 py-2">
                            {filteredOptions.map((option) => (
                                <li
                                    key={option}
                                    className="px-3 py-1 cursor-pointer hover-bg-light"
                                    onClick={() => handleSelect(option)}
                                >
                                    {option}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-3 text-muted">
                            {searchTerm ? 'No matches found' : 'No options available'}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default MultiSelect