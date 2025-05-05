const initialState = {
    messages: [], // Lưu danh sách tin nhắn
    loading: false, // Trạng thái tải
    error: null, // Lưu lỗi nếu có
};

export default function chatReducer(state = initialState, action) {
    switch (action.type) {
        // Xử lý sendMessage
        case 'SEND_MESSAGE_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'SEND_MESSAGE_SUCCESS':
            return {
                ...state,
                loading: false,
                messages: [...state.messages, action.payload], // Thêm tin nhắn mới
                error: null,
            };
        case 'SEND_MESSAGE_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Xử lý getChatHistory
        case 'GET_CHAT_HISTORY_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'GET_CHAT_HISTORY_SUCCESS':
            return {
                ...state,
                loading: false,
                messages: action.payload, // Cập nhật danh sách tin nhắn
                error: null,
            };
        case 'GET_CHAT_HISTORY_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };


        // Reset error and success for other actions (if needed)
        case "RESET_ERROR":
            return { ...state, error: null };

        case 'RESET_MESSAGES':
            return {
                ...state,
                messages: [],
                loading: false,
                error: null,
            };


        default:
            return state;
    }
}