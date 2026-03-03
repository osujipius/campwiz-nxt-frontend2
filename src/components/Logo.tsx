import { Link } from 'react-router-dom'

const Logo = () => (
    <Link to="/" className='cursor-pointer'>
        <img src="/logo.svg" alt="Logo of CampWiz" height={80} style={{ margin: 'auto', height: 80 }} />
    </Link>
)

export default Logo
