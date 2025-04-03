import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const links = [
  { path: '/', label: 'Home' },
  { path: '/members', label: 'All Members' },

  // Add more links as needed
];

const MobileMenu = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(true);
  };

  // New function to handle clicks outside the menu
  const handleClickOutside = (event: MouseEvent) => {
    const menu = document.getElementById('mobile-menu');
    const button = document.getElementById('menu-button');
    if (
      menu && !menu.contains(event.target as Node) && 
      button && !button.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  // Adding event listener on component mount
  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button 
        id="menu-button"
        onClick={toggleMenu} 
        className="p-2 text-gray-800 dark:text-gray-200 bg-gray-200 rounded-md"
      >
        {t('Menu')}
      </button>
      {isOpen && (
        <div id="mobile-menu" className="absolute bg-white dark:bg-gray-800 mt-2 rounded-md shadow-lg">
          <ul>
            {links.map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path} 
                  className="block p-2 text-gray-800 dark:text-gray-200"
                  onClick={() => setIsOpen(false)}
                >
                  {t(link.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MobileMenu; 