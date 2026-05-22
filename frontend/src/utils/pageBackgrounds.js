/** Unsplash photos — bakery & restaurant themed */
export const IMAGES = {
  bakeryBread: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1600&q=80&auto=format&fit=crop',
  pastries: 'https://images.unsplash.com/photo-1483695988930-7ada17eac3ab?w=1600&q=80&auto=format&fit=crop',
  croissants: 'https://images.unsplash.com/photo-1555507036-ab794f4adae4?w=1600&q=80&auto=format&fit=crop',
  cake: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1600&q=80&auto=format&fit=crop',
  bakeryDisplay: 'https://images.unsplash.com/photo-1586985289909-40698805e305?w=1600&q=80&auto=format&fit=crop',
  restaurantDining: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80&auto=format&fit=crop',
  restaurantMeals: 'https://images.unsplash.com/photo-1546069901-ba9599a1e63c?w=1600&q=80&auto=format&fit=crop',
  grillFood: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=80&auto=format&fit=crop',
  menuSpread: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80&auto=format&fit=crop',
  coffeeShop: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=80&auto=format&fit=crop',
  kitchen: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&q=80&auto=format&fit=crop',
  storefront: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80&auto=format&fit=crop',
  ingredients: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1600&q=80&auto=format&fit=crop',
  tableSetting: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&q=80&auto=format&fit=crop',
};

export const PAGE_BACKGROUNDS = {
  '/': {
    variant: 'single',
    overlay: 'home',
    images: [IMAGES.restaurantDining],
  },
  '/menu': {
    variant: 'single',
    overlay: 'content',
    images: [IMAGES.menuSpread],
  },
  '/orders': {
    variant: 'single',
    overlay: 'content',
    images: [IMAGES.tableSetting],
  },
  '/login/user': {
    variant: 'single',
    overlay: 'auth',
    images: [IMAGES.coffeeShop],
  },
  '/login/admin': {
    variant: 'single',
    overlay: 'admin',
    images: [IMAGES.kitchen],
  },
  '/register': {
    variant: 'single',
    overlay: 'auth',
    images: [IMAGES.storefront],
  },
  '/admin': {
    variant: 'single',
    overlay: 'admin',
    images: [IMAGES.ingredients],
  },
};

export function getPageBackground(pathname) {
  return PAGE_BACKGROUNDS[pathname] || null;
}
