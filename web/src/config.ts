/*
 * Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

interface VAMSConfig {
    APP_TITLE: string;
    CUSTOMER_LOGO?: string;
    DEV_API_ENDPOINT: string;
}
const config: VAMSConfig = {
    APP_TITLE: "TIAMAT VAMS",
    DEV_API_ENDPOINT: "https://97o933vkj1.execute-api.us-east-1.amazonaws.com/", //'http://localhost:8002/', // Can point to either remote or local API
    CUSTOMER_LOGO: "/Darpa-logo-2026.png", // served from public/
};

export default config;
