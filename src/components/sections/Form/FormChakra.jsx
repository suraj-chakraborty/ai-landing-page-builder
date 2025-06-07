// SignupFormChakra.tsx
"use client";
import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  Divider,
  IconButton,
  VStack,
  Container,
} from "@chakra-ui/react";
import { FaGithub, FaGoogle, FaHeart } from "react-icons/fa";

const formFields = [
  { id: "firstname", label: "First Name", type: "text", placeholder: "Tyler" },
  { id: "lastname", label: "Last Name", type: "text", placeholder: "Durden" },
  { id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
  { id: "password", label: "Password", type: "password", placeholder: "••••••••" },
  { id: "twitterpassword", label: "Twitter Password", type: "password", placeholder: "••••••••" },
];

const FormChakra = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(Object.fromEntries(formData.entries()));
  };

  return (
    <Container maxW="md" py={8}>
      <Box
        as="form"
        p={6}
        rounded="md"
        boxShadow="md"
        bg="white"
        _dark={{ bg: "gray.800" }}
        onSubmit={handleSubmit}
      >
        <Heading size="md">Welcome to Aceternity</Heading>
        <Text fontSize="sm" color="gray.500" mt={1}>
          Login to aceternity if you can because we don't have a login flow yet.
        </Text>

        <VStack spacing={4} mt={6}>
          {formFields.map(({ id, label, type, placeholder }) => (
            <FormControl key={id}>
              <FormLabel htmlFor={id}>{label}</FormLabel>
              <Input id={id} name={id} type={type} placeholder={placeholder} />
            </FormControl>
          ))}

          <Button type="submit" colorScheme="blue" width="full">
            Sign up →
          </Button>
        </VStack>

        <Divider my={6} />

        <Stack spacing={3}>
          <OAuthButton label="GitHub" icon={<FaGithub />} />
          <OAuthButton label="Google" icon={<FaGoogle />} />
          <OAuthButton label="OnlyFans" icon={<FaHeart />} />
        </Stack>
      </Box>
    </Container>
  );
}
export default FormChakra;

function OAuthButton({ icon, label }) {
  return (
    <Button leftIcon={icon} variant="outline" width="full">
      Continue with {label}
    </Button>
  );
}
