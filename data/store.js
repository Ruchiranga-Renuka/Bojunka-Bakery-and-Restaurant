const store = {
  restaurantFoods: [
    { id: 1, name: 'Grilled Chicken', price: 12.5, quantity: 10, available: true },
    { id: 2, name: 'Caesar Salad', price: 8.0, quantity: 5, available: true }
  ],
  bakeryFoods: [
    { id: 1, name: 'Sourdough Loaf', price: 5.0, quantity: 20, available: true },
    { id: 2, name: 'Chocolate Croissant', price: 3.0, quantity: 15, available: true }
  ],
  restaurantOrders: [],
  bakeryOrders: []
};

module.exports = store;
