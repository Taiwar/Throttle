export default function reducer (state={
    outputDir: "",
    error: null
}, action){
    switch(action.type) {
        case "CHANGE_OUTPUT_DIR": {
            return {
                ...state,
                outputDir: action.payload,
            }
        }
        default: {
            return state;
        }
    }
}