import { Link } from 'react-router-dom';

const Logo = () => (
    <Link to="/" className="cursor-pointer">
        <img src="/logo.svg" alt="Logo of CampWiz" style={{ height: 80, margin: 'auto', display: 'block' }} />
    </Link>
);

export default Logo;
