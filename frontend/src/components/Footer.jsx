// src/components/Footer.
import { Link } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import logo from "../assets/logo_footer_v9.png";

const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] py-12 font-cabinet">
      <div className="max-w-[1440px] mx-auto px-6 md:px-20 grid grid-cols-1 md:grid-cols-4 gap-12 text-white">

        {/* 🟡 Logo & About */}
        <div className="flex flex-col gap-2 w-[384px]">
          <img
            src={logo}
            alt="TrackPi Logo"
            className="w-[100px] h-auto object-contain ml-28 mt-3"
          />
          <p className="text-gray-300 text-sm leading-relaxed font-urbanist w-[384px] h-[84px] text-justify">
            Empowering businesses to succeed through expert<br />
            guidance and personalized solutions. Unlocking<br />
            potential and achieving success.
          </p>

          {/* ⭐ Social Media */}
          <div className="flex gap-4 text-2xl text-[#FFB300]">
            <a href="https://www.facebook.com/people/Trackpi-Private-Limited/61565947096778/" className="hover:text-white transition"><i className="ri-facebook-circle-line"></i></a>
            <a href="https://www.youtube.com/@trackpi" className="hover:text-white transition"><i className="ri-youtube-line"></i></a>
            <a href="https://www.instagram.com/trackpi_official" className="hover:text-white transition"><i className="ri-instagram-line"></i></a>
            <a href="https://medium.com/@trackpi" className="hover:text-white transition"><i className="ri-medium-line border border-[#FFB300] rounded p-1 text-lg w-8 h-8 flex items-center justify-center"></i></a>
            <a href="linkedin.com/company/trackpi-private-limited/?viewAsMember=true" className="hover:text-white transition"><i className="ri-linkedin-line border border-[#FFB300] rounded p-1 text-lg w-8 h-8 flex items-center justify-center"></i></a>
            <a href="#" className="hover:text-white transition flex items-center justify-center w-8 h-8 border border-[#FFB300] rounded bg-white text-[#FFB300]"><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.3799.9483A11.9628 11.9628 0 0 1 21.248 19.5397l2.4096 2.4225c.7322.7362.21 1.9905-.8272 1.9905l-10.7105.01a12.52 12.52 0 0 1-.304 0h-.02A11.9628 11.9628 0 0 1 7.3818.9503Zm7.3217 4.428a7.1717 7.1717 0 1 0-5.4873 13.2512 7.1717 7.1717 0 0 0 5.4883-13.2511Z" /></svg></a>
            <a href="https://trackpi.blogspot.com/" className="hover:text-white transition"><i className="ri-blogger-line border border-[#FFB300] rounded p-1 text-lg w-8 h-8 flex items-center justify-center bg-white text-[#FFB300]"></i></a>
          </div>
        </div>


        {/* 🔗 Links */}
        <div className="mt-4 md:pl-24">
          <h3 className="font-extrabold text-lg mb-6 text-white text-left font-urbanist">Links</h3>
          <ul className="space-y-4 text-gray-300 text-sm text-left font-urbanist font-bold">
            <li className="w-[155px] h-[22px] flex items-center">
              <Link to="" className="cursor-pointer hover:text-[#FFB300] w-full">
                Home
              </Link>
            </li>
            <li className="w-[155px] h-[22px] flex items-center">
              <Link to="/about" className="cursor-pointer hover:text-[#FFB300] w-full">
                About
              </Link></li>
            <li className="w-[155px] h-[22px] flex items-center">
              <Link to="/connect" className="cursor-pointer hover:text-[#FFB300] w-full">Connect Us</Link></li>
            <li className="w-[155px] h-[22px] flex items-center">
              <Link to="/creators" className="hover:text-[#FFB300] w-full">
                Creators
              </Link>
            </li>
            <li className="cursor-pointer hover:text-[#FFB300] w-[155px] h-[22px] flex items-center">Terms & Conditions</li>
          </ul>
        </div>
        {/* 🛠 Services */}
        <div className="mt-4">
          <h3 className="font-extrabold text-lg mb-6 text-white text-left font-urbanist w-[185px] h-[29px]">Services</h3>
          <ul className="space-y-4 text-gray-300 text-sm text-left font-urbanist w-[185px] h-[180px] font-bold">
            <li className="cursor-pointer hover:text-[#FFB300]">Software development</li>
            <li className="cursor-pointer hover:text-[#FFB300]">Sales training</li>
            <li className="cursor-pointer hover:text-[#FFB300]">Operations training</li>
            <li className="cursor-pointer hover:text-[#FFB300]">Software development</li>
            <li className="cursor-pointer hover:text-[#FFB300]">Sales training</li>
            <li className="cursor-pointer hover:text-[#FFB300]">Operations training</li>
          </ul>
        </div>

        {/* 📞 Contact */}
        <div className="mt-4">
          <h3 className="font-extrabold text-lg mb-6 text-white text-left font-urbanist w-[86px] h-[29px]">Contact</h3>

          <div className="font-urbanist w-[218px] h-[244px] font-bold">
            <div className="flex items-start gap-4 text-sm text-gray-300 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#FFB300] flex items-center justify-center flex-shrink-0">
                <i className="ri-map-pin-line text-black text-lg"></i>
              </div>
              <p className="text-left">
                Trackpi Private<br />
                Limited, 10E BCG<br />
                Tower, Opp. CSEZ,<br />
                Seaport-Airport Rd,<br />
                Kakkanad, Kochi,<br />
                Kerala - 682037,<br />
                India
              </p>
            </div>

            <div className="flex items-center gap-4 font-medium text-gray-300 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#FFB300] flex items-center justify-center flex-shrink-0">
                <i className="ri-phone-line text-black text-lg"></i>
              </div>
              <span>+91 9538610745</span>
            </div>

            <div className="flex items-center gap-4 font-medium text-gray-300">
              <div className="w-8 h-8 rounded-full bg-[#FFB300] flex items-center justify-center flex-shrink-0">
                <i className="ri-mail-line text-black text-lg"></i>
              </div>
              <span>operations@trackpi.in</span>
            </div>
          </div>
        </div>
      </div>

      {/* ⬇️ Bottom Rights */}

    </footer>
  );
};

export default Footer;
