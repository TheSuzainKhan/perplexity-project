import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'


const Protected = ({ children }) => {
    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d] text-sm text-[#8d8d8d]">Loading...</div>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }


    return children
}

export default Protected
