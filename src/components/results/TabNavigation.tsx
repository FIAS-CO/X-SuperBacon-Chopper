import React from 'react';
import { Link } from 'react-router-dom';

interface TabNavigationProps {
  isShadowbanTab: boolean;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ isShadowbanTab }) => {
  const activeTabStyles = "flex-1 text-center py-4 px-4 border-b-2 border-blue-500 text-blue-600 font-medium";
  const linkTabStyles = "flex-1 text-center py-4 px-4 text-gray-500 hover:text-gray-700";

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="flex border-b border-gray-200">
        {isShadowbanTab ? (
          <div className={activeTabStyles}>Shadowban Checker</div>
        ) : (
          <Link to="/" className={linkTabStyles}>Shadowban Checker</Link>
        )}

        {isShadowbanTab ? (
          <Link to="/tweetcheck" className={linkTabStyles}>Searchban Checker</Link>
        ) : (
          <div className={activeTabStyles}>Searchban Checker</div>
        )}
      </div>
    </div>
  );
};

export default TabNavigation;