import { useAuthStore } from "@/hooks/useAuthStore";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  beforeLoad: () => {
    const { expiresAt } = useAuthStore.getState();
    if (!expiresAt || Date.now() > expiresAt) {
      useAuthStore.getState().clearAuth();
      // Redirect to login if token is missing or expired
      throw redirect({ to: "/login" });
    }
  },
});

function RouteComponent() {
  return (
    <div>
      <Link to="/login">Login</Link>
    </div>
  );
}
