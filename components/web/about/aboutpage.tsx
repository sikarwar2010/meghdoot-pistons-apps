'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  CheckCircle,
  Target,
  Lightbulb,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const AboutPage = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 md:py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://res.cloudinary.com/dfvtnrisi/image/upload/v1691655978/home2_hmyrxy.jpg"
              alt="Manufacturing facility"
              fill
              className="object-cover opacity-20 dark:opacity-10"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
          </div>
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6"
            >
              <motion.h1
                variants={fadeIn}
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
              >
                About <span className="text-primary">Meghdoot Pistons</span>
              </motion.h1>
              <motion.p
                variants={fadeIn}
                className="text-base sm:text-lg md:text-xl text-muted-foreground"
              >
                A legacy of excellence in Pistons Manufacturing since 1967.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Company Overview */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="space-y-4 sm:space-y-6"
              >
                <h2 className="text-2xl sm:text-3xl font-bold">Our Story</h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Founded in 1967, Meghdoot Pistons began as a small workshop
                  with a big vision - to manufacture world-class Pistons that
                  would set new standards in performance and reliability.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Over the decades, we have grown into a global enterprise,
                  supplying precision-engineered Pistons, Pins, Rings, and
                  Cylinder Liners to leading automotive manufacturers across the
                  world.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Today, with state-of-the-art manufacturing facilities spanning
                  over 3500 square meters and a workforce of 50 skilled
                  professionals, we continue to push the boundaries of
                  innovation in Pistons manufacturing.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="relative h-75 sm:h-100 rounded-lg overflow-hidden"
              >
                <Image
                  src="https://res.cloudinary.com/dfvtnrisi/image/upload/v1743759429/factory-image_stj5fp.jpg"
                  alt="Meghdoot Pistons Factory"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-12 sm:py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-8 sm:mb-12"
            >
              <motion.h2
                variants={fadeIn}
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
              >
                Our Mission, Vision & Values
              </motion.h2>
              <motion.p
                variants={fadeIn}
                className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto"
              >
                The principles that guide us in our journey towards excellence.
              </motion.p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Our Mission</h3>
                    <p className="text-muted-foreground text-justify">
                      Is to be passionate in anticipating and providing the best
                      products that excite our Global Customers. At Meghdoot
                      Pistons we work to provide tailor made products and cater
                      to create the best Customer-Manufacturer relationship.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Lightbulb className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Our Vision</h3>
                    <p className="text-muted-foreground text-justify">
                      Realizing our full potentials to drive a new era of
                      Development, Growth and Productivity. To be Earth's Most
                      Customer Centric Company, where Customers can get Products
                      at Friendly Prices.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Our Values</h3>
                    <ul className="text-muted-foreground text-left space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                        <span>Excellence in everything we do</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                        <span>Innovation that drives progress</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                        <span>Integrity in all our relationships</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                        <span>Sustainability for future generations</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-8 sm:mb-12"
            >
              <motion.h2
                variants={fadeIn}
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
              >
                Our Leadership Team
              </motion.h2>
              <motion.p
                variants={fadeIn}
                className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto"
              >
                Meet the visionaries who drive our company forward with their
                expertise and passion.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {[
                {
                  id: 1,
                  name: 'Mr. Sunil Agarwal',
                  position: 'Director',
                  image: '',
                  bio: 'Managing director, with over massive years of exposure to deal with complex micro macro issues that may threaten company profitability and longevity by providing innovative turn key solutions. Acts as the advisory to the board of directors and team with demonstrated expertise. Mr.Agarwal started his journey along with his father, is a mentor and guiding force behind all decisions.',
                },
                {
                  id: 2,
                  name: 'Mr. Akash Agarwal',
                  position: 'Director',
                  image: '',
                  bio: 'was always keen to be join the business. After completing his education, Mr.Akash decided to take the lead. Years of experience and exposure to business environment made him rock solid to achieve day to day goals and encourage his entire team in creating Meghdoot Pistons, a world known brand.',
                },
                {
                  id: 3,
                  name: 'Mr.Vishwas Agarwal',
                  position: 'Director',
                  image: '',
                  bio: 'After completing his graduation from Delhi University, wanted to follow his fathers footstep and join family business to take it to new heights. He has a proven track record of successful leading and overseeing manufacturing process. Adept in directing business strategy and constantly aiming to achieve 100% client satisfaction.',
                },
              ].map((leader, index) => (
                <motion.div key={index} variants={fadeIn}>
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                      {/* <div className="relative w-32 h-32 rounded-full overflow-hidden">
                                                <Image src={leader.image || "/placeholder.svg"} alt={""} fill className="object-cover" />
                                            </div> */}
                      <div>
                        <h3 className="text-xl font-bold">{leader.name}</h3>
                        <p className="text-primary font-medium">
                          {leader.position}
                        </p>
                      </div>
                      <p className="text-muted-foreground text-justify">
                        {leader.bio}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Milestones */}
        <section className="py-12 sm:py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-8 sm:mb-12"
            >
              <motion.h2
                variants={fadeIn}
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
              >
                Our Journey
              </motion.h2>
              <motion.p
                variants={fadeIn}
                className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto"
              >
                Key milestones in our path to becoming a global leader in
                Pistons manufacturing.
              </motion.p>
            </motion.div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20"></div>

              <div className="space-y-8 sm:space-y-12">
                {[
                  {
                    year: '1967',
                    title: 'Foundation',
                    description:
                      'Meghdoot Pistons was founded with a small workshop in Agra, India.',
                  },
                  {
                    year: '1971',
                    title: 'Brand Regcognition',
                    description:
                      'Became popular in diesel engine manufactures.',
                  },
                  {
                    year: '1980',
                    title: 'OEM Supplier',
                    description:
                      'Its was a significant step towards moving forward in the automotive industries.',
                  },
                  {
                    year: '1991',
                    title: 'Manufacturing Expansion',
                    description:
                      'New Manufacturing faclity was established to fulfil domestic demands.',
                  },
                  {
                    year: '1994',
                    title: 'First Choice',
                    description:
                      'Became First choice for diesel engine manufactures & Merchant Exporters',
                  },
                  {
                    year: '2001',
                    title: 'Next-Gen Manufacturing',
                    description:
                      'Next-Gen manufacturing by Introduction of CNC Machines in Manufacturing Faclity',
                  },
                  {
                    year: '2008',
                    title: 'Growth',
                    description:
                      'With a range of more than 300 models of Pistons.',
                  },
                  {
                    year: '2018',
                    title: 'Global Regcognition',
                    description:
                      'Started Participating in AutoMechanika Exhibitions overseas.',
                  },
                  {
                    year: '2025',
                    title: 'Present Continuing Innovation',
                    description:
                      'Continuing to innovate and expand our product range to meet evolving industry needs.',
                  },
                ].map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <div
                      className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}
                    >
                      <div className="space-y-2">
                        <span className="text-primary font-bold text-xl">
                          {milestone.year}
                        </span>
                        <h3 className="text-xl font-bold">{milestone.title}</h3>
                        <p className="text-muted-foreground">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-background"></div>
                    </div>
                    <div className="w-1/2"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6"
            >
              <motion.h2
                variants={fadeIn}
                className="text-2xl sm:text-3xl md:text-4xl font-bold"
              >
                Join Our Team
              </motion.h2>
              <motion.p
                variants={fadeIn}
                className="text-sm sm:text-base text-muted-foreground"
              >
                We are always looking for talented individuals who share our
                passion for excellence and innovation. Explore career
                opportunities at Meghdoot Pistons.
              </motion.p>
              <motion.div variants={fadeIn} className="pt-4">
                <Button size="lg" asChild>
                  <Link href="/contact">
                    Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
