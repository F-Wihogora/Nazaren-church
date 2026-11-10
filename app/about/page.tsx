"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Users,
  BookOpen,
  Target,
  Sparkles,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  ShieldCheck,
  Globe2,
} from "lucide-react";
import { publicAssetPath } from "@/lib/media-path";
import ChurchImage from "@/components/ChurchImage";

interface Leader {
  name: string;
  role: string;
  image: string;
  bio: string;
}

interface Ministry {
  _id: string;
  name: string;
  leader: string;
  description: string;
  meetingSchedule?: string;
  division?: string;
  image?: string;
}

const leaders: Leader[] = [
  {
    name: "Pastor Jacques Niyonsaba",
    role: "Senior Pastor",
    image: "/images/jacques.png",
    bio: "Senior Pastor providing spiritual oversight, expository biblical preaching, and vision for discipleship at Remera Church.",
  },
  {
    name: "Pastor Mbonigaba Diedonne",
    role: "Associate Pastor",
    image: "/images/mbonigaba.png",
    bio: "Dedicated to pastoral care, evangelistic outreach, family counseling, and equipping leaders across church ministries.",
  },
  {
    name: "Pastor Agnes Nyirabigabiro",
    role: "Associate Pastor",
    image: "/images/agnes.png",
    bio: "Passionate about women's discipleship, intercessory prayer gatherings, and compassionate community ministry.",
  },
  {
    name: "Pastor Marcelline Muhimakazi",
    role: "Associate Pastor",
    image: "/images/marcelline.png",
    bio: "Leading children and family ministries, encouraging the next generation to grow in Christ-centered holiness.",
  },
];

export default function AboutPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loadingMinistries, setLoadingMinistries] = useState(true);

  useEffect(() => {
    fetch("/api/ministries")
      .then((r) => r.json())
      .then((data) => setMinistries(data.ministries || []))
      .catch((err) => console.error("Error fetching ministries:", err))
      .finally(() => setLoadingMinistries(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/15 via-primary/5 to-background border-b py-16 sm:py-24">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Remera Church of the Nazarene</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              A Community Anchored in Christ &amp; Holiness
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We are a warm, welcoming church family in Kigali, Rwanda, dedicated to preaching the Gospel of Jesus Christ, nurturing disciples, and walking in genuine love and holiness.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-6xl space-y-20">
        {/* Mission & Vision Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex"
          >
            <Card className="rounded-3xl border border-border/80 p-8 shadow-sm flex flex-col justify-between w-full bg-card">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Target className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  To glorify God by making Christlike disciples in our community and throughout the nations. We pursue this through biblical preaching, sincere worship, compassionate service, and nurturing deep spiritual transformation.
                </p>
              </div>
              <div className="pt-6 border-t mt-6 text-xs text-primary font-medium">
                Matthew 28:19–20 • The Great Commission
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex"
          >
            <Card className="rounded-3xl border border-border/80 p-8 shadow-sm flex flex-col justify-between w-full bg-card">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Heart className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Our Vision</h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  To be a thriving, multigenerational sanctuary where every person encounters God&apos;s transforming grace, finds belonging in Christian fellowship, and is equipped to serve society with integrity, compassion, and excellence.
                </p>
              </div>
              <div className="pt-6 border-t mt-6 text-xs text-primary font-medium">
                Holiness Unto The Lord • 1 Peter 1:15–16
              </div>
            </Card>
          </motion.div>
        </section>

        {/* Biblical Foundation Quote Banner */}
        <section className="rounded-3xl bg-gradient-to-r from-primary/15 via-primary/5 to-primary/10 border border-primary/20 p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-sm">
          <BookOpen className="h-8 w-8 text-primary mx-auto mb-4" />
          <blockquote className="text-xl sm:text-2xl font-semibold italic text-foreground leading-relaxed">
            &ldquo;For I know the plans I have for you,&rdquo; declares the Lord, &ldquo;plans to prosper you and not to harm you, plans to give you hope and a future.&rdquo;
          </blockquote>
          <cite className="block mt-4 text-sm font-medium text-primary not-italic">
            — Jeremiah 29:11 (NIV)
          </cite>
        </section>

        {/* Core Pillars / Values */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
              What We Believe
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Our Core Convictions</h2>
            <p className="text-sm text-muted-foreground">
              Anchored in biblical Wesleyan-Holiness heritage and active in the heart of Kigali.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="rounded-3xl p-6 space-y-3 bg-card border border-border/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base">Biblical Authority</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The Holy Scriptures are God&apos;s inspired Word, containing all truth necessary for faith, salvation, and godly living.
              </p>
            </Card>

            <Card className="rounded-3xl p-6 space-y-3 bg-card border border-border/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base">Entire Sanctification</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We believe in the sanctifying power of the Holy Spirit, cleansing our hearts and enabling believers to live in daily love and holiness.
              </p>
            </Card>

            <Card className="rounded-3xl p-6 space-y-3 bg-card border border-border/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Globe2 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base">Global &amp; Local Mission</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Called to take the Gospel of Jesus Christ across Kigali, throughout Rwanda, and to the unreached corners of the world.
              </p>
            </Card>
          </div>
        </section>

        {/* Pastoral Leadership Team */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
              Spiritual Shepherds
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Our Pastoral Team</h2>
            <p className="text-sm text-muted-foreground">
              Meet the pastors dedicated to prayer, counseling, teaching, and serving Remera Church of the Nazarene.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaders.map((leader, index) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border border-border/80 group rounded-3xl bg-card flex flex-col justify-between">
                  <div>
                    <div className="relative w-full aspect-square overflow-hidden bg-muted">
                      <img
                        src={publicAssetPath(leader.image)}
                        alt={leader.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      <span className="absolute bottom-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-md shadow-sm">
                        {leader.role}
                      </span>
                    </div>
                    <CardHeader className="p-5 pb-2">
                      <CardTitle className="text-base font-bold leading-snug">{leader.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                      <p className="text-xs text-muted-foreground leading-relaxed">{leader.bio}</p>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Ministries Section (Dynamic from DB) */}
        <section id="ministries" className="space-y-8 scroll-mt-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
              Active Departments
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Our Ministries</h2>
            <p className="text-sm text-muted-foreground">
              Every member has a place to serve, grow, and minister. Explore our vibrant departments.
            </p>
          </div>

          {loadingMinistries ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Loading church ministries...
            </div>
          ) : ministries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ministries.map((ministry) => (
                <Card
                  key={ministry._id}
                  className="rounded-3xl border border-border/80 hover:border-primary/50 hover:shadow-lg transition-all p-6 space-y-4 bg-card flex flex-col justify-between"
                >
                  {ministry.image && (
                    <ChurchImage
                      src={ministry.image}
                      alt={`${ministry.name} ministry`}
                      className="w-full h-44 object-cover rounded-2xl mb-4"
                    />
                  )}
                  <div className="space-y-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                      {ministry.division || "Ministry Department"}
                    </span>
                    <h3 className="font-bold text-lg text-foreground leading-snug">{ministry.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{ministry.description}</p>
                  </div>

                  <div className="pt-3 border-t space-y-1.5 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">
                      Leadership: <span className="font-normal text-muted-foreground">{ministry.leader}</span>
                    </p>
                    {ministry.meetingSchedule && (
                      <p className="flex items-center gap-1.5 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{ministry.meetingSchedule}</span>
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-card rounded-2xl border text-muted-foreground text-sm">
              Ministries are being updated. Check back shortly.
            </div>
          )}
        </section>

        {/* Call to Action Section */}
        <section className="rounded-3xl bg-secondary/30 border p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to Experience Remera Nazarene?</h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Whether you are exploring faith or looking for a home church in Kigali, our family is here to welcome you with joy.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact">
              <Button className="h-11 px-6 rounded-xl text-xs sm:text-sm font-semibold">
                <MapPin className="mr-2 h-4 w-4" /> Plan Your Visit
              </Button>
            </Link>
            <Link href="/visitor-registration">
              <Button variant="outline" className="h-11 px-6 rounded-xl text-xs sm:text-sm font-semibold">
                Register as a Visitor
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
