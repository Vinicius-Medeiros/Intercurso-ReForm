import { Box, Paper, Typography } from "@mui/material";
import Logo from "../assets/logo";
import { Outlet } from "react-router";

export const IslandLayout = () => (
    <>
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            margin={"2rem"}
            gap={1}

        >
            <Logo height={125} width={125} />
            <Typography variant="h3" component={"h1"} color="primary">
                REFORM
            </Typography>
        </Box>
        <Paper
            sx={{
                display: "flex",
                flexDirection: "column",
                // maxWidth: 400,
                minHeight: 400,
                borderRadius: 4,
                alignItems: "center",
                // margin: "auto",
                justifyContent: "center",
                gap: 4,
                padding: 3,
            }}

        >
            <Outlet />
        </Paper>
    </>

)