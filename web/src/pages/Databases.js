/*
 * Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { fetchAllDatabases, webRoutes } from "../services/APIService";
import CreateDatabase from "../components/createupdate/CreateDatabase";
import { DatabaseListDefinition } from "../components/list/list-definitions/DatabaseListDefinition";
import ListPage from "./ListPage";
import Synonyms from "../synonyms";

export default function Databases() {
    const [canCreate, setCanCreate] = useState(false);

    useEffect(() => {
        webRoutes({ routes: [{ method: "POST", route__path: "database" }] })
            .then((value) => {
                if (value && value.allowedRoutes && value.allowedRoutes.length > 0) {
                    setCanCreate(true);
                }
            })
            .catch((error) => console.log(error));
    }, []);

    return (
        <ListPage
            singularName={Synonyms.Database}
            singularNameTitleCase={Synonyms.Database}
            pluralName={Synonyms.databases}
            pluralNameTitleCase={Synonyms.Databases}
            listDefinition={DatabaseListDefinition}
            CreateNewElement={CreateDatabase || undefined}
            fetchAllElements={fetchAllDatabases}
            fetchElements={fetchAllDatabases}
            editEnabled={true}
            disableCreate={!canCreate}
        />
    );
}
