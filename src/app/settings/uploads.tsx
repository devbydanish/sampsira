"use client"

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Section from '@/view/layout/section'
import Tab from '@/core/components/tab'
import { useAuthentication } from '@/core/contexts/authentication'
import TrackCard from '@/core/components/card/track'

const UserUploads = () => {
    const locale = useTranslations()
    const { currentUser } = useAuthentication()
    const [activeTab, setActiveTab] = useState('samples')
    const [editModeId, setEditModeId] = useState<string | null>(null)
    const [editState, setEditState] = useState<any>(null)

    const tabs = [
        { id: 'samples', name: locale('samples') },
        { id: 'licenses', name: locale('licenses') },
        // { id: 'sound_kits', name: locale('sound_kits') }
    ]

    const tracks = currentUser?.tracks?.map((item:any) => ({
        ...item,
        cover: item.cover.url ? process.env.NEXT_PUBLIC_STRAPI_URL + item.cover.url : '/images/cover/default.jpg',
        src: process.env.NEXT_PUBLIC_STRAPI_URL + item.audio.url,
    }))

    // State for purchased licenses
    const [licenses, setLicenses] = useState<any[]>([])
    const [isLoadingLicenses, setIsLoadingLicenses] = useState(false)

    // Fetch licenses when the licenses tab is active
    useEffect(() => {
        const fetchLicenses = async () => {
            if (activeTab === 'licenses') {
                setIsLoadingLicenses(true)
                try {
                    const response = await fetch('/api/licenses/purchased', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                        }
                    })
                    
                    if (response.ok) {
                        const data = await response.json()
                        setLicenses(data)
                    } else {
                        console.error('Failed to fetch licenses')
                    }
                } catch (error) {
                    console.error('Error fetching licenses:', error)
                } finally {
                    setIsLoadingLicenses(false)
                }
            }
        }
        
        fetchLicenses()
    }, [activeTab])

    // Format date for display
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date)
    }

    // Handler to start editing a sample
    const handleEditSample = (track: any) => {
        setEditModeId(track.id)
        setEditState(track)
    }

    // Handler to cancel editing
    const handleCancelEdit = () => {
        setEditModeId(null)
        setEditState(null)
    }

    // Handler to save edits (implement API call as needed)
    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: API call to update sample
        setEditModeId(null)
        setEditState(null)
        // Optionally update local state or refetch
    }

    // Handler to delete sample (implement API call as needed)
    const handleDeleteSample = async () => {
        // TODO: API call to delete sample
        setEditModeId(null)
        setEditState(null)
        // Optionally update local state or refetch
    }

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    return (
        <div className="card-body">
            <h5 className="mb-4 text-black">My Samples</h5>
            <Tab id="uploads">
                {tabs.map((tab) => (
                    <li key={tab.id} className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                            id={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.name}
                        </button>
                    </li>
                ))}
            </Tab>

            <div className="tab-content">
                {editModeId ? (
                    <form className='edit-form' onSubmit={handleSaveEdit}>
                        <div className="d-flex gap-4">
                            <div className="edit-preview">
                                <div className="preview-image position-relative mb-3">
                                    <img 
                                        src={editState.cover} 
                                        alt='cover preview' 
                                        className='rounded' 
                                        style={{width: '100%', height: '100%', objectFit:'cover'}} 
                                    />
                                    <label className="change-image-btn">
                                        <input 
                                            type='file' 
                                            className='d-none' 
                                            accept='image/*' 
                                            onChange={e=>{
                                                if(e.target.files && e.target.files[0]){
                                                    setEditState({
                                                        ...editState, 
                                                        cover: URL.createObjectURL(e.target.files[0]), 
                                                        coverFile: e.target.files[0]
                                                    })
                                                }
                                            }} 
                                        />
                                        Change Image
                                    </label>
                                </div>
                            </div>
                            <div className="flex-grow-1">
                                <div className="form-fields">
                                    <h3 className="mb-4 text-black">{editState.title}</h3>
                                    <div className='form-group mb-3'>
                                        <label className='form-label fw-medium mb-2'>Genre</label>
                                        <select
                                            className='form-select'
                                            value={editState.genre || ''}
                                            onChange={e=>setEditState({...editState, genre: e.target.value})}
                                        >
                                            <option value="">Select genre</option>
                                            {[
                                                'Reggaeton', 'Trap', 'Hip-Hop/Rap', 'Drill', 'Techno', 
                                                'Drum & Bass', 'Jersey Club', 'Dancehall', 'Afrobeat', 'Amapiano', 'House', 'Pop', 'R&B'
                                            ].map((g:string) => (
                                                <option key={g} value={g}>{g}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label className='form-label fw-medium mb-2'>BPM</label>
                                        <input 
                                            className='form-control' 
                                            value={editState.bpm || ''} 
                                            onChange={e=>setEditState({...editState, bpm: e.target.value})}
                                            placeholder="Enter BPM"
                                        />
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label className='form-label fw-medium mb-2'>Keys</label>
                                        <input 
                                            className='form-control' 
                                            value={Array.isArray(editState.keys) ? editState.keys.join(', ') : (editState.keys || '')} 
                                            onChange={e=>setEditState({...editState, keys: e.target.value.split(',').map((k:string)=>k.trim())})}
                                            placeholder="Enter keys (comma separated)"
                                        />
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label className='form-label fw-medium mb-2'>Moods</label>
                                        <input 
                                            className='form-control' 
                                            value={Array.isArray(editState.moods) ? editState.moods.join(', ') : (editState.moods || '')} 
                                            onChange={e=>setEditState({...editState, moods: e.target.value.split(',').map((m:string)=>m.trim())})}
                                            placeholder="Enter moods (comma separated)"
                                        />
                                    </div>
                                </div>
                                <div className='d-flex justify-content-between align-items-center mt-4'>
                                    <button type='button' className='btn btn-link text-secondary' onClick={handleCancelEdit}>
                                        Cancel
                                    </button>
                                    <button type='submit' className='text-white btn btn-primary'>
                                        Save Changes
                                    </button>
                                    <button type='button' className='btn btn-link text-danger' onClick={()=>setShowDeleteConfirm(true)}>
                                        Delete Sample
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className={`tab-pane fade ${activeTab === 'samples' ? 'show active' : ''}`}>
                        {(currentUser?.tracks?.length || 0) > 0 ? (
                            <div className="my-uploads-sample-data">
                                <Section
                                    title=""
                                    data={tracks || []}
                                    card="track"
                                    slideView={4}
                                    navigation
                                    childProps={{
                                        myUploads: true,
                                        editModeId,
                                        onEditSample: handleEditSample
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="mb-0">{locale('no_samples_uploaded')}</p>
                            </div>
                        )}
                    </div>
                )}

                <div className={`tab-pane fade ${activeTab === 'licenses' ? 'show active' : ''}`}>
                    {isLoadingLicenses ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : licenses.length > 0 ? (
                        <div className="table-responsive licenses-table">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Date Purchased</th>
                                        <th>Sample Name</th>
                                        <th>Purchased By</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {licenses.map((license) => (
                                        <tr key={license.id}>
                                            <td>{formatDate(license.purchaseDate)}</td>
                                            <td>{license.sampleName}</td>
                                            <td>{license.purchasedBy}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-primary text-white"
                                                    onClick={() => window.open(license.licenseUrl, '_blank')}
                                                >
                                                    <i className="ri-file-text-line me-1"></i>
                                                    {locale('view_license')}
                                                </button>
                                                {/* Download Dropdown */}
                                                <div className="btn-group ms-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        Download
                                                    </button>
                                                    <ul className="dropdown-menu">
                                                        <li>
                                                            <button
                                                                className="dropdown-item text-white"
                                                                onClick={() => window.open(license.wavUrl, '_blank')}
                                                                disabled={!license.wavUrl}
                                                            >
                                                                .WAV File
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                className="dropdown-item text-white"
                                                                onClick={() => window.open(license.stemsUrl, '_blank')}
                                                                disabled={!license.stemsUrl}
                                                            >
                                                                Stems
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="mb-0">{locale('no_licenses_found')}</p>
                        </div>
                    )}
                </div>

                <div className={`tab-pane fade ${activeTab === 'sound_kits' ? 'show active' : ''}`}>
                    {(currentUser?.soundKits?.length || 0) > 0 ? (
                        <Section
                            title=""
                            data={currentUser?.soundKits || []}
                            card="track"
                            slideView={4}
                            navigation
                        />
                    ) : (
                        <div className="text-center">
                            <p className="mb-0">{locale('no_sound_kits_uploaded')}</p>
                        </div>
                    )}
                </div>
            </div>

            {showDeleteConfirm && (
                <div className='delete-confirm-overlay'>
                    <div className='delete-confirm-modal'>
                        <p>Are you sure you want to delete this sample?</p>
                        <div className='d-flex justify-content-end gap-2'>
                            <button 
                                className='btn btn-link text-secondary' 
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className='btn btn-danger' 
                                onClick={handleDeleteSample}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserUploads