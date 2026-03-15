/*
 * Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";

import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import Container from "@cloudscape-design/components/container";
import Grid from "@cloudscape-design/components/grid";
import SpaceBetween from "@cloudscape-design/components/space-between";

import "../styles/landing-page.scss";
import { CodeBlock } from "../components/common/CodeBlock";

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
                                    Getting Started
                                </Box>
                                <Container>
                                    <a
                                        href="https://www.youtube.com/watch?v=kgaO45SyaO4"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ display: "block", position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", cursor: "pointer" }}
                                    >
                                        <img
                                            src="https://img.youtube.com/vi/kgaO45SyaO4/maxresdefault.jpg"
                                            alt="Watch on YouTube"
                                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                        {/* Play button overlay */}
                                        <div style={{
                                            position: "absolute", top: "50%", left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            width: 72, height: 72, borderRadius: "50%",
                                            backgroundColor: "rgba(0,0,0,0.7)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            <div style={{
                                                width: 0, height: 0,
                                                borderTop: "14px solid transparent",
                                                borderBottom: "14px solid transparent",
                                                borderLeft: "24px solid white",
                                                marginLeft: 5,
                                            }} />
                                        </div>
                                    </a>
                                </Container>
                            </div>

                            <div>
                                <Box fontSize="heading-xl" fontWeight="normal" variant="h2">
                                    TIAMAT VAMS Library
                                </Box>
                                <Container>
                                    <SpaceBetween size="m">
                                        <Box variant="p">
                                            Welcome to <strong>TIAMAT VAMS</strong>. This platform provides secure access to robotics simulation assets, environments, and models.
                                        </Box>

                                        <Box variant="p">
                                            TIAMAT VAMS maintains a library of three fundamental types of digital assets:
                                        </Box>

                                        <ul>
                                            <li><strong>Environments</strong> – digital representations of the physical world (terrain, buildings, obstacles, weather, etc.)</li>
                                            <li><strong>Robots</strong> – models of robotic platforms, including sensors, actuators, and physical constraints</li>
                                            <li><strong>Models</strong> – intelligent models that guide the robot to complete a task within a given environment</li>
                                        </ul>

                                        <Box variant="p">
                                            Through the TIAMAT VAMS interface you can:
                                        </Box>

                                        <ul>
                                            <li>Browse, share, and preview available assets</li>
                                            <li>Share and version control models</li>
                                            <li>Upload new assets</li>
                                            <li>Download simulation-ready environments, robots, and models</li>
                                        </ul>

                                        <Box variant="p">
                                            These assets are used to create standardized evaluation scenarios for robotics autonomy research.
                                        </Box>

                                        <Box variant="p">
                                            Assets can be accessed through the web interface or directly from the terminal using the <strong>PI-ART CLI</strong> (Physical Intelligence Asset Reuse Taskforce).
                                        </Box>
                                    </SpaceBetween>
                                </Container>
                            </div>

                            <div>
                                <Box fontSize="heading-xl" fontWeight="normal" variant="h2">
                                    Using the PI-ART CLI
                                </Box>
                                <Container>
                                    <SpaceBetween size="m">
                                        <div>
                                            <Box variant="h3" fontWeight="bold">
                                                1. Install the CLI
                                            </Box>
                                            <Box variant="p">
                                                First, install <strong>uv</strong> by following the instructions at: <a href="https://docs.astral.sh/uv/getting-started/installation/" target="_blank" rel="noopener noreferrer">https://docs.astral.sh/uv/getting-started/installation/</a>
                                            </Box>
                                            <Box variant="p">
                                                Then install the PI-ART CLI:
                                            </Box>
                                            <Box variant="p">
                                                <strong>UV installation (recommended):</strong>
                                            </Box>
                                            <CodeBlock>
                                                uv tool install https://tiamat.vessel-technologies.com/piart-0.1.0-py3-none-any.whl
                                            </CodeBlock>
                                        </div>

                                        <div>
                                            <Box variant="h3" fontWeight="bold">
                                                2. Authenticate
                                            </Box>
                                            <Box variant="p">
                                                Login to your account:
                                            </Box>
                                            <CodeBlock>
                                                {`piart auth login -u {your_username}`}
                                            </CodeBlock>
                                        </div>
                                    </SpaceBetween>
                                </Container>
                            </div>

                            <div>
                                <Box fontSize="heading-xl" fontWeight="normal" variant="h2">
                                    Basic Operations
                                </Box>
                                <Container>
                                    <SpaceBetween size="m">
                                        <div>
                                            <Box variant="h3" fontWeight="bold">
                                                Browse Available Repositories
                                            </Box>
                                            <Box variant="p">
                                                List all repositories you have access to:
                                            </Box>
                                            <CodeBlock>
                                                piart repos list
                                            </CodeBlock>
                                        </div>

                                        <div>
                                            <Box variant="h3" fontWeight="bold">
                                                List Files in a Repository
                                            </Box>
                                            <Box variant="p">
                                                First, identify the repository ID from the list above, then view its contents:
                                            </Box>
                                            <CodeBlock>
                                                {`piart file list -d {database} -a {repository_id}`}
                                            </CodeBlock>
                                            <Box variant="p">
                                                <em>Example output: You'll see a directory structure with files like `/Locomotion/2-StoryStaircase/Loft.usd`</em>
                                            </Box>
                                        </div>

                                        <div>
                                            <Box variant="h3" fontWeight="bold">
                                                Download Assets
                                            </Box>
                                            <SpaceBetween size="s">
                                                <div>
                                                    <Box variant="p">
                                                        <strong>Download a specific file:</strong>
                                                    </Box>
                                                    <CodeBlock>
                                                        {`piart repos download . -d {database} -a {repository_id} --file-key "{file_path}"`}
                                                    </CodeBlock>
                                                    <Box variant="p">
                                                        <em>Example:</em>
                                                    </Box>
                                                    <CodeBlock>
                                                        piart repos download . -d PUBLIC -a xda7e0ee0-3d87-4288-94d7-0b0017bd5f0c --file-key "/Locomotion/2-StoryStaircase/Loft.usd"
                                                    </CodeBlock>
                                                </div>
                                                <div>
                                                    <Box variant="p">
                                                        <strong>Download an entire repository:</strong>
                                                    </Box>
                                                    <CodeBlock>
                                                        {`piart repos download /local/path -d {database} -a {repository_id}`}
                                                    </CodeBlock>
                                                </div>
                                            </SpaceBetween>
                                        </div>

                                        <div>
                                            <Box variant="h3" fontWeight="bold">
                                                Upload Assets
                                            </Box>
                                            <Box variant="p">
                                                Upload a file to a repository:
                                            </Box>
                                            <CodeBlock>
                                                {`piart file upload -d {database} -a {repository_id} /path/to/your/file.usd`}
                                            </CodeBlock>
                                        </div>
                                    </SpaceBetween>
                                </Container>
                            </div>

                            <div>
                                <Box fontSize="heading-xl" fontWeight="normal" variant="h2">
                                    Getting Help
                                </Box>
                                <Container>
                                    <SpaceBetween size="m">
                                        <div>
                                            <Box variant="p">
                                                For detailed information about all available commands and options:
                                            </Box>
                                            <CodeBlock>
                                                piart --help
                                            </CodeBlock>
                                        </div>

                                        <div>
                                            <Box variant="p">
                                                You can also get help for specific commands:
                                            </Box>
                                            <SpaceBetween size="xs">
                                                <CodeBlock>
                                                    piart repos --help
                                                </CodeBlock>
                                                <CodeBlock>
                                                    piart file --help
                                                </CodeBlock>
                                                <CodeBlock>
                                                    piart auth --help
                                                </CodeBlock>
                                            </SpaceBetween>
                                        </div>
                                    </SpaceBetween>
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
