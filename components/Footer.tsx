"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Youtube, Mail, MapPin, Heart, Sparkles } from "lucide-react";

const Footer = () => {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-secondary/40 border-t mt-20 transition-colors">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* 1. CHURCH ABOUT */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Church Logo"
                className="h-11 w-11 object-contain rounded-full bg-white p-0.5 shadow-sm border"
              />
              <div>
                <h3 className="text-sm font-bold tracking-tight leading-tight text-foreground">
                  REMERA CHURCH OF THE NAZARENE
                </h3>
                <p className="text-[11px] text-primary font-semibold uppercase tracking-wider">
                  Holiness Unto The Lord
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A vibrant sanctuary of worship, fellowship, discipleship, and spiritual transformation in Kigali, Rwanda.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground bg-card border px-2.5 py-1 rounded-full shadow-xs">
                <Sparkles className="w-3 h-3 text-primary" /> Kigali District • Rwanda Field
              </span>
            </div>
          </div>

          {/* 2. QUICK LINKS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Explore &amp; Connect
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/sermons" className="text-muted-foreground hover:text-primary transition-colors">
                  Sermons &amp; Live Streams
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-primary transition-colors">
                  Calendar &amp; Events
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About &amp; Pastoral Leadership
                </Link>
              </li>
              <li>
                <Link href="/prayer-request" className="text-muted-foreground hover:text-primary transition-colors">
                  Submit Prayer Request
                </Link>
              </li>
              <li>
                <Link href="/visitor-registration" className="text-muted-foreground hover:text-primary transition-colors">
                  Plan Your Visit
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Member Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. SERVICE TIMES & LOCATION */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Sanctuary &amp; Hours
            </h4>
            <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Boulevard de l&apos;Aeroport Rd<br />
                  Amahoro Village, Rukiri II Cell<br />
                  Remera, Gasabo, Kigali
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <Link href="/contact" className="hover:text-primary transition-colors">Use the contact form</Link>
              </div>
            </div>
          </div>

          {/* 4. SOCIAL MEDIA & GIVING */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Follow &amp; Giving
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Watch our live broadcasts on YouTube and join our weekly online community.
            </p>
            <div className="flex items-center gap-2.5">
              <a
                href="https://www.youtube.com/@nazarene-remeratv3072"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-xl bg-card border flex items-center justify-center text-muted-foreground hover:text-red-600 hover:border-red-600/40 shadow-xs transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/nazarene_remera/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-card border flex items-center justify-center text-muted-foreground hover:text-pink-600 hover:border-pink-600/40 shadow-xs transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>

            <div className="pt-2">
              <Link href="/contact#giving">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                  <Heart className="w-3.5 h-3.5 text-rose-500" /> Giving Information
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Remera Church of the Nazarene. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-primary transition-colors">
              Church Staff Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
