import MenuIcon from '@mui/icons-material/Menu'
import Link from 'next/link'
import { useState } from 'react'

import styles from './Dropdown.module.css'

const Dropdown = () => {
    const [openDropdown, setOpenDropdown] = useState(false)

    const toggleDropdown = () => {
        setOpenDropdown(prev => !prev)
    }

    const closeDropdown = () => {
        setOpenDropdown(false)
    }

    return (
        <div className={styles.dropdown}>
            <span onClick={toggleDropdown} className={styles['dropdown-button']}>
                <MenuIcon />
            </span>
            {openDropdown && (
                <div className={styles['dropdown-content']}>
                    <span onClick={closeDropdown} className={styles['show-860']}>
                        <Link href='/website-tech-stack'>Website Tech Stack</Link>
                    </span>
                </div>
            )}
        </div>
    )
}

export default Dropdown
