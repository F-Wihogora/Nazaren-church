"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, BookOpen, Target } from "lucide-react";

interface Leader {
  name: string;
  role: string;
  image: string;
}

interface Ministry {
  title: string;
  description: string;
  images: string[];
}

export default function AboutPage() {
  const leaders: Leader[] = [
    { name: "Pastor Jacques Niyonsaba", role: "Senior Pastor", image: "/images/jacques.png" },
    { name: "Pastor Mbonigaba Diedonne", role: "Pastor", image: "/images/mbonigaba.png" },
    { name: "Pastor Agnes Nyirabigabiro", role: "Pastor", image: "/images/agnes.png" },
    { name: "Pastor Marcelline Muhimakazi", role: "Pastor", image: "/images/marcelline.png" },
  ];

  const ministries: Ministry[] = [
    {
      title: "NDI – Nazarene Discipleship International",
      description: "Learning the Word of God and preparing people to become excellent teachers of Christ.",
      images: ["/ministries/ministry1.png", "/ministries/ministry2.png", "/ministries/ministry3.png"],
    },
    {
      title: "NYI – Nazarene Youth International",
      description: "Youth ministry focused on spiritual growth, fellowship, worship, and service.",
      images: ["/ministries/nyi.png", "/ministries/nyi2.png", "/ministries/nyi3.png", "/ministries/nyi4.png", "/ministries/nyi1.png"],
    },
    {
      title: "NCM – Nazarene Compassionate Ministries",
      description: "Helping the vulnerable, supporting low-income families and students, and demonstrating Christ’s love through action.",
      images: ["/ministries/ncm.png", "/ministries/ncm2.png", "/ministries/ncm3.png"],
    },
    {
      title: "NMI – Nazarene Missions International",
      description: "Mission outreach and evangelism locally and internationally.",
      images: ["/ministries/nmi.jpg", "/ministries/nmi2.jpg", "/ministries/nmi3.jpg"],
    },
    {
      title: "Children Ministry",
      description: "Training children in the path of salvation while they are still young.",
      images: ["/ministries/children.jpg", "/ministries/children2.jpg", "/ministries/children3.jpg"],
    },
  ];

  // State for current image index for each ministry
  const [currentImages, setCurrentImages] = useState<number[]>(
    ministries.map(() => 0)
  );

  // Auto cycle images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImages((prev) =>
        prev.map((imgIndex, i) => (imgIndex + 1) % ministries[i].images.length)
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handlers for manual navigation
  const handlePrev = (index: number) => {
    setCurrentImages((prev) =>
      prev.map((imgIndex, i) =>
        i === index
          ? (imgIndex - 1 + ministries[i].images.length) % ministries[i].images.length
          : imgIndex
      )
    );
  };

  const handleNext = (index: number) => {
    setCurrentImages((prev) =>
      prev.map((imgIndex, i) =>
        i === index
          ? (imgIndex + 1) % ministries[i].images.length
          : imgIndex
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">About Nazarene Church</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A vibrant community of believers dedicated to serving God and spreading His love
        </p>
      </motion.div>

      {/* Mission Statement */}
      <section className="mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-2">
                <Target className="h-6 w-6" />
                <span>Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">
                To glorify God by making disciples of all nations through the proclamation of the Gospel,
                the teaching of God's Word, and the demonstration of Christ's love in our community and beyond.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Vision */}
      <section className="mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-2">
                <Heart className="h-6 w-6" />
                <span>Our Vision</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">
                To be a church where every person experiences the transforming power of God's love,
                grows in their relationship with Christ, and is equipped to serve others with compassion and excellence.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Bible Verse */}
      <section className="mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className="bg-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-2">
                <BookOpen className="h-6 w-6" />
                <span>Our Foundation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl italic text-center mb-4">
                &quot;For I know the plans I have for you,&quot; declares the Lord, &quot;plans to prosper you
                and not to harm you, plans to give you hope and a future.&quot;
              </p>
              <p className="text-center text-muted-foreground">— Jeremiah 29:11 (NIV)</p>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Leadership */}
      <section className="mb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center space-x-2">
            <Users className="h-8 w-8" />
            <span>Leadership Team</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leaders.map((leader, index) => (
            <motion.div
              key={leader.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-col items-center">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-32 h-32 object-cover rounded-full mb-4"
                  />
                  <CardTitle>{leader.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{leader.role}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MINISTRIES SECTION WITH SLIDESHOW & NAVIGATION */}
      <section className="py-20 bg-gray-50 rounded-xl">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Ministries</h2>

          {ministries.map((ministry, index) => (
            <div
              key={ministry.title}
              className="grid md:grid-cols-2 gap-10 items-center mb-20"
            >
              <div>
                <h3 className="text-3xl font-semibold mb-4">{ministry.title}</h3>
                <p className="text-gray-700 text-lg mb-4">{ministry.description}</p>

                {/* Navigation Buttons */}
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => handlePrev(index)}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handleNext(index)}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Slideshow */}
              <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImages[index]}
                    src={ministry.images[currentImages[index]]}
                    alt={ministry.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute w-full h-full object-cover rounded-xl"
                  />
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
