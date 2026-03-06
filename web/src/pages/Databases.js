/*
 * Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { fetchAllDatabases } from "../services/APIService";
import { DatabaseListDefinition } from "../components/list/list-definitions/DatabaseListDefinition";
import ListPage from "./ListPage";
import Synonyms from "../synonyms";

export default function Databases() {
    return (
        <ListPage
            singularName={Synonyms.Database}
            singularNameTitleCase={Synonyms.Database}
            pluralName={Synonyms.databases}
            pluralNameTitleCase={Synonyms.Databases}
            listDefinition={DatabaseListDefinition}
            fetchAllElements={fetchAllDatabases}
            fetchElements={fetchAllDatabases}
            editEnabled={false}
            hideDeleteButton={true}
            disableCreate={true}
        />
    );
}
