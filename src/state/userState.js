import { atom, selector, selectorFamily } from 'recoil';
import axios from 'axios';

export const usersRefetchState = atom({
    key: 'usersRefetchState',
    default: 0,
});

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

export const userInfoState = atom({
    key: 'userInfoState',
    default: null,
    effects_UNSTABLE: [
        localStorageEffect('userInfo'),
    ],
});

// Login states
export const userLoginLoadingState = atom({
    key: 'userLoginLoadingState',
    default: false,
});
export const userLoginErrorState = atom({
    key: 'userLoginErrorState',
    default: null,
});

// Register states
export const userRegisterLoadingState = atom({
    key: 'userRegisterLoadingState',
    default: false,
});
export const userRegisterErrorState = atom({
    key: 'userRegisterErrorState',
    default: null,
});

// User details
export const userDetailsState = atom({
    key: 'userDetailsState',
    default: null,
});

// User profile update states
export const userUpdateProfileLoadingState = atom({
    key: 'userUpdateProfileLoadingState',
    default: false,
});
export const userUpdateProfileErrorState = atom({
    key: 'userUpdateProfileErrorState',
    default: null,
});
export const userUpdateProfileSuccessState = atom({
    key: 'userUpdateProfileSuccessState',
    default: false,
});

// Admin: User list states
export const usersListState = atom({
    key: 'usersListState',
    default: [],
});
export const usersListLoadingState = atom({
    key: 'usersListLoadingState',
    default: false,
});
export const usersListErrorState = atom({
    key: 'usersListErrorState',
    default: null,
});

// Admin: User delete states
export const userDeleteLoadingState = atom({
    key: 'userDeleteLoadingState',
    default: false,
});
export const userDeleteErrorState = atom({
    key: 'userDeleteErrorState',
    default: null,
});
export const userDeleteSuccessState = atom({
    key: 'userDeleteSuccessState',
    default: false,
});

// Admin: User update states
export const userUpdateLoadingState = atom({
    key: 'userUpdateLoadingState',
    default: false,
});
export const userUpdateErrorState = atom({
    key: 'userUpdateErrorState',
    default: null,
});
export const userUpdateSuccessState = atom({
    key: 'userUpdateSuccessState',
    default: false,
});


// Selectors for fetching data
export const userDetailsQuery = selectorFamily({
    key: 'userDetailsQuery',
    get: (id) => async ({get}) => {
        const userInfo = get(userInfoState);
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(`/api/users/${id}`, config);
        return data;
    },
});

export const usersListQuery = selector({
    key: 'usersListQuery',
    get: async ({get}) => {
        get(usersRefetchState); // depend on this atom
        const userInfo = get(userInfoState);
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get('/api/users', config);
        return data;
    },
}); 