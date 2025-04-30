import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Logout = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    // Clear authentication state
    localStorage.removeItem('isLoggedIn');
    // Update the authentication state in the app
    window.location.reload();
    // Redirect to login page
    navigate('/login', { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-red-600 hover:text-red-500"
    >
      {t('auth.logout')}
    </button>
  );
};

export default Logout;
