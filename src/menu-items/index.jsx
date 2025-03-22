// project import
// import getAnalityMenuObject from './analiz';
// import getChatMenuObject from './transaction_history';

import dashboard from './dashboard';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = () => {
  // const transactionHistory = getChatMenuObject();
  return {
    items: [dashboard]
  };
};

export default menuItems;
