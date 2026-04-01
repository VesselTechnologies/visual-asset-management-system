/*
 * Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
    Box,
    Button,
    Form,
    FormField,
    SpaceBetween,
    Input,
    Container,
    Header,
    Alert,
    Multiselect,
} from "@cloudscape-design/components";
import { useState, useEffect } from "react";
import { createCognitoUser, fetchRoles } from "../../services/APIService";
import { API } from "aws-amplify";

function validateEmail(email: string): string | null {
    if (typeof email !== "string" || email.trim().length === 0) {
        return "Required. Please enter an email address.";
    }

    // RFC 5322 simplified email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Please enter a valid email address.";
    }

    return null;
}

function validateUserId(userId: string): string | null {
    if (typeof userId !== "string" || userId.trim().length === 0) {
        return "Required. Please enter a User ID.";
    }

    // Valid user regex: at least 3 characters alphanumeric with support for special characters: . + - @
    const userIdRegex = /^[\w\-\.\+\@]{3,256}$/;
    if (!userIdRegex.test(userId)) {
        return "User ID should be at least 3 characters alphanumeric with support for special characters: . + - @";
    }

    return null;
}

function validatePhoneNumber(phoneNumber: string): string | null {
    if (!phoneNumber || phoneNumber.trim().length === 0) {
        return null; // Phone number is optional
    }

    // E.164 format validation: +[country code][number]
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
        return "Phone number must be in E.164 format (e.g., +12345678900)";
    }

    return null;
}

export default function CognitoUsers() {
    const [inProgress, setInProgress] = useState(false);
    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [userIdError, setUserIdError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);

    const [roles, setRoles] = useState<any[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<any[]>([]);

    const [formState, setFormState] = useState({
        userId: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        fetchRoles().then((res) => {
            if (res && Array.isArray(res)) {
                const fetchedRoles = res.map((x: any) => ({
                    label: x.roleName,
                    value: x.roleName,
                }));
                setRoles(fetchedRoles);
            }
        });
    }, []);

    const isFormValid = () => {
        return (
            validateEmail(formState.email) === null &&
            validatePhoneNumber(formState.phone) === null &&
            validateUserId(formState.userId) === null
        );
    };

    const handleSubmit = async () => {
        setInProgress(true);
        setFormError("");
        setSuccessMessage("");

        try {
            const params: any = {
                userId: formState.userId,
                email: formState.email,
            };
            if (formState.phone) {
                params.phone = formState.phone;
            }
            const response = await createCognitoUser(params);

            if (response && response[0]) {
                if (selectedRoles.length > 0) {
                    try {
                        const userRoleBody = {
                            userId: formState.userId,
                            roleName: selectedRoles.map((r) => r.value),
                        };
                        await API.post("api", "user-roles", { body: userRoleBody });
                        setSuccessMessage(`User ${formState.userId} created and roles assigned successfully.`);
                    } catch (roleError: any) {
                        console.log("Error assigning roles:", roleError);
                        setSuccessMessage(`User ${formState.userId} created, but failed to assign roles.`);
                    }
                } else {
                    setSuccessMessage(`User ${formState.userId} created successfully.`);
                }

                setFormState({
                    userId: "",
                    email: "",
                    phone: "",
                });
                setSelectedRoles([]);
                setUserIdError(null);
                setEmailError(null);
                setPhoneError(null);
            } else {
                const errorMessage = response ? response[1] : "Unknown error occurred";

                // Check for specific error types
                if (errorMessage.toLowerCase().includes("already exists")) {
                    setUserIdError("A user with this User ID already exists");
                } else if (errorMessage.toLowerCase().includes("invalid email")) {
                    setEmailError("Invalid email address");
                } else if (errorMessage.toLowerCase().includes("invalid phone")) {
                    setPhoneError("Invalid phone number");
                } else {
                    setFormError(errorMessage);
                }
            }
        } catch (error: any) {
            console.log("Error:", error);
            // Extract the actual error message from the API response
            const errorMessage =
                error?.response?.data?.message || error?.message || "An error occurred";
            setFormError(errorMessage);
        } finally {
            setInProgress(false);
        }
    };

    return (
        <Box padding={{ top: "m", horizontal: "l" }}>
            <SpaceBetween direction="vertical" size="m">
                <Header variant="h1">Add New User</Header>
                <Container>
                    <Form
                        actions={
                            <SpaceBetween direction="horizontal" size="xs">
                                <Button
                                    variant="link"
                                    onClick={() => {
                                        setFormState({
                                            userId: "",
                                            email: "",
                                            phone: "",
                                        });
                                        setSelectedRoles([]);
                                        setUserIdError(null);
                                        setEmailError(null);
                                        setPhoneError(null);
                                        setFormError("");
                                        setSuccessMessage("");
                                    }}
                                >
                                    Clear
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleSubmit}
                                    disabled={inProgress || !isFormValid()}
                                    data-testid="create-cognito-user-button"
                                >
                                    Create User
                                </Button>
                            </SpaceBetween>
                        }
                        errorText={formError}
                    >
                        <SpaceBetween direction="vertical" size="l">
                            {successMessage && (
                                <Alert
                                    type="success"
                                    dismissible
                                    onDismiss={() => setSuccessMessage("")}
                                >
                                    {successMessage}
                                </Alert>
                            )}
                            <FormField
                                label="Username"
                                constraintText="Required. Enter username (3-256 characters, alphanumeric with . + - @)"
                                errorText={userIdError}
                            >
                                <Input
                                    value={formState.userId}
                                    onChange={({ detail }) => {
                                        setFormState({ ...formState, userId: detail.value });
                                        setUserIdError(validateUserId(detail.value));
                                        setSuccessMessage("");
                                    }}
                                    placeholder="Enter User ID"
                                    data-testid="userId"
                                />
                            </FormField>
                            <FormField
                                label="Email"
                                constraintText="Required. Enter email address"
                                errorText={emailError}
                            >
                                <Input
                                    value={formState.email}
                                    onChange={({ detail }) => {
                                        setFormState({ ...formState, email: detail.value });
                                        setEmailError(validateEmail(detail.value));
                                        setSuccessMessage("");
                                    }}
                                    placeholder="user@example.com"
                                    data-testid="email"
                                    type="email"
                                />
                            </FormField>
                            <FormField
                                label="Phone Number"
                                constraintText="Optional. Enter phone number in E.164 format (e.g., +12345678900)"
                                errorText={phoneError}
                            >
                                <Input
                                    value={formState.phone}
                                    onChange={({ detail }) => {
                                        setFormState({ ...formState, phone: detail.value });
                                        setPhoneError(validatePhoneNumber(detail.value));
                                        setSuccessMessage("");
                                    }}
                                    placeholder="+12345678900"
                                    data-testid="phoneNumber"
                                />
                            </FormField>
                            <FormField
                                label="Roles"
                                constraintText="Optional. Select roles to assign to this user."
                            >
                                <Multiselect
                                    selectedOptions={selectedRoles}
                                    onChange={({ detail }) => setSelectedRoles(detail.selectedOptions as any[])}
                                    options={roles}
                                    placeholder="Choose roles"
                                    empty="No roles found"
                                />
                            </FormField>
                            <Box color="text-status-info" fontSize="body-s">
                                <strong>Note:</strong> A temporary password will be generated and sent
                                to the user's email address. The user will be required to change their
                                password on first login.
                            </Box>
                        </SpaceBetween>
                    </Form>
                </Container>
            </SpaceBetween>
        </Box>
    );
}
