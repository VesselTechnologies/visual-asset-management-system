/*
 * Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

import Box from "@cloudscape-design/components/box";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import Container from "@cloudscape-design/components/container";
import Grid from "@cloudscape-design/components/grid";
import SpaceBetween from "@cloudscape-design/components/space-between";

import "../styles/landing-page.scss";

const LandingPage = () => {
    return (
        <Box margin={{ bottom: "l" }}>
            <div className="custom-home__header">
                <Box padding={{ vertical: "xxl", horizontal: "s" }}>
                    <Grid
                        gridDefinition={[
                            { offset: { l: 2, xxs: 1 }, colspan: { l: 8, xxs: 10 } },
                            {
                                colspan: { xl: 6, l: 5, s: 6, xxs: 10 },
                                offset: { l: 2, xxs: 1 },
                            },
                            {
                                colspan: { xl: 2, l: 3, s: 4, xxs: 10 },
                                offset: { s: 0, xxs: 1 },
                            },
                        ]}
                    >
                        <Box fontWeight="light" padding={{ top: "xs" }}>
                            <span className="custom-home__category">Visual Asset Management</span>
                        </Box>
                        <div className="custom-home__header-title">
                            <Box
                                variant="h1"
                                fontWeight="bold"
                                padding="n"
                                fontSize="display-l"
                                color="inherit"
                            >
                                TIAMAT VAMS
                            </Box>
                            <Box
                                fontWeight="light"
                                padding={{ bottom: "s" }}
                                fontSize="display-l"
                                color="inherit"
                            >
                                Robots, Worlds, Sim-Ready Assets,
                                <br />
                                and Policies for Physical Intelligence
                            </Box>
                            <Box variant="p" fontWeight="light">
                                <span className="custom-home__header-sub-title">
                                    An AWS S3 powered solution for large file version control
                                    <br />
                                    Store, view, and share files up to 5 Terabytes in size
                                    <br />
                                    Access high-fidelity open-source models in one place
                                </span>
                            </Box>
                        </div>
                        {/* <Container>
                            <SpaceBetween size="xl">
                                <Box variant="h2" padding="n">
                                    Upload {Synonyms.Assets}
                                </Box>
                                <Box variant="p">
                                    Start uploading and managing your digital assets to get started.
                                </Box>
                                <Button href="#/upload" variant="primary">
                                    Upload {Synonyms.Assets}
                                </Button>
                            </SpaceBetween>
                        </Container> */}
                    </Grid>
                </Box>
            </div>

            <Box margin={{ top: "s" }} padding={{ top: "xxl", horizontal: "s" }}>
                <Grid
                    gridDefinition={[
                        {
                            colspan: { xl: 8, l: 8, s: 10, xxs: 10 },
                            offset: { l: 2, xxs: 1 },
                        },
                    ]}
                >
                    <div className="custom-home-main-content-area">
                        <SpaceBetween size="l">
                            <div>
                                <Box fontSize="heading-xl" fontWeight="normal" variant="h2">
                                    How it works
                                </Box>
                                <Container>
                                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
                                        <iframe
                                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                                            src="https://www.youtube.com/embed/kgaO45SyaO4?si=RYnke9Lxqr4-fJZM"
                                            title="YouTube video player"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            allowFullScreen
                                        />
                                    </div>
                                </Container>
                            </div>

                            {/* <div>
                                <Box fontSize="heading-xl" fontWeight="normal" variant="h2">
                                    Benefits and features
                                </Box>
                                <Container>
                                    <ColumnLayout columns={2} variant="text-grid">
                                        <div>
                                            <Box variant="h2" padding={{ top: "n" }}>
                                                Secure & Serverless
                                            </Box>
                                            <Box variant="p">
                                                A secure and serverless 3D Digital Assets Management
                                                and Distribution Service
                                            </Box>
                                        </div>
                                        <div>
                                            <Box variant="h2" padding={{ top: "n" }}>
                                                Simplified Solution
                                            </Box>
                                            <Box variant="p">
                                                Offers a simplified solution for organizations to
                                                ingest, store, revision control, convert, analyze,
                                                and distribute digital assets (3D models, images)
                                                globally
                                            </Box>
                                        </div>
                                        <div>
                                            <Box variant="h2" padding={{ top: "n" }}>
                                                Customize Asset Pipelines
                                            </Box>
                                            <Box variant="p">
                                                Allows customers to introduce and customize asset
                                                pipelines to suite their needs
                                            </Box>
                                        </div>
                                        <div>
                                            <Box variant="h2" padding={{ top: "n" }}>
                                                Single Source
                                            </Box>
                                            <Box variant="p">
                                                Enables cloud distribution of their digital assets,
                                                such as animations, images, user interfaces, even
                                                packaged XR tracking packages, all from a singular
                                                content delivery network stored on the customers
                                                account
                                            </Box>
                                        </div>
                                        <div>
                                            <Box variant="h2" padding={{ top: "n" }}>
                                                Industries
                                            </Box>
                                            <Box variant="p">
                                                Addresses the key challenges faced by entertainment,
                                                gaming, industrial augmented reality and digital
                                                twin customers
                                            </Box>
                                        </div>
                                        <div>
                                            <Box variant="h2" padding={{ top: "n" }}>
                                                Advanced Plugins
                                            </Box>
                                            <Box variant="p">
                                                Offers advanced plugins for viewing, transforming
                                                and analyzing digital assets
                                            </Box>
                                        </div>
                                    </ColumnLayout>
                                </Container>
                            </div> */}
                        </SpaceBetween>
                    </div>

                    {/* <div className="custom-home__sidebar">
                        <SpaceBetween size="xxl">
                            <Container
                                header={
                                    <Header variant="h2">
                                        Getting started{" "}
                                        <span role="img" aria-label="Icon external Link">
                                            <Icon name="external" />
                                        </span>
                                    </Header>
                                }
                            >
                                <ul
                                    aria-label="Getting started documentation"
                                    className="custom-list-separator"
                                >
                                    <li>
                                        <ExternalLinkItem
                                            href="https://github.com/awslabs/visual-asset-management-system"
                                            text="VAMS on Github"
                                        />
                                    </li>
                                </ul>
                            </Container>

                            <Container
                                header={
                                    <Header variant="h2">
                                        More resources{" "}
                                        <span role="img" aria-label="Icon external Link">
                                            <Icon name="external" />
                                        </span>
                                    </Header>
                                }
                            >
                                Coming Soon
                            </Container>
                        </SpaceBetween>
                    </div> */}
                </Grid>
            </Box>
        </Box>
    );
};

export default LandingPage;
