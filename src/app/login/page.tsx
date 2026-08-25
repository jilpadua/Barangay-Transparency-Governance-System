import { Suspense } from "react";
import LoginForm from "./login-form";

export default function LoginRoute() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
