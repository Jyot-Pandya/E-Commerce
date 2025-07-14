import { atom, selector } from 'recoil';

const localStorageEffect = key => ({setSelf, onSet}) => {
  const savedValue = localStorage.getItem(key)
  if (savedValue != null) {
    setSelf(JSON.parse(savedValue));
  }

  onSet((newValue, _, isReset) => {
    isReset
      ? localStorage.removeItem(key)
      : localStorage.setItem(key, JSON.stringify(newValue));
  });
};

export const cartState = atom({
  key: 'cartState',
  default: [],
  effects_UNSTABLE: [
    localStorageEffect('cartItems'),
  ],
});

export const shippingAddressState = atom({
  key: 'shippingAddressState',
  default: {},
  effects_UNSTABLE: [
    localStorageEffect('shippingAddress'),
  ],
});

export const paymentMethodState = atom({
  key: 'paymentMethodState',
  default: '',
  effects_UNSTABLE: [
    localStorageEffect('paymentMethod'),
  ],
});

export const cartTotalState = selector({
  key: 'cartTotalState',
  get: ({ get }) => {
    const cart = get(cartState);
    const itemsPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice);
    
    return {
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    };
  },
}); 