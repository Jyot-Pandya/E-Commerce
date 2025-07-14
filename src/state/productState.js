import { atom, selectorFamily, selector } from 'recoil';
import axios from 'axios';

export const productsRefetchState = atom({
    key: 'productsRefetchState',
    default: 0,
});

export const productsState = atom({
  key: 'productsState',
  default: [],
});

export const productDetailsState = atom({
  key: 'productDetailsState',
  default: { reviews: [] },
});

export const productLoadingState = atom({
  key: 'productLoadingState',
  default: false,
});

export const productErrorState = atom({
  key: 'productErrorState',
  default: null,
});

export const productPageState = atom({
  key: 'productPageState',
  default: 1,
});

export const productPagesState = atom({
  key: 'productPagesState',
  default: 1,
});

export const topProductsState = atom({
  key: 'topProductsState',
  default: [],
});

export const productCategoriesState = atom({
  key: 'productCategoriesState',
  default: [],
});

export const productSuccessState = atom({
  key: 'productSuccessState',
  default: false,
});

export const productSuccessCreateState = atom({
  key: 'productSuccessCreateState',
  default: false,
});

export const productCreateLoadingState = atom({
    key: 'productCreateLoadingState',
    default: false,
});

export const productCreateErrorState = atom({
    key: 'productCreateErrorState',
    default: null,
});

export const createdProductState = atom({
    key: 'createdProductState',
    default: null,
});

export const productSuccessUpdateState = atom({
  key: 'productSuccessUpdateState',
  default: false,
});

export const productUpdateLoadingState = atom({
    key: 'productUpdateLoadingState',
    default: false,
});

export const productUpdateErrorState = atom({
    key: 'productUpdateErrorState',
    default: null,
});

export const productSuccessDeleteState = atom({
  key: 'productSuccessDeleteState',
  default: false,
});

export const productDeleteLoadingState = atom({
    key: 'productDeleteLoadingState',
    default: false,
});

export const productDeleteErrorState = atom({
    key: 'productDeleteErrorState',
    default: null,
});

export const productReviewLoadingState = atom({
    key: 'productReviewLoadingState',
    default: false,
});

export const productReviewErrorState = atom({
    key: 'productReviewErrorState',
    default: null,
});

export const productReviewSuccessState = atom({
    key: 'productReviewSuccessState',
    default: false,
});

export const productsQuery = selectorFamily({
    key: 'productsQuery',
    get: ({ keyword = '', pageNumber = 1, category = '' }) => async ({get}) => {
        get(productsRefetchState); // depend on this atom
        const { data } = await axios.get(
            `/api/products?keyword=${keyword}&pageNumber=${pageNumber}${category ? `&category=${category}` : ''}`
        );
        return data;
    },
});

export const categoriesQuery = selector({
    key: 'categoriesQuery',
    get: async () => {
        const { data } = await axios.get('/api/products/categories');
        return data;
    },
});

export const topProductsQuery = selector({
    key: 'topProductsQuery',
    get: async () => {
        const { data } = await axios.get('/api/products/top');
        return data;
    },
});

export const productDetailsQuery = selectorFamily({
    key: 'productDetailsQuery',
    get: (id) => async () => {
        const { data } = await axios.get(`/api/products/${id}`);
        return data;
    },
});

export const productSearchKeywordState = atom({
    key: 'productSearchKeywordState',
    default: '',
});

export const productCategoryState = atom({
    key: 'productCategoryState',
    default: '',
}); 