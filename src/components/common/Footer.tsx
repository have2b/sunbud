"use client";

import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-pink-100 text-zinc-800">
      <div className="container mx-auto px-5 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block"
              tabIndex={0}
              aria-label="SunBud Home"
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.svg"
                  alt="SunBud Logo"
                  width={40}
                  height={40}
                />
                <span className="text-xl font-bold">Blosoomy</span>
              </div>
            </Link>
            <p className="text-sm">
              Chuyên cung cấp các loại hoa tươi, hoa khô và quà tặng với dịch vụ
              giao hàng nhanh chóng trong ngày.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm transition-colors hover:text-pink-600"
                  tabIndex={0}
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-sm transition-colors hover:text-pink-600"
                  tabIndex={0}
                >
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm transition-colors hover:text-pink-600"
                  tabIndex={0}
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm transition-colors hover:text-pink-600"
                  tabIndex={0}
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Thông tin liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 flex-shrink-0 text-pink-600" />
                <span className="text-sm">
                  Cổng trường THPT Hai Bà Trưng, Tân Xã, Thạch Thất, Hà Nội
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0 text-pink-600" />
                <span className="text-sm">+84 559901869</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0 text-pink-600" />
                <span className="text-sm">lvt120202@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Kết nối với chúng tôi
            </h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-pink-200 p-2 transition-colors hover:bg-pink-300"
                aria-label="Facebook"
                tabIndex={0}
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-pink-200 p-2 transition-colors hover:bg-pink-300"
                aria-label="Instagram"
                tabIndex={0}
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-pink-200 pt-6 text-center">
          <p className="text-sm">
            &copy; {currentYear} Blosoomy. Tất cả các quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
