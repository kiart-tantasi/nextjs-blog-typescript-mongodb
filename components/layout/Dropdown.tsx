import MenuIcon from '@mui/icons-material/Menu'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import styles from './Dropdown.module.css'

const Dropdown = () => {
    const [openDropdown, setOpenDropdown] = useState(false)

    useEffect(() => {
        if (openDropdown === false) return

        window.onclick = (e: MouseEvent) => {
            if (openDropdown === true) {
                setOpenDropdown(false)
                window.onclick = null
                window.onpopstate = null
            }
        }

        window.onpopstate = (e: PopStateEvent) => {
            if (openDropdown === true) {
                setOpenDropdown(false)
                window.onpopstate = null
                window.onclick = null
            }
        }
    }, [openDropdown])

    const handleToggleDropdown = () => {
        setOpenDropdown(prev => !prev)
    }

    const handleCloseDropdown = () => {
        setOpenDropdown(false)
    }

    return (
        <div className={styles.dropdown}>
            <span onClick={handleToggleDropdown} className={styles['dropdown-button']}>
                <MenuIcon />
            </span>
            {openDropdown && (
                <div className={styles['dropdown-content']}>
                    <span onClick={handleCloseDropdown} className={styles['show-450']}>
                        <Link href='/tech'>โลกเทค</Link>
                    </span>
                    <span onClick={handleCloseDropdown} className={styles['show-860']}>
                        <Link href='/HowIBuildThisWebsite'>How I Build This Website</Link>
                    </span>
                    <span onClick={handleCloseDropdown}>
                        <Link href='/aboutme'>ประวัติผู้เขียน</Link>
                    </span>
                </div>
            )}
        </div>
    )
}

export default Dropdown
