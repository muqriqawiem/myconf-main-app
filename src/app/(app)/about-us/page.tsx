'use client';

import React from 'react';
import Image from 'next/image';
import { FaRegEnvelope, FaPhoneAlt, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TiTick } from 'react-icons/ti';

const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900">About Us</h1>
        <p className="mt-4 text-lg text-gray-600">
          Welcome to MYCONF – Your Conference Management Solution!
        </p>
      </header>

      {/* Our Mission Section */}
      <section className="mb-10 bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-gray-800">Our Mission</h2>
        <p className="mt-4 text-gray-700">
          At MYCONF, we make conference management easy for organizers and attendees. Our platform is designed to boost collaboration, streamline tasks, and create meaningful connections in academic and professional communities.
        </p>
      </section>

      {/* Features Section */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold text-gray-800">Key Features</h2>
        <ul className="mt-4 space-y-4">
          {[
            'User-friendly interface for easy navigation.',
            'Comprehensive dashboard for organizers and participants.',
            'Secure paper submission and review process.',
            'Integrated payment gateway for registration fees.',
            'Real-time notifications and updates for users.',
          ].map((feature, index) => (
            <li key={index} className="flex items-start space-x-2">
              <TiTick className='mt-1 text-green-600'/>
              <p className="text-gray-700">{feature}</p>
            </li>
          ))}
        </ul>
      </section>


      {/* Call to Action */}
      {/* <div className="text-center">
        <Link href="/contact-us">
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            Get in Touch
          </Button>
        </Link>
      </div> */}
    </div>
  );
};

export default AboutUs;
