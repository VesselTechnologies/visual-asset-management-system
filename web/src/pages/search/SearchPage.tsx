/*
 * Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useParams } from "react-router";
import { Box } from "@cloudscape-design/components";
import { ModernSearchContainer } from "../../components/search";
import Synonyms from "../../synonyms";

interface NewSearchPageProps { }

const NewSearchPage: React.FC<NewSearchPageProps> = () => {
    const { databaseId } = useParams();

    return (
        <Box padding={{ top: databaseId ? "s" : "m", horizontal: "l" }}>


            <ModernSearchContainer
                mode="full"
                databaseId={databaseId}
                allowedViews={["table", "card", "map"]}
                showPreferences={true}
                showBulkActions={true}
            />
        </Box>
    );
};

export default NewSearchPage;
