import { Suspense } from "react";
import Loading from "./loading";

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </div>
  );
};

export default AuthLayout;
