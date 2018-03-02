export default function reducer (state={
    outputDir: "",
    ffmpegPath: "",
    error: null
}, action){
    switch(action.type) {
        case "CHANGE_OUTPUT_DIR": {
            return {
                ...state,
                outputDir: action.payload,
            }
        }
        case "CHANGE_FFMPEG_PATH": {
            return {
                ...state,
                ffmpegPath: action.payload,
            }
        }
        default: {
            return state;
        }
    }
}