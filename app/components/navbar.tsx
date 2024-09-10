import { NavLink } from "@remix-run/react";
import { File, Home, Layers, Settings } from "lucide-react";
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
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