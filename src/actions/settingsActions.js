export function changeOutputDir(path) {
    return {
        type: "CHANGE_OUTPUT_DIR",
        payload: path
    }
}

export function changeFfmpegPath(path) {
    return {
        type: "CHANGE_FFMPEG_PATH",
        payload: path
    }
}