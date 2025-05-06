'use client'

import { Catalogo } from '@/components/Catalogo/Catalogo'
import SideBarComponent from '@/components/SideBar/SideBarComponent'

const catalogoPage = () => {
  return (
    <div className='flex'>
      <SideBarComponent className='bg-[#31363F]' />
      <Catalogo />
    </div>
  )
}

export default catalogoPage
