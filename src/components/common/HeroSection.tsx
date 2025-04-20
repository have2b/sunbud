import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "../ui/button";

const HeroSection = () => {
  return (
    <motion.section
      className="relative flex h-screen items-center justify-center text-center text-white max-sm:h-[70vh]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Image
        src="https://images.pexels.com/photos/15791186/pexels-photo-15791186.jpeg"
        alt="Beautiful flower arrangement"
        className="absolute top-0 left-0 z-[-1] size-full overflow-hidden object-cover"
        width={1920}
        height={1080}
      />
      <div className="bg-opacity-40 max-w-[600px] rounded-lg bg-black/70 p-10">
        <h2 className="mb-5 text-5xl max-sm:text-3xl">Hoa tươi mỗi ngày</h2>
        <p className="mb-8 text-xl max-sm:text-base">
          Mang vẻ đẹp tự nhiên đến không gian của bạn
        </p>
        <Button className="cursor-pointer rounded-3xl bg-rose-400 px-10 py-4 text-lg text-white transition-colors hover:bg-rose-500">
          Mua ngay
        </Button>
      </div>
    </motion.section>
  );
};

export default HeroSection;
