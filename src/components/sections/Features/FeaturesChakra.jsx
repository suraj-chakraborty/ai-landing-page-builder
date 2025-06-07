import { Box, VStack, Heading, Text, Icon } from "@chakra-ui/react";
import { FaCog, FaGlobe, FaClock } from "react-icons/fa";
import { SettingOutlined, GlobalOutlined, ClockCircleOutlined } from "@ant-design/icons";

const FeaturesChakra = ({ features = [] }) => {
  if (!Array.isArray(features)) {
    return <div>Error: Invalid features data</div>;
  }

  return (
    <VStack spacing={6} align="stretch" p={4}>
      {features.map((feature, index) => (
        <Box
          key={index}
          p={4}
          borderWidth={1}
          borderRadius="md"
          boxShadow="md"
          bg="gray.50"
        >
          {/* Pass the icon component itself, not the JSX element */}
          <Icon as={feature.icon || FaCog} boxSize={6} mb={2} color="blue.500" />
          <Heading size="md" mb={1}>
            {feature.title || "Default Title"}
          </Heading>
          <Text color="gray.600">
            {feature.description || "Default description"}
          </Text>
        </Box>
      ))}
    </VStack>
  );
};

export default FeaturesChakra;
