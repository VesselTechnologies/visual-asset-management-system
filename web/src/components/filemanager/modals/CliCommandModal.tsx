import React, { useState, useEffect } from "react";
import {
    Modal,
    Box,
    SpaceBetween,
    Button,
    Alert,
    TextContent,
} from "@cloudscape-design/components";
import { FileTree } from "../types/FileManagerTypes";
import { CodeBlock } from "../../common/CodeBlock";

interface CliCommandModalProps {
    visible: boolean;
    onDismiss: () => void;
    selectedFiles: FileTree[];
    databaseId: string;
    assetId: string;
}

export const CliCommandModal: React.FC<CliCommandModalProps> = ({
    visible,
    onDismiss,
    selectedFiles,
    databaseId,
    assetId,
}) => {
    const [command, setCommand] = useState<string>("");

    // Generate CLI command for selected item
    useEffect(() => {
        if (visible && selectedFiles.length > 0) {
            const selectedFile = selectedFiles[0]; // Only use the first selected item
            
            // Check if it's the root folder or asset
            if (selectedFile.relativePath === "/" && selectedFile.level === 0) {
                // Entire repository download
                setCommand(`piart repos download /local/path -d ${databaseId} -a ${assetId}`);
            } else if (selectedFile.isFolder || selectedFile.subTree?.length > 0) {
                // Folder download - use folder path
                let folderPath = selectedFile.relativePath;
                if (!folderPath.startsWith('/')) {
                    folderPath = '/' + folderPath;
                }
                setCommand(`piart repos download /local/path -d ${databaseId} -a ${assetId} --file-key "${folderPath}"`);
            } else {
                // Single file download
                let filePath = selectedFile.relativePath;
                if (!filePath.startsWith('/')) {
                    filePath = '/' + filePath;
                }
                setCommand(`piart repos download . -d ${databaseId} -a ${assetId} --file-key "${filePath}"`);
            }
        } else {
            setCommand("");
        }
    }, [visible, selectedFiles, databaseId, assetId]);

    return (
        <Modal
            onDismiss={onDismiss}
            visible={visible}
            header="Terminal Download Command"
            size="large"
            footer={
                <Box float="right">
                    <Button variant="primary" onClick={onDismiss}>
                        Close
                    </Button>
                </Box>
            }
        >
            <SpaceBetween size="l">
                <TextContent>
                    <p>
                        Copy and paste this terminal command to download using the PI-ART CLI. 
                        Make sure you have the CLI installed and are authenticated before running this command.
                    </p>
                </TextContent>

                {!command ? (
                    <Alert type="info">
                        No item selected. Please select a file or folder to generate a download command.
                    </Alert>
                ) : (
                    <CodeBlock>{command}</CodeBlock>
                )}
            </SpaceBetween>
        </Modal>
    );
};