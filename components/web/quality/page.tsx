'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function QualityPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/dfvtnrisi/image/upload/v1690180341/quality_2_x3zki5.jpg"
            alt="Quality control laboratory"
            fill
            className="object-cover opacity-20 dark:opacity-10"
            priority
          />
        </div>
        <div className="container relative z-10 mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <motion.h1
              variants={fadeIn}
              className="text-4xl md:text-5xl font-bold tracking-tight"
            >
              Our Commitment to <span className="text-primary">Quality</span>
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="text-lg md:text-xl text-muted-foreground"
            >
              Delivering world-class automotive components that meet the highest
              international standards and exceed customer expectations.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Quality Policy */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold">Quality Policy</h2>
              <p className="text-muted-foreground">
                At Meghdoot Pistons, quality is not just a department it is a
                mindset that permeates every aspect of our operations. Our
                comprehensive quality policy is built on the principles of
                continuous improvement, rigorous testing, and unwavering
                commitment to excellence.
              </p>
              <p className="text-muted-foreground">
                We are dedicated to manufacturing products that consistently
                meet or exceed customer requirements and comply with all
                applicable regulatory standards. This commitment has established
                us as a trusted global exporter of automotive components.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  <span>Zero-defect manufacturing philosophy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  <span>100% inspection of critical dimensions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  <span>Advanced statistical process control</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  <span>Continuous employee training and development</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  <span>Regular supplier quality audits</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-100 rounded-lg overflow-hidden"
            >
              <Image
                src="https://res.cloudinary.com/dfvtnrisi/image/upload/v1690180341/quality_2_x3zki5.jpg"
                alt="Quality inspection process"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Certifications & Compliance
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Our commitment to quality is reflected in our ISO 9001:2015
              certification, ensuring that our processes and products
              consistently meet the highest international standards.
            </motion.p>
          </motion.div>

          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="overflow-hidden">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative h-100 md:h-auto">
                    <Image
                      src="https://res.cloudinary.com/dfvtnrisi/image/upload/v1691934350/MEGHDOOT_PISTONS_PVT._LTD._QMS_page-0001_pgjr6g.png"
                      alt="Meghdoot Pistons Quality Management System"
                      fill
                      priority
                      className="object-contain p-4"
                    />
                  </div>
                  <CardContent className="p-6 flex flex-col justify-center space-y-4">
                    <div>
                      <span className="text-sm font-medium text-primary">
                        Quality Certification
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bold mt-2">
                        ISO 9001:2015 Certified
                      </h2>
                    </div>
                    <p className="text-muted-foreground">
                      Our commitment to quality is reflected in our ISO
                      9001:2015 certification, ensuring that our processes and
                      products consistently meet the highest international
                      standards.
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                        <span>International Quality Standards</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                        <span>Continuous Improvement</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                        <span>Customer Satisfaction</span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quality Control Process */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-8 md:mb-12"
          >
            <motion.h2
              variants={fadeIn}
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            >
              Quality Control Process
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0"
            >
              Our comprehensive quality control process ensures that every
              product meets our exacting standards before being exported to
              global markets.
            </motion.p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20 sm:block hidden"></div>

            <div className="space-y-8 md:space-y-12">
              {[
                {
                  step: '1',
                  title: 'Raw Material',
                  description:
                    'Each batch of Alliminum Alloys its chemical compostions is tested before casting.',
                },
                {
                  step: '2',
                  title: 'In-Process Quality Checks',
                  description:
                    'Throughout the manufacturing process, our quality engineers conduct regular checks on each machining process using advanced measurement tools to ensure adherence to specifications.',
                },
                {
                  step: '3',
                  title: 'Final Inspection',
                  description:
                    'Our quality assurance team conducts a comprehensive final inspection before products are cleared for packaging and export.',
                },
                {
                  step: '4',
                  title: 'Documentation & Traceability',
                  description:
                    'Complete quality documentation is maintained for each batch, ensuring full traceability from raw material to finished product.',
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`relative flex items-center ${index % 2 === 0 ? 'sm:flex-row flex-col' : 'sm:flex-row-reverse flex-col'}`}
                >
                  <div
                    className={`sm:w-1/2 w-full ${index % 2 === 0 ? 'sm:pr-8 md:pr-12 sm:text-right' : 'sm:pl-8 md:pl-12'} mb-4 sm:mb-0 px-4 sm:px-0`}
                  >
                    <div className="space-y-2">
                      <h3 className="text-lg sm:text-xl font-bold">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <div className="sm:absolute relative left-1/2 transform -translate-x-1/2 sm:mb-0 mb-4 z-10">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm sm:text-base">
                      {step.step}
                    </div>
                  </div>
                  <div className="sm:w-1/2 w-full"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-8 md:mb-12"
          >
            <motion.h2
              variants={fadeIn}
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            >
              What Our Customers Say
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0"
            >
              Our commitment to quality has earned us the trust of automotive
              manufacturers worldwide.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 px-4 sm:px-0"
          >
            {[
              {
                quote:
                  'Meghdoot Pistons has consistently delivered high-quality piston assembly according to our drawing. Their commitment to quality and on-time delivery has made them a valued supplier.',
                customer: 'Germany',
              },
              {
                quote:
                  "We've been importing piston from Meghdoot for 3 years. They also support us, by supplying small quanties of new models to Introduce in the Market",
                customer: 'Turkey',
              },
              {
                quote:
                  'Meghdoot Pistons has proven to be a reliable partner, delivering cylinder kit assembly in my brand packaging, which helped us to build our domestic market.',
                customer: 'Egypt',
              },
            ].map((testimonial, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="h-full">
                  <CardContent className="p-4 sm:p-6 flex flex-col h-full">
                    <p className="text-muted-foreground italic grow mb-4 sm:mb-6 text-sm sm:text-base">
                      {testimonial.quote}
                    </p>
                    <div>
                      <p className="font-bold text-sm sm:text-base">
                        {testimonial.customer}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6 px-4 sm:px-0"
          >
            <motion.h2
              variants={fadeIn}
              className="text-2xl sm:text-3xl md:text-4xl font-bold"
            >
              Experience the Meghdoot Quality Difference
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-primary-foreground/80 text-base sm:text-lg"
            >
              Join leading automotive manufacturers worldwide who trust Meghdoot
              Pistons for their critical engine components. Our commitment to
              quality ensures your products perform at their best.
            </motion.p>
            <motion.div variants={fadeIn} className="pt-2 sm:pt-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">Request Quality Documentation</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
