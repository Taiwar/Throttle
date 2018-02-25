let dlCounter = 0;
export function addDownload(url, info) {
    return {
        type: "ADD_DOWNLOAD",
        payload: {
            id: dlCounter++,
            url: url,
            info: info,
            isDownloading: false,
            isFinished: false
        }
    }
}

export function removeDownload(id) {
    return {
        type: "REMOVE_DOWNLOAD",
        payload: id
    }
}

export function startDownload(id) {
    return {
        type: "START_DOWNLOAD",
        payload: id
    }
}

export function endDownload(id) {
    return {
        type: "END_DOWNLOAD",
        payload: id
    }
}

export function changeInput(input) {
    return {
        type: "CHANGE_INPUT",
        payload: input
    }
}