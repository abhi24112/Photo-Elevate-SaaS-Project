import CreditDisplay from '@/components/CreditDisplay'
import { ModernNavbar } from '@/components/ui/navbar-menu'
import React from 'react'

function page() {
  return (
    <div>
        <ModernNavbar/>
        <CreditDisplay userCredits={0} />
    </div>
  )
}

export default page