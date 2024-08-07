import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from '../store/userSlice'
import LogoutIcon from '@mui/icons-material/Logout';

export default function Header() {
  const dispatch =useDispatch()
  const name = useSelector((state) => state.user.name)
  useEffect(() => {
    dispatch(fetchUser())
  }, [])

  return (
    <div className='flex items-center justify-between p-2 px-4 m-2 rounded-lg shadow-xl shadow-blue-500'>
        <div className='text-5xl font-bold text-blue-500'>dGate</div>
        <div className='flex  items-center justify-center text-2xl font-semibold bg-slate-600 text-white p-2 px-4 rounded-lg'>
          <span>👋 Hi, {name}</span>
          <div onClick={() => { 
            localStorage.clear()
            window.location.replace('/auth')
          }} className='ml-4 text-slate-700 bg-white  p-2 px-3 text-xl font-bold shadow-xl active:scale-90 cursor-pointer rounded-full'>
          <LogoutIcon />
          </div>
        </div>
    </div>
  )
}
