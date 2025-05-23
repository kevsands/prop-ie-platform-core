'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {
  Shield,
  Lock,
  FileText,
  Euro,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronRight,
  Calendar,
  Clock,
  Building2,
  Gavel,
  BookOpen,
  Award,
  TrendingUp,
  Home,
  Heart,
  CreditCard,
  Download,
  MessageSquare,
  ArrowRight,
  Sparkles,
  BarChart3,
  Users,
  Target,
  Lightbulb,
  BadgeCheck,
  Landmark,
  Timer,
  Zap,
  Gift,
  Scale,
  UserCheck,
  Receipt,
  Banknote,
  CalendarCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileCheck,
  ShieldCheck,
  Wallet,
  PiggyBank,
  Calculator,
  HeartHandshake,
  Coins,
  Percent,
  Briefcase,
  ScrollText,
  Play
} from 'lucide-react';

// Legislative Framework Component
const LegislativeSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const legislation = [
    {
      title: "Consumer Protection Act 2007",
      description: "Protects buyers from unfair commercial practices and ensures transparent pricing",
      icon: Shield,
      relevance: "Guarantees your rights during property purchase"
    },
    {
      title: "Residential Tenancies Act 2004",
      description: "While primarily for rentals, establishes property transaction standards",
      icon: Building2,
      relevance: "Sets framework for property dealings"
    },
    {
      title: "Multi-Unit Developments Act 2011",
      description: "Governs the sale of apartments and shared property developments",
      icon: Home,
      relevance: "Protects your interests in multi-unit developments"
    },
    {
      title: "Property Services Regulatory Authority Act 2011",
      description: "Regulates property services providers and ensures professional standards",
      icon: Award,
      relevance: "Ensures all parties maintain professional standards"
    },
    {
      title: "Finance Act - Help to Buy",
      description: "Provides tax relief of up to €30,000 for first-time buyers",
      icon: Euro,
      relevance: "Maximizes your purchasing power"
    }
  ];

  return (
    <section ref={ref} className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={ opacity: 0, y: 50 }
          animate={isInView ? { opacity: 1, y: 0 } : {}
          transition={ duration: 0.8 }
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Legal Foundation You Can Trust
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every PROP transaction is built on Irish property law, ensuring complete protection for your investment
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {legislation.map((lawindex) => (
            <motion.div
              key={index}
              initial={ opacity: 0, scale: 0.8 }
              animate={isInView ? { opacity: 1, scale: 1 } : {}
              transition={ duration: 0.5, delay: index * 0.1 }
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <law.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">{law.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{law.description}</p>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  <CheckCircle className="inline w-4 h-4 mr-1" />
                  {law.relevance}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={ opacity: 0, y: 30 }
          animate={isInView ? { opacity: 1, y: 0 } : {}
          transition={ duration: 0.8, delay: 0.6 }
          className="mt-12 p-6 bg-blue-900 text-white rounded-2xl text-center"
        >
          <Shield className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-3">Your Rights Are Protected</h3>
          <p className="max-w-2xl mx-auto">
            PROP operates under full compliance with Irish law, ensuring every transaction 
            meets the highest legal standards and protects your consumer rights at every step.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Digital Booking Process Explained
const BookingProcessSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [activeStepsetActiveStep] = useState(0);

  const steps = [
    {
      title: "€500 Initial Reservation",
      description: "Secure your property with a fully refundable reservation fee",
      icon: CreditCard,
      details: [
        "100% refundable within 7 days",
        "Immediately takes property off market",
        "Gives you time to arrange viewing",
        "No commitment required"
      ],
      legal: "Under Consumer Protection Act - full refund rights"
    },
    {
      title: "€5,000 Booking Deposit",
      description: "Exclusive 30-day period to complete due diligence",
      icon: Lock,
      details: [
        "Secures exclusive buying rights",
        "90% refundable if you dont proceed",
        "€500 retention for exclusivity period",
        "Counted towards final purchase"
      ],
      legal: "Legal option agreement under Irish contract law"
    },
    {
      title: "Purchase Decision",
      description: "Complete purchase or receive credit",
      icon: Target,
      details: [
        "If proceeding: €5,000 counted as deposit",
        "If not: €4,500 as PROP Choice credit",
        "PROP Choice: furniture, upgrades, etc.",
        "Win-win outcome guaranteed"
      ],
      legal: "Protected under Multi-Unit Developments Act"
    },
    {
      title: "Contract & Completion",
      description: "Standard 10% deposit and legal completion",
      icon: FileCheck,
      details: [
        "Standard sales contract",
        "Solicitor review period",
        "10% deposit (minus booking amount)",
        "Protected completion process"
      ],
      legal: "Standard Law Society contract terms"
    }
  ];

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={ opacity: 0, y: 50 }
          animate={isInView ? { opacity: 1, y: 0 } : {}
          transition={ duration: 0.8 }
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            How Digital Booking Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A transparent, protected process designed to give you confidence and flexibility
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Steps */}
          <div className="space-y-6">
            {steps.map((stepindex) => (
              <motion.div
                key={index}
                initial={ opacity: 0, x: -50 }
                animate={isInView ? { opacity: 1, x: 0 } : {}
                transition={ duration: 0.5, delay: index * 0.1 }
                onClick={() => setActiveStep(index)}
                className={`p-6 rounded-2xl cursor-pointer transition-all ${
                  activeStep === index
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-500'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    activeStep === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">
                      Step {index + 1}: {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800 font-medium">
                        <Scale className="inline w-4 h-4 mr-1" />
                        {step.legal}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Active Step Details */}
          <div className="lg:sticky lg:top-32 h-fit">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={ opacity: 0, x: 50 }
                animate={ opacity: 1, x: 0 }
                exit={ opacity: 0, x: -50 }
                transition={ duration: 0.3 }
                className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    {React.createElement(steps[activeStep].icon, { className: "w-8 h-8 text-white" })}
                  </div>
                  <h3 className="text-2xl font-bold">
                    {steps[activeStep].title}
                  </h3>
                </div>

                <ul className="space-y-4 mb-6">
                  {steps[activeStep].details.map((detailidx) => (
                    <motion.li
                      key={idx}
                      initial={ opacity: 0, x: 20 }
                      animate={ opacity: 1, x: 0 }
                      transition={ delay: idx * 0.1 }
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                      <span className="text-lg">{detail}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="p-4 bg-white/10 rounded-xl">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Legal Protection
                  </h4>
                  <p className="text-sm">
                    {steps[activeStep].legal}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

// Trust & Transparency Section
const TrustSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const trustFactors = [
    {
      icon: BadgeCheck,
      title: "PSRA Licensed",
      description: "Fully licensed by Property Services Regulatory Authority",
      stat: "License #001234"
    },
    {
      icon: UserCheck,
      title: "Verified Buyers",
      description: "Every buyer goes through KYC/AML verification",
      stat: "100% Verified"
    },
    {
      icon: Landmark,
      title: "Client Account",
      description: "All deposits held in regulated client accounts",
      stat: "Bank of Ireland"
    },
    {
      icon: ShieldCheck,
      title: "Law Society Approved",
      description: "Using standard Law Society contracts",
      stat: "Fully Compliant"
    },
    {
      icon: Receipt,
      title: "Full Transparency",
      description: "Every fee and charge clearly disclosed",
      stat: "No Hidden Costs"
    },
    {
      icon: HeartHandshake,
      title: "Buyer Protection",
      description: "Consumer rights fully protected",
      stat: "Guaranteed"
    }
  ];

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={ opacity: 0, y: 50 }
          animate={isInView ? { opacity: 1, y: 0 } : {}
          transition={ duration: 0.8 }
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            Built on Trust & Transparency
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every aspect of our process is designed to protect you and give you confidence
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustFactors.map((factorindex) => (
            <motion.div
              key={index}
              initial={ opacity: 0, y: 50 }
              animate={isInView ? { opacity: 1, y: 0 } : {}
              transition={ duration: 0.5, delay: index * 0.1 }
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <factor.icon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{factor.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{factor.description}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    {factor.stat}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Stats */}
        <motion.div
          initial={ opacity: 0, y: 50 }
          animate={isInView ? { opacity: 1, y: 0 } : {}
          transition={ duration: 0.8, delay: 0.6 }
          className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Happy Buyers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">€250M+</div>
            <div className="text-gray-600">Properties Sold</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
            <div className="text-gray-600">Secure Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">4.8/5</div>
            <div className="text-gray-600">Customer Rating</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Fee Breakdown Section
const FeeBreakdownSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [selectedPropertysetSelectedProperty] = useState(350000);

  const calculateFees = (price: number) => {
    const bookingDeposit = 5000;
    const standardDeposit = price * 0.1;
    const remainingDeposit = standardDeposit - bookingDeposit;
    const stampDuty = price> 500000 ? (price - 500000) * 0.01 : 0;
    const legalFees = 2500;
    const surveyFees = 500;
    const totalUpfront = bookingDeposit + remainingDeposit + stampDuty + legalFees + surveyFees;

    return {
      price,
      bookingDeposit,
      standardDeposit,
      remainingDeposit,
      stampDuty,
      legalFees,
      surveyFees,
      totalUpfront,
      htbBenefit: Math.min(price * 0.130000),
      netRequired: totalUpfront - Math.min(price * 0.130000)
    };
  };

  const fees = calculateFees(selectedProperty);

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={ opacity: 0, y: 50 }
          animate={isInView ? { opacity: 1, y: 0 } : {}
          transition={ duration: 0.8 }
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            Complete Fee Transparency
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See exactly what you\'ll pay at each stage - no surprises, no hidden fees
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Property Price Selector */}
          <div className="mb-8 p-6 bg-gray-50 rounded-2xl">
            <h3 className="text-lg font-bold mb-4">Select Property Price</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[295000, 350000, 425000500000].map((price) => (
                <button
                  key={price}
                  onClick={() => setSelectedProperty(price)}
                  className={`py-3 px-4 rounded-xl font-medium transition-all ${
                    selectedProperty === price
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  €{price.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={ opacity: 0, x: -50 }
              animate={isInView ? { opacity: 1, x: 0 } : {}
              transition={ duration: 0.8 }
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">Cost Breakdown</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-xl">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Initial Booking Deposit</span>
                  </div>
                  <span className="font-bold">€{fees.bookingDeposit.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-white rounded-xl">
                  <div className="flex items-center gap-3">
                    <PiggyBank className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Remaining Deposit (10% - €5k)</span>
                  </div>
                  <span className="font-bold">€{fees.remainingDeposit.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-white rounded-xl">
                  <div className="flex items-center gap-3">
                    <Receipt className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Stamp Duty (FTB)</span>
                  </div>
                  <span className="font-bold">€{fees.stampDuty.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-white rounded-xl">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-orange-600" />
                    <span className="font-medium">Legal Fees (estimate)</span>
                  </div>
                  <span className="font-bold">€{fees.legalFees.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-white rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileSearch className="w-5 h-5 text-red-600" />
                    <span className="font-medium">Survey Fees</span>
                  </div>
                  <span className="font-bold">€{fees.surveyFees.toLocaleString()}</span>
                </div>

                <div className="border-t-2 border-gray-300 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total Upfront Costs</span>
                    <span className="text-2xl font-bold text-blue-600">
                      €{fees.totalUpfront.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={ opacity: 0, x: 50 }
              animate={isInView ? { opacity: 1, x: 0 } : {}
              transition={ duration: 0.8 }
              className="space-y-6"
            >
              {/* HTB Benefit */}
              <div className="bg-green-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-green-800">
                  First-Time Buyer Benefits
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Help-to-Buy Benefit</span>
                    </div>
                    <span className="font-bold text-green-600">
                      €{fees.htbBenefit.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Stamp Duty Saving</span>
                    </div>
                    <span className="font-bold text-green-600">
                      €{(fees.price * 0.01).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-100 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-800">Net Cash Required</span>
                    <span className="text-2xl font-bold text-green-800">
                      €{fees.netRequired.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold mb-6">Payment Timeline</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold">Today</h4>
                      <p className="text-gray-600">€500 reservation fee (fully refundable)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold">Within 7 Days</h4>
                      <p className="text-gray-600">€5,000 booking deposit</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold">Contract Signing</h4>
                      <p className="text-gray-600">Remaining deposit + fees</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      4
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold">Completion</h4>
                      <p className="text-gray-600">Balance of purchase price</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// FAQ Section
const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [openFaqsetOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "What exactly is the €5,000 booking deposit for?",
      answer: "The €5,000 booking deposit gives you exclusive rights to purchase the property for 30 days. During this time, the property is taken off the market while you complete due diligence, arrange financing, and make your final decision. If you proceed, the full €5,000 is credited towards your purchase. If not, €4,500 becomes PROP Choice credit for furniture or upgrades."
    },
    {
      question: "Is the booking deposit legally binding?",
      answer: "Yes, it creates a legal option agreement under Irish contract law. However, it\'s designed to protect both parties. You get exclusive rights and time to decide, while the developer ensures serious interest. The agreement clearly outlines all terms and your solicitor will review it."
    },
    {
      question: "What happens to my deposit if I don\'t proceed?",
      answer: "If you decide not to proceed within 30 days, €500 covers the exclusivity period costs, and €4,500 becomes PROP Choice credit. This credit can be used for furniture packages, property upgrades, or transfers to another development. It\'s valid for 12 months."
    },
    {
      question: "How is this different from traditional property buying?",
      answer: "Traditional buying often requires immediate commitment with limited refund options. Our digital process gives you a 30-day consideration period with clear outcomes. You can browse 24/7, reserve instantly, and have transparency at every step. Plus, you get the PROP Choice benefit unique to our platform."
    },
    {
      question: "What legal protections do I have?",
      answer: "You\'re protected by the Consumer Protection Act, standard Law Society contracts, and PROP\'s regulated status. All deposits are held in client accounts, contracts are reviewed by solicitors, and you have statutory cooling-off periods. We\'re fully PSRA licensed and compliant."
    },
    {
      question: "Can I change my mind after paying the €500 reservation?",
      answer: "Yes! The €500 reservation fee is fully refundable within 7 days. This gives you time to view the property, review documents, and ensure it\'s right for you before committing to the €5,000 booking deposit."
    }
  ];

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={ opacity: 0, y: 50 }
          animate={isInView ? { opacity: 1, y: 0 } : {}
          transition={ duration: 0.8 }
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about our digital booking process
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faqindex) => (
            <motion.div
              key={index}
              initial={ opacity: 0, y: 30 }
              animate={isInView ? { opacity: 1, y: 0 } : {}
              transition={ duration: 0.5, delay: index * 0.1 }
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-6 text-left flex items-start justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-bold pr-8">{faq.question}</h3>
                <ChevronRight 
                  className={`w-6 h-6 text-gray-400 transition-transform ${
                    openFaq === index ? 'rotate-90' : ''
                  }`} 
                />
              </button>

              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={ height: 0, opacity: 0 }
                    animate={ height: 'auto', opacity: 1 }
                    exit={ height: 0, opacity: 0 }
                    transition={ duration: 0.3 }
                    className="px-6 pb-6"
                  >
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={ opacity: 0, y: 30 }
          animate={isInView ? { opacity: 1, y: 0 } : {}
          transition={ duration: 0.8, delay: 0.6 }
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
            <MessageSquare className="w-5 h-5" />
            Chat with an Advisor
          </button>
        </motion.div>
      </div>
    </section>
  );
};

// Main Component
function BuyerBookingContent() {
  const router = useRouter();
  const [loadingsetLoading] = useState(false);

  return (
    <ProtectedRoute requiredRole={['buyer', 'admin']}>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" />

          <motion.div
            initial={ opacity: 0, y: 50 }
            animate={ opacity: 1, y: 0 }
            transition={ duration: 0.8 }
            className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white"
          >
            <motion.div
              animate={ scale: [1, 1.051] }
              transition={ duration: 2, repeat: Infinity }
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-8"
            >
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">100% Protected by Irish Law</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Ireland\'s First Digital Property Booking
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Transparent, protected, and designed to give you confidence in your biggest investment
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={ scale: 1.05 }
                whileTap={ scale: 0.95 }
                onClick={() => router.push('/properties')}
                className="px-8 py-4 bg-white text-blue-900 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Start Browsing Properties
              </motion.button>

              <motion.button
                whileHover={ scale: 1.05 }
                whileTap={ scale: 0.95 }
                className="px-8 py-4 bg-transparent text-white rounded-xl font-bold text-lg border-2 border-white hover:bg-white hover:text-blue-900 transition-all"
              >
                <Play className="inline-block mr-2" />
                Watch How It Works
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">€500</div>
                <div className="text-blue-200">Fully Refundable Start</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">30 Days</div>
                <div className="text-blue-200">To Make Decision</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-blue-200">Legally Protected</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Main Content */}
        <LegislativeSection />
        <BookingProcessSection />
        <TrustSection />
        <FeeBreakdownSection />
        <FAQSection />

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join hundreds of buyers who have successfully purchased their dream home through PROP
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={ scale: 1.05 }
                whileTap={ scale: 0.95 }
                onClick={() => router.push('/buyer/calculator')}
                className="px-8 py-4 bg-white text-blue-900 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Calculate Your Budget
              </motion.button>

              <motion.button
                whileHover={ scale: 1.05 }
                whileTap={ scale: 0.95 }
                onClick={() => router.push('/buyer/advisor')}
                className="px-8 py-4 bg-transparent text-white rounded-xl font-bold text-lg border-2 border-white hover:bg-white hover:text-blue-900 transition-all"
              >
                <MessageSquare className="inline-block mr-2" />
                Speak to an Advisor
              </motion.button>
            </div>

            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm">PSRA Licensed</div>
              </div>
              <div className="text-center">
                <Landmark className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm">Client Accounts</div>
              </div>
              <div className="text-center">
                <FileCheck className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm">Law Society</div>
              </div>
              <div className="text-center">
                <BadgeCheck className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm">100% Compliant</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}

export default function BuyerBookingPage() {
  return (
    <Suspense fallback={
      <ProtectedRoute requireAuth={true}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4"></div>
              <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    }>
      <BuyerBookingContent />
    </Suspense>
  );
}