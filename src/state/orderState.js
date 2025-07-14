import { atom, selector, selectorFamily } from 'recoil';
import axios from 'axios';
import { userInfoState } from './userState';

export const orderDetailsRefetchState = atom({
    key: 'orderDetailsRefetchState',
    default: 0,
});

// Create Order
export const orderCreateLoadingState = atom({ key: 'orderCreateLoadingState', default: false });
export const orderCreateErrorState = atom({ key: 'orderCreateErrorState', default: null });
export const orderCreateSuccessState = atom({ key: 'orderCreateSuccessState', default: false });
export const createdOrderState = atom({ key: 'createdOrderState', default: null });

// Order Details
export const orderDetailsState = atom({ key: 'orderDetailsState', default: null });
export const orderDetailsQuery = selectorFamily({
    key: 'orderDetailsQuery',
    get: (id) => async ({ get }) => {
        get(orderDetailsRefetchState);
        const userInfo = get(userInfoState);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`/api/orders/${id}`, config);
        return data;
    }
});

// Order Pay
export const orderPayLoadingState = atom({ key: 'orderPayLoadingState', default: false });
export const orderPayErrorState = atom({ key: 'orderPayErrorState', default: null });
export const orderPaySuccessState = atom({ key: 'orderPaySuccessState', default: false });

// My Orders List
export const myOrdersListState = atom({ key: 'myOrdersListState', default: [] });
export const myOrdersListQuery = selector({
    key: 'myOrdersListQuery',
    get: async ({ get }) => {
        const userInfo = get(userInfoState);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/orders/myorders', config);
        return data;
    }
});


// Order Deliver (Admin)
export const orderDeliverLoadingState = atom({ key: 'orderDeliverLoadingState', default: false });
export const orderDeliverErrorState = atom({ key: 'orderDeliverErrorState', default: null });
export const orderDeliverSuccessState = atom({ key: 'orderDeliverSuccessState', default: false });

// Orders List (Admin)
export const ordersListRefetchState = atom({ key: 'ordersListRefetchState', default: 0 });
export const ordersListQuery = selector({
    key: 'ordersListQuery',
    get: async ({ get }) => {
        get(ordersListRefetchState);
        const userInfo = get(userInfoState);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/orders', config);
        return data;
    }
});