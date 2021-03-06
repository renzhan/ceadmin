/**
 * Created by feichongzheng on 17/9/25.
 */
import {
    FIND_ASSIGN_USER_FOR_PAGE_FETCH, FIND_ASSIGN_USER_FOR_PAGE_SUCCESS, FIND_ASSIGN_USER_FOR_PAGE_ERROR,
    SELECT_ROW_KEYS_FOR_ASSIGN_USER
} from './actionTypes';

export default (state = {}, action) => {
    const type = action.type;
    switch (type) {
        case FIND_ASSIGN_USER_FOR_PAGE_FETCH: {
            return {
                ...state, type: type, selectedRowKeys: [],
            }
        }
        case FIND_ASSIGN_USER_FOR_PAGE_SUCCESS: {
            return {
                ...state, type: type, data: action.data, params: action.params, selectedRowKeys: []
            }
        }
        case FIND_ASSIGN_USER_FOR_PAGE_ERROR: {
            return {
                ...state, type: type, err: action.err, params: action.params, selectedRowKeys: []
            }
        }
        case SELECT_ROW_KEYS_FOR_ASSIGN_USER: {
            return {
                ...state, selectedRowKeys: action.selectedRowKeys
            }
        }
        default: {
            return state;
        }
    }
}