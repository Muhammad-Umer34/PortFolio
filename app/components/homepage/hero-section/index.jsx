// @flow strict
import { personalData } from "@/utils/data/personal-data";
import Image from "next/image";
import Link from "next/link";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { FaFacebook, FaTwitterSquare } from "react-icons/fa";
import { MdDownload } from "react-icons/md";
import { RiContactsFill } from "react-icons/ri";
import { SiLeetcode } from "react-icons/si";

export default function HeroSection() {
  const socialLinks = [
    { href: personalData.github, icon: <BsGithub size={30} /> },
    { href: personalData.linkedIn, icon: <BsLinkedin size={30} /> },
    { href: personalData.twitter, icon: <FaTwitterSquare size={30} /> },
  ];

  return (
    <section className="relative flex flex-col items-center py-4 lg:py-12">
      <Image
        src="/hero.svg"
        alt="Hero background"
        width={1572}
        height={795}
        priority
        className="absolute -top-[98px] -z-10"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 gap-y-8">
        {/* Left Column */}
        <div className="order-2 lg:order-1 flex flex-col items-start justify-center p-2 pb-20 md:pb-10 lg:pt-10">
          <h1 className="text-3xl font-bold leading-10 text-white md:font-extrabold lg:text-[2.6rem] lg:leading-[3.5rem]">
            Hello, <br />
            This is{" "}
            <span className="text-pink-500">{personalData.name}</span>
            {` , I am a Professional `}
            <span className="text-[#16f2b3]">{personalData.designation}</span>.
          </h1>

          <div className="my-12 flex items-center gap-5">
            {socialLinks.map(({ href, icon }, idx) => (
              <Link
                key={idx}
                href={href}
                target="_blank"
                className="text-pink-500 transition-transform duration-300 hover:scale-125"
              >
                {icon}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="#contact"
              className="bg-gradient-to-r from-violet-600 to-pink-500 p-[1px] rounded-full hover:from-pink-500 hover:to-violet-600 transition-all duration-300"
            >
              <button className="flex items-center gap-1 hover:gap-3 px-3 md:px-8 py-3 md:py-4 bg-[#0d1224] rounded-full text-xs md:text-sm font-medium md:font-semibold uppercase tracking-wider text-white transition-all duration-200">
                <span>Contact me</span>
                <RiContactsFill size={16} />
              </button>
            </Link>

            <Link
              href={personalData.resume}
              target="_blank"
              role="button"
              className="flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-3 md:px-8 py-3 md:py-4 text-xs md:text-sm font-medium md:font-semibold uppercase tracking-wider text-white transition-all duration-200"
            >
              <span>Get Resume</span>
              <MdDownload size={16} />
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div className="order-1 lg:order-2 relative rounded-lg border border-[#1b2c68a0] bg-gradient-to-r from-[#0d1224] to-[#0a0d37]">
          <div className="flex flex-row">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-500 to-violet-600" />
            <div className="h-[1px] w-full bg-gradient-to-r from-violet-600 to-transparent" />
          </div>
          <div className="px-4 lg:px-8 py-5">
            <div className="flex space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-orange-400" />
              <div className="h-3 w-3 rounded-full bg-green-200" />
            </div>
          </div>

          <div className="overflow-hidden border-t-[2px] border-indigo-900 px-4 lg:px-8 py-4 lg:py-8">
            <code className="font-mono text-xs md:text-sm lg:text-base">
  <div className="blink">
    <span className="mr-2 text-pink-500">const</span>
    <span className="mr-2 text-white">coder</span>
    <span className="mr-2 text-pink-500">=</span>
    <span className="text-gray-400">{"{"}</span>
  </div>
  <div>
    <span className="ml-4 lg:ml-8 mr-2 text-white">name:</span>
    <span className="text-gray-400">&apos;</span>
    <span className="text-amber-300">Muhammad Umer</span>
    <span className="text-gray-400">&apos;,</span>
  </div>
  <div className="ml-4 lg:ml-8 mr-2">
    <span className="text-white">skills:</span>
    <span className="text-gray-400">[</span>
    <span className="text-amber-300">
      &apos;Machine Learning / AI&apos;, &apos;Python&apos;, &apos;React&apos;, &apos;Node.js&apos;, &apos;MongoDB&apos;, &apos;Scikit-learn&apos;, &apos;Git&apos;, &apos;Docker&apos;
    </span>
    <span className="text-gray-400">],</span>
  </div>
  <div>
    <span className="ml-4 lg:ml-8 mr-2 text-white">hardWorker:</span>
    <span className="text-orange-400">true</span>,
  </div>
  <div>
    <span className="ml-4 lg:ml-8 mr-2 text-white">quickLearner:</span>
    <span className="text-orange-400">true</span>,
  </div>
  <div>
    <span className="ml-4 lg:ml-8 mr-2 text-white">problemSolver:</span>
    <span className="text-orange-400">true</span>,
  </div>
  <div>
    <span className="ml-4 lg:ml-8 mr-2 text-green-400">hireable:</span>
    <span className="text-orange-400">function</span>
    <span className="text-gray-400">(){" {"}</span>
  </div>
  <div>
    <span className="ml-8 lg:ml-16 mr-2 text-orange-400">return</span>
    <span className="text-gray-400"></span>
  </div>
  <div>
    <span className="ml-12 lg:ml-24 text-cyan-400">this.</span>
    <span className="mr-2 text-white">hardWorker</span>
    <span className="text-amber-300">&amp;&amp;</span>
  </div>
  <div>
    <span className="ml-12 lg:ml-24 text-cyan-400">this.</span>
    <span className="mr-2 text-white">problemSolver</span>
    <span className="text-amber-300">&amp;&amp;</span>
  </div>
  <div>
    <span className="ml-12 lg:ml-24 text-cyan-400">this.</span>
    <span className="mr-2 text-white">skills.length</span>
    <span className="mr-2 text-amber-300">&gt;=</span>
    <span className="text-orange-400">5</span>
  </div>
  <div>
    <span className="ml-8 lg:ml-16 mr-2 text-gray-400">{" );"}</span>
  </div>
  <div>
    <span className="ml-4 lg:ml-8 text-gray-400">{"};"}</span>
  </div>
  <div>
    <span className="text-gray-400">{"};"}</span>
  </div>
</code>
          </div>
        </div>
      </div>
    </section>
  );
}