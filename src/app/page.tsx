"use client";

import Header from "@/components/common/Header";
import HeroSection from "@/components/common/HeroSection";
import Navigation from "@/components/common/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "motion/react";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Header />
      <Navigation />
      <HeroSection />

      <motion.section
        className="bg-pink-50 px-5 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-12 text-center text-3xl text-zinc-800 sm:text-4xl">
          Sản phẩm nổi bật
        </h2>
        <div className="flex gap-5 max-md:flex-col">
          <div className="w-1/4 max-md:w-full">
            <Card>
              <CardContent className="p-0">
                <Image
                  src="https://images.pexels.com/photos/2791043/pexels-photo-2791043.jpeg"
                  alt="Hồng"
                  width={400}
                  height={300}
                  className="h-96 w-full rounded-t-lg object-cover"
                />
              </CardContent>
              <CardHeader>
                <CardTitle>Hoa hồng</CardTitle>
                <CardDescription>100.000₫</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="ml-5 w-1/4 max-md:ml-0 max-md:w-full">
            <Card>
              <CardContent className="p-0">
                <Image
                  src="https://images.pexels.com/photos/6755551/pexels-photo-6755551.jpeg"
                  alt="Hoa trắng"
                  width={400}
                  height={300}
                  className="h-96 w-full rounded-t-lg object-cover"
                />
              </CardContent>
              <CardHeader>
                <CardTitle>Hoa trắng</CardTitle>
                <CardDescription>100.000₫</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="ml-5 w-1/4 max-md:ml-0 max-md:w-full">
            <Card>
              <CardContent className="p-0">
                <Image
                  src="https://images.pexels.com/photos/1178985/pexels-photo-1178985.jpeg"
                  alt="Hoa mix"
                  width={400}
                  height={300}
                  className="h-96 w-full rounded-t-lg object-cover"
                />
              </CardContent>
              <CardHeader>
                <CardTitle>Hoa mix</CardTitle>
                <CardDescription>100.000₫</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="w-1/4 max-md:w-full">
            <Card>
              <CardContent className="p-0">
                <Image
                  src="https://images.pexels.com/photos/2791043/pexels-photo-2791043.jpeg"
                  alt="Hồng"
                  width={400}
                  height={300}
                  className="h-96 w-full rounded-t-lg object-cover"
                />
              </CardContent>
              <CardHeader>
                <CardTitle>Hoa hồng</CardTitle>
                <CardDescription>100.000₫</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </motion.section>
    </>
  );
}
