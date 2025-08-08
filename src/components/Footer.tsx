import Link from 'next/link'
import React from 'react'
import { IconBrandGithub } from '@tabler/icons-react'
import { IconBrandLinkedin } from '@tabler/icons-react'

function Footer() {
  return (
    <div className='flex flex-wrap justify-center gap-2 mb-3'>
        <div className='flex gap-x-2'><IconBrandGithub/><Link href="https://github.com/abhi24112">Github</Link></div>
        <div className='mx-2 lg:mx-5'>|</div>
        <div className='flex gap-x-2'><IconBrandLinkedin/><Link href="https://www.linkedin.com/in/abhishek9910/">LinkedIn</Link></div>
        <div className='mx-2 lg:mx-5'>|</div>
        <div><Link href="https://github.com/abhi24112">Copyright &copy; 2025 Abhishek Prajapati</Link></div>
    </div>
  )
}

export default Footer