import React from "react";
import {
    Cards,
    Box,
    SpaceBetween,
    Button,
    Header,
    Pagination,
    Link,
} from "@cloudscape-design/components";
import { SearchResult } from "../types";
import PreviewThumbnailCell from "../SearchPreviewThumbnail/PreviewThumbnailCell";
import Synonyms from "../../../synonyms";

interface RepositoryCardViewProps {
    items: SearchResult[];
    loading: boolean;
    currentPageIndex: number;
    pagesCount: number;
    onPageChange: (pageIndex: number) => void;
    onCreateAsset?: () => void;
    totalItems?: number;
}

const RepositoryCardView: React.FC<RepositoryCardViewProps> = ({
    items,
    loading,
    currentPageIndex,
    pagesCount,
    onPageChange,
    onCreateAsset,
    totalItems,
}) => {
    const renderRepositoryCard = (item: SearchResult) => {
        const source = item._source;
        const repositoryUrl = `#/databases/${source.str_databaseid}/assets/${source.str_assetid}`;

        return (
            <Link href={repositoryUrl} external={false}>
                <Box>
                    {/* Preview Image Area - 600x400 aspect ratio */}
                    <Box>
                        <Box
                            padding={{ vertical: "s", horizontal: "s" }}
                        >
                            <div style={{ 
                                width: '100%', 
                                height: '200px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                backgroundColor: '#f8f9fa', 
                                borderRadius: '4px',
                                overflow: 'hidden',
                                border: '1px solid #e1e4e8'
                            }}>
                                {source.str_assetid && source.str_databaseid ? (
                                    <div style={{ 
                                        width: '100%', 
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <div style={{
                                            transform: 'scale(4)',
                                            transformOrigin: 'center',
                                            width: '100px',
                                            height: '100px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <PreviewThumbnailCell
                                                assetId={source.str_assetid}
                                                databaseId={source.str_databaseid}
                                                onOpenFullPreview={() => {}}
                                                assetName={source.str_assetname || ""}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{
                                        color: '#6c757d', 
                                        fontSize: '14px',
                                        textAlign: 'center'
                                    }}>
                                        No preview available
                                    </div>
                                )}
                            </div>
                        </Box>
                    </Box>
                    
                    {/* Divider Line */}
                    <hr style={{ margin: '0', border: 'none', borderTop: '1px solid #e5e5e5' }} />
                    
                    {/* Text Content Area */}
                    <Box padding={{ vertical: "s", horizontal: "m" }}>
                        <SpaceBetween direction="vertical" size="xs">
                            {/* Repository Name */}
                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#000', textDecoration: 'none' }}>
                                {source.str_assetname || "Unnamed Repository"}
                            </div>

                            {/* Repository Description */}
                            {source.str_description && (
                                <div style={{ fontSize: '14px', color: '#666', textDecoration: 'none', lineHeight: '1.4' }}>
                                    {source.str_description.length > 100
                                        ? `${source.str_description.substring(0, 100)}...`
                                        : source.str_description}
                                </div>
                            )}
                        </SpaceBetween>
                    </Box>
                </Box>
            </Link>
        );
    };

    return (
        <Cards
            cardDefinition={{
                header: () => "", // No header for simple card layout
                sections: [
                    {
                        content: renderRepositoryCard,
                    },
                ],
            }}
            cardsPerRow={[
                { cards: 1 }, // 1 card on small screens
                { minWidth: 600, cards: 2 }, // 2 cards on medium screens
                { minWidth: 1000, cards: 3 }, // 3 cards on larger screens
            ]}
            items={items}
            loading={loading}
            loadingText="Loading repositories..."
            // Removed selection functionality
            trackBy="_id"
            empty={
                <Box textAlign="center" color="inherit">
                    <Box variant="strong" textAlign="center" color="inherit">
                        No repositories found
                    </Box>
                    <Box variant="p" padding={{ bottom: "s" }} color="inherit">
                        We can't find any repositories that match your search.
                    </Box>
                    <Button onClick={() => window.location.reload()}>Clear filter</Button>
                </Box>
            }
        />
    );
};

export default RepositoryCardView;