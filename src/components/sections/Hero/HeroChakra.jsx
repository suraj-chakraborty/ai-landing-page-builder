import { Box, Heading, Text, Button } from "@chakra-ui/react";

const HeroChakra = ({ title, subtitle, buttonText, onEdit }) => {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading mb={4}>{title || "Default Title"}</Heading>
      <Text fontSize="lg" mb={6}>{subtitle || "Default Subtitle"}</Text>
      <Button colorScheme="blue" onClick={onEdit}>
        {buttonText || "Default Button Text"}
      </Button>
    </Box>
  );
};

export default HeroChakra;
