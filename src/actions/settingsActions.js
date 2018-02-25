
export function changeOutputDir(path) {
    return {
        type: "CHANGE_OUTPUT_DIR",
        payload: path
    }
}