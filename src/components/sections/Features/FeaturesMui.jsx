import React from "react";
import { Grid, Card, CardContent, Typography, Avatar } from "@mui/material";
import { Settings, Public, AccessTime } from "@mui/icons-material";

const FeaturesMui = ({ features=[] }) => {

  if (!Array.isArray(features)) {
    return <div>Error: Invalid features data</div>;
  }
  return (
    <Grid container spacing={4} style={{ padding: 16 }}>
      {features.map((feature, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardContent>
              <Avatar style={{ backgroundColor: "#3f51b5", marginBottom: 8 }}>
                {feature.icon}
              </Avatar>
              <Typography variant="h6">{feature.title}</Typography>
              <Typography color="textSecondary">{feature.description}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default FeaturesMui;
