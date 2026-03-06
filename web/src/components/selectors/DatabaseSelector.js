/*
 * Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { fetchAllDatabases } from "../../services/APIService";
import { Select } from "@cloudscape-design/components";

const DatabaseSelector = (props) => {
    const { showGlobal = false, ...restProps } = props;
    const [reload, setReload] = useState(true);
    const [allItems, setAllItems] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const items = await fetchAllDatabases();
            if (items !== false && Array.isArray(items)) {
                setReload(false);
                setAllItems(items);
            }
        };
        if (reload) {
            getData();
        }
    }, [reload]);

    // Filter out reserved databases that should not be user-selectable
    const visibleItems = React.useMemo(
        () => allItems.filter((item) => item.databaseId !== "PUBLIC"),
        [allItems]
    );

    // Create a map of databaseId to full database object for easy lookup
    const databaseMap = React.useMemo(() => {
        const map = {};
        visibleItems.forEach((item) => {
            map[item.databaseId] = item;
        });
        return map;
    }, [visibleItems]);

    // Wrap the onChange to include the full database object (backwards compatible)
    const handleChange = (event) => {
        if (props.onChange) {
            // For backwards compatibility, check if the consumer expects the enhanced event
            // If selectedDatabase is accessed, provide it; otherwise, pass through as-is
            const selectedValue = event.detail.selectedOption.value;

            // Handle GLOBAL option (doesn't have a database object)
            const selectedDb = selectedValue === "GLOBAL" ? null : databaseMap[selectedValue];

            // Create enhanced event with selectedDatabase (can be null for GLOBAL)
            const enhancedEvent = {
                ...event,
                detail: {
                    ...event.detail,
                    selectedDatabase: selectedDb, // Add full database object (or null for GLOBAL)
                },
            };

            props.onChange(enhancedEvent);
        }
    };

    return (
        <Select
            {...restProps}
            onChange={handleChange}
            options={[
                ...(showGlobal ? [{ label: "GLOBAL", value: "GLOBAL" }] : []),
                ...visibleItems.map((item) => {
                    return {
                        label: item.databaseId,
                        value: item.databaseId,
                    };
                }),
            ]}
            filteringType="auto"
            selectedAriaLabel="Selected"
            data-testid="database-select"
        />
    );
};

export default DatabaseSelector;
