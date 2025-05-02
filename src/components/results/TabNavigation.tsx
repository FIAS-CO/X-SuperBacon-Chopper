import React from 'react';
import { Link } from 'react-router-dom';

interface TabNavigationProps {
  isShadowbanTab: boolean;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ isShadowbanTab }) => {
  const activeTabStyles = "flex-1 text-center py-4 px-4 border-b-2 border-blue-500 text-blue-600 font-medium";
  const linkTabStyles = "flex-1 text-center py-4 px-4 text-gray-500 hover:text-gray-700";
  const shadowbanTabName = "Shadowban Checker";
  const postbanTabName = "PostBan Checker";

  return (
    <div className="w-full max-w-screen-xl mx-auto mb-6">
      <div className="flex border-b border-gray-200">
        {isShadowbanTab ? (
          <div className={activeTabStyles}>{shadowbanTabName}</div>
        ) : (
          <Link to="/" className={linkTabStyles}>{shadowbanTabName}</Link>
        )}

        {isShadowbanTab ? (
          <Link to="/tweetcheck" className={linkTabStyles}>{postbanTabName}</Link>
        ) : (
          <div className={activeTabStyles}>{postbanTabName}</div>
        )}
      </div>
    </div>
  );
};

export default TabNavigation;