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
        FIND_REPAIR: '/find-repair',
        BOOKING: '/booking',
        VIEW_REPAIR_INFO: '/view-repair-info',
        RATE_REPAIRMAN: '/rate-repair-man',
        VIEW_REPAIR_BOOKING_HISTORY: '/view-repair-booking-history',
        COMPLAIN_REPAIRMAN: '/complain-repair-man',
        UPGRADE_REPAIRMAN: '/upgrade-repair-man',
        DEPOSIT_INTO_ACCOUNT: '/deposit-into-account',
        VIEW_DEPOSIT_HISTORY: '/view-deposit-history',
        VIEW_HISTORY_PAYMENT: '/view-history-payment',
        PAY_FOR_REPAIR: '/pay-for-repair',
    },

    REPAIRMAN: {
        // Repairman
        DEAL_PRICE_WITH_CUSTOMER: '/deal-price-with-customer',
        VIEW_RECEIVED_ORDER_HISTORY: '/view-received-order-history',
        VIEW_SERVICE_PRICES: '/view-service-prices',
        BUY_RECOMMEND_BOOKING_PACKAGE: '/buy-recommend-booking-package',
        PAY_MONTHLY_ACCOUNT_MAINTENANCE_FEES: '/pay-monthly-account-maintenance-fees',
    },

    ADMIN: {
        // Admin
        DASHBOARD: '/admin/dashboard',
        MANAGE_USER_ACCOUNT: '/admin/manage-user-account',
        VIEW_REPAIR_BOOKING: '/admin/view-repair-booking',
        MANAGE_UPGRADE_REPAIRMAN: '/admin/manage-upgrade-repairman',
        ADMIN_VIEW_DEPOSIT_HISTORY: '/admin/view-deposit-history',
        ADMIN_VIEW_HISTORY_PAYMENT: '/admin/view-history-payment',
        MANAGE_COMPLAINTS: '/admin/manage-complaints',
        MANAGE_SERVICE: '/admin/manage-service-prices',
    }
}
