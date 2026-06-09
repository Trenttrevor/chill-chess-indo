import { Show } from "@clerk/react";
import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoute() {
  return (
    <>
      <Show when="signed-in">
        <Outlet />
      </Show>
      <Show when="signed-out">
        <Navigate to="/" replace />
      </Show>
    </>
  );
}

export default ProtectedRoute;
