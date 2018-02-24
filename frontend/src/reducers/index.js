import {
    sidebarChanged,
    tabChanged
} from './IndexReducer';
import {
    login
} from './UserReducer';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

// const initialState = {
//     sidebarVisibility: false,
//     count: 0,
// };
// export default function rootReducer(state=initialState, action) {
//     // return state;
//     return {...state, SidebarChanged: SidebarChanged(state.sidebarVisibility, action),}
// /*    return Object.assign({}, state, {
//         SidebarChanged: SidebarChanged(state.sidebarVisibility, action),
//     })*/
// }

export default combineReducers({
    sidebarChanged,
    tabChanged,
    login,
    router: routerReducer,
})

