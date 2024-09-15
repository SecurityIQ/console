import { NavLink } from "@remix-run/react";
import { Box, File, Home, Layers, Settings } from "lucide-react";
import { css } from "styled-system/css";

export default function Navbar() {

    const navbarLogo = css({
        width: "48px",
        height: "48px",
        marginBottom: "32px",
    })

    const navbarLink = css({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "48px",
        height: "48px",
        marginBottom: "16px",
        color: "var(--text-color)",
        textDecoration: "none",
        transition: "background-color 0.2s, color 0.2s",
        borderRadius: "12px",
        _hover: {
            backgroundColor: "primary",
            color: "white",
        },
        '&.active': {
            backgroundColor: "primary",
            color: "white",
        },
    })

    return (
        <nav className={css({
                position: "fixed",
                top: "24px",
                left: "24px",
                width: "80px",
                backgroundColor: "panel-bg",
                borderRadius: 'xl',
                boxShadow: "card",
                padding: "24px 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: "1000",
            })}>
            <div className={navbarLogo}>
                <Box className={css({
                    width: "48px",
                    height: "48px",

                })} />
            </div>
            <div className={css({
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            })}>
                <NavLink to="/dashboard" className={navbarLink} end >
                    <Home />
                </NavLink>
                <NavLink to='/dashboard/analysis' className={navbarLink}>
                    <File />
                </NavLink>
                <NavLink to="/tools" className={navbarLink}>
                    <Layers />
                </NavLink>
                <NavLink to="/settings" className={navbarLink}>
                    <Settings />
                </NavLink>
            </div>
        </nav>
    )
}