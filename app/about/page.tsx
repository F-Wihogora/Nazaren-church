"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, BookOpen, Target } from "lucide-react";

export default function AboutPage() {
  const leaders = [
    { name: "Pastor Jacques Niyonsaba", role: "Senior Pastor", image: "/images/jacques.png" },
    { name: "Pastor Mbonigaba Diedonne", role: "Pastor", image: "/images/mbonigaba.png" },
    { name: "Pastor Agnes Nyirabigabiro", role: "Pastor", image: "/images/agnes.png" },
    { name: "Pastor Marcelline Muhimakazi", role: "Pastor", image: "/images/marcelline.png" },
  ];

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
      <section>
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
    </div>
  );
}
