import React from "react";
import { Layout, Typography } from "antd";

const { Footer } = Layout;
const { Link, Text } = Typography;

const FooterAntd = ({text, PP, Tos, Cu}) => {
  return (
    <Footer style={{ textAlign: "center", backgroundColor: "#001529", color: "#fff" }}>
      <Text style={{ display: "block", marginBottom: "8px" }}>
        &copy; {new Date().getFullYear()} {text}
      </Text>
      <Link href="#" style={{ color: "#40a9ff", marginRight: "16px" }}>
        {PP}
      </Link>
      <Link href="#" style={{ color: "#40a9ff", marginRight: "16px" }}>
        {Tos}
      </Link>
      <Link href="#" style={{ color: "#40a9ff" }}>
        {Cu}
      </Link>
    </Footer>
  );
};

export default FooterAntd;
