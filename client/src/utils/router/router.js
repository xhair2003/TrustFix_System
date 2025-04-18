export const ROUTERS = {
    //MASTER_LAYOUT: 'master-layout',

    CUSTOMER: {
        // customer
        HOME: '/',
        LOGIN: '/login',
        REGISTER: '/register',
        PROFILE: '/profile',
        CHANGE_PASSWORD: '/change-password',
        FORGOT_PASSWORD: '/forgot-password',
        RESET_PASSWORD: '/reset-password',
        FIND_REPAIRMAN: '/find-repairman',
        BOOKING: '/booking',
        VIEW_REPAIR_INFO: '/view-repair-info',
        RATE_REPAIRMAN: '/rate-repair-man',
        VIEW_REPAIR_BOOKING_HISTORY: '/view-repair-booking-history',
        COMPLAIN_REPAIRMAN: '/complain',
        UPGRADE_REPAIRMAN: '/upgrade-repair-man',
        DEPOSIT_INTO_ACCOUNT: '/wallet/deposit-into-account',
        VIEW_DEPOSIT_HISTORY: '/deposit-history',
        VIEW_HISTORY_PAYMENT: '/history-payment',
        MAKE_PAYMENT: '/make-payment/:requestId/:repairmanId',
        WALLET: '/wallet',
        ORDER_DETAIL: '/order-detail/:requestId',
        CHAT_BOT: '/chat-bot',

    },

    REPAIRMAN: {
        // Repairman
        DEAL_PRICE_WITH_CUSTOMER: '/deal-price-with-customer',
        VIEW_RECEIVED_ORDER_HISTORY: '/view-received-order-history',
        VIEW_SERVICE_PRICES: '/repairman/service-prices',
        BUY_RECOMMEND_BOOKING_PACKAGE: '/buy-recommend-booking-package',
        PAY_MONTHLY_ACCOUNT_MAINTENANCE_FEES: '/pay-monthly-account-maintenance-fees',
        VIEW_REQUESTS: '/repairman/view-requests',
        DETAIL_REQUEST: '/repairman/detail-request/:requestId',
        REPAIRMAN_ORDER_DETAIL: '/repairman/order-detail/:requestId',
        REPAIMAN_DASHBOARD: '/repairman/dashboard'
    },

    ADMIN: {
        // Admin
        ADMIN: '/admin',
        DASHBOARD: 'admin/dashboard',
        MANAGE_USER_ACCOUNT: 'admin/manage-user-account',
        VIEW_REPAIR_BOOKING: 'admin/view-repair-booking',
        MANAGE_UPGRADE_REPAIRMAN: 'admin/manage-upgrade-repairman',
        ADMIN_VIEW_DEPOSIT_HISTORY: 'admin/view-deposit-history',
        ADMIN_VIEW_HISTORY_PAYMENT: 'admin/view-history-payment',
        MANAGE_COMPLAINTS: 'admin/manage-complaints',
        MANAGE_SERVICE: 'admin/manage-service-prices',
        MANAGE_CATEGORIES: 'admin/manage-categories',
        MANAGE_SUBCATEGORIES: 'admin/manage-subcategories',
        MANAGE_PRACTICE_SERTIFICATES: 'admin/manage-practice-certificates',
        MANAGE_NEW_FORUM_POST: 'admin/manage-new-forum-post',
        MANAGE_GUIDES: "admin/manage-guides",
    },

    FORUM: {
        FORUM: '/forum',
        POST_DETAIL: "/forum/post/:id"
    },

    GUIDES: {
        GUIDES: '/guides',
        GUIDE_DETAIL: "/guides/guide/:id"
    }
}