/*
 * Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Heading, useTheme } from "@aws-amplify/ui-react";
import customerLogoSrc from "../resources/img/Darpa-logo-2026.png";
import config from "../config";

export function SignInHeader() {
    const { tokens } = useTheme();

    return (
        <Heading level={3} padding={`${tokens.space.xl} ${tokens.space.xl} 0`}>
            {config.CUSTOMER_LOGO && (
                <img
                    style={{ width: "100%", paddingBottom: "16px" }}
                    src={customerLogoSrc}
                    alt="DARPA Logo"
                />
            )}
        </Heading>
    );
}
