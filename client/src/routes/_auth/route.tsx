import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="flex h-screen w-screen items-center">
      <div className="mx-12 flex w-full items-center justify-center gap-24">
        <div className="flex flex-1/3 items-center">
          <Outlet />
        </div>
        <div className="relative">
          <img
            className="rounded-3xl mask-r-from-90%"
            src="/bg.jpg"
            alt="background"
          />
          {/* Slogan */}
          <span className="absolute bottom-1/12 left-1/12 z-30 max-w-1/3 text-lg font-bold text-wrap text-white uppercase md:text-3xl">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut.
          </span>
        </div>
      </div>
    </section>
  );
}
