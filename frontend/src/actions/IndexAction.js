export function toggleSidebarVisibility() {
    return {
        type: 'TOGGLE_SIDEBAR_VISIBILITY',
    };
}

export function changeTab(tabID) {
    return {
        type: 'CHANGE_TAB',
        tabID,
    }
}