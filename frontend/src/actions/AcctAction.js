export function loadData(response) {
    return {
        type: 'LOAD_DATA',
        response: response,
    }
}

export function changeInputText(text) {
    return {
        type: 'CHANGE_INPUT_TEXT',
        text,
    }
}

export function submitForm() {
    return {
        type: 'SUBMIT_FORM',
    }
}
