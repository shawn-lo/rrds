export function sidebarChanged(state={sidebarVisibility: false}, action) {
    switch(action.type) {
        case 'TOGGLE_SIDEBAR_VISIBILITY':
            return {...state, sidebarVisibility: !state.sidebarVisibility};
        default:
            return state;
    }
}

export function tabChanged(state={activedTab: "acct"}, action) {
    switch(action.type) {
        case 'CHANGE_TAB':
            return {...state, activedTab: action.tabID};
        default:
            return state;
    }
}