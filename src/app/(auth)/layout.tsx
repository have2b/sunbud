import { Suspense } from "react";
import Loading from "./loading";

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 to-rose-100">
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </div>
  );
};

export default AuthLayout;
