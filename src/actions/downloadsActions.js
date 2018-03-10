let dlCounter = 0;
const downloadTemplate = {
    isDownloading: false,
    isFinished: false
};

export function addDownload(url, info) {
    return {
        type: "ADD_DOWNLOAD",
        payload: {
            ...downloadTemplate,
            id: dlCounter++,
            url: url,
            info: info
        }
    }
}

export function startDownloads(downloads) {
    return {
        type: "START_DOWNLOADS",
        payload: downloads
    }
}

export function removeDownload(id) {
    return {
        type: "REMOVE_DOWNLOAD",
        payload: id
    }
}

export function startDownload(id, proc) {
    return {
        type: "START_DOWNLOAD",
        payload: {
            id: id,
            proc: proc
        }
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