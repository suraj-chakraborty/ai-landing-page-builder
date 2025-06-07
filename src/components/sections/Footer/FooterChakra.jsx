import { Box, Text, HStack, Link } from "@chakra-ui/react";

const FooterChakra = ({text, PP, Tos, Cu}) => {
  return (
    <Box bg="gray.800" color="gray.200" py={4} textAlign="center">
      <Text mb={2}>&copy; {new Date().getFullYear()} {text}</Text>
      <HStack justify="center" spacing={4}>
        <Link href="#" color="blue.400" _hover={{ color: "blue.200" }}>
          {PP}
        </Link>
        <Link href="#" color="blue.400" _hover={{ color: "blue.200" }}>
          {Tos}
        </Link>
        <Link href="#" color="blue.400" _hover={{ color: "blue.200" }}>
          {Cu}
        </Link>
      </HStack>
    </Box>
  );
};

export default FooterChakra;
