export const ROUTES = {
  HOME: 'Home',

  SEARCH: 'Search',

  PROFILE: {
    ROOT: 'Profile',
    SAVED: 'ProfileSaved',
    FOLLOWERS: 'ProfileFollowers',
    FOLLOWINGS: 'ProfileFollowings',
  },

  PRODUCT: {
    ROOT: 'Product',
    GALLERY: 'ProductGallery',
    DISCOUNT: 'ProductDiscount',
  },

  REPORT: 'Report',

  INBOX: {
    ROOT: 'Inbox',
    CHAT: 'Chat',
  },

  NOTIFICATIONS: 'Notifications',

  SELL: 'Sell',

  CART: 'Cart',

  ORDERS: 'Orders',
  ORDER: 'Order',

  SETTINGS: {
    ROOT: 'Settings',
    PERSONAL: 'SettingsPersonal',
    PROFILE: 'SettingsProfile',
  },

  LOGIN: 'Login',
  SIGNUP: 'Signup',
} as const;