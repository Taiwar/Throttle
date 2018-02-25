export default function reducer (state={
    inputValue: null,
    downloads: [],
    error: null
}, action){
    switch(action.type) {
        case "ADD_DOWNLOAD": {
            return {
                ...state,
                downloads: [...state.downloads, action.payload],
            }
        }
        case "REMOVE_DOWNLOAD": {
            return {
                ...state,
                downloads: state.downloads.filter(downloads => {
                    return downloads.id !== action.payload;
                }),
            }
        }
        case "CHANGE_INPUT": {
            return {
                ...state,
                inputValue: action.payload,
            }
        }
        case "START_DOWNLOAD": {
            return {
                ...state,
                downloads: state.downloads.map(downloads =>
                    (downloads.id === action.payload)
                        ? {...downloads, isDownloading: true}
                        : downloads
                ),
            }
        }
        case "END_DOWNLOAD": {
            return {
                ...state,
                downloads: state.downloads.map(downloads =>
                    (downloads.id === action.payload)
                        ? {...downloads, isDownloading: false, isFinished: true}
                        : downloads
                ),
            }
        }
        default: {
            return state;
        }
    }
}