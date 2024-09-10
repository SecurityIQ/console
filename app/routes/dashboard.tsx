import { Outlet } from "@remix-run/react";
import Topbar from "~/components/topbar";
import Navbar from "~/components/navbar";
import { css } from "styled-system/css";

export default function Layout() {
  return (
    <div className={css({
      display: "flex",
      minHeight: "100vh",
      padding: "24px",
    })}>
      <Navbar />
      <main className={css({
        flexGrow: 1,
        marginLeft: "104px",
        margin: "0 auto",
        paddingLeft: '104px',
        paddingBottom: '4rem',
      })}>
        <Topbar />
        <div className={css({
          paddingTop: '24px',
          display: 'flex',
          height: 'full',
          flexDirection: 'column',
        })}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}