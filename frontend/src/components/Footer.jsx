// src/components/Footer.
import {Link} from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-white py-16 border-t mt-24 font-cabinet">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* 🟡 Logo & About */}
        <div className="space-y-4">
          <img src={logo} alt="TrackPi logo" className="w-40" />

          <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
            Empowering businesses to succeed through expert guidance and personalized solutions.
            Unlocking potential and achieving success.
          </p>

          {/* ⭐ Social Media */}
          <div className="flex gap-6 text-2xl text-[#FFB300]">
            <a href="https://www.facebook.com/people/Trackpi-Private-Limited/61565947096778/"><i className="ri-facebook-circle-line hover:text-black transition"></i></a>
            <a href="https://www.youtube.com/@trackpi"><i className="ri-youtube-line hover:text-black transition"></i></a>
            <a href="https://www.instagram.com/trackpi_official"><i className="ri-instagram-line hover:text-black transition"></i></a>
            <a href="https://medium.com/@trackpi"><i className="ri-medium-line hover:text-black transition"></i></a>
            <a href="linkedin.com/company/trackpi-private-limited/?viewAsMember=true"><i className="ri-linkedin-box-line hover:text-black transition"></i></a>
            <a href="#"><svg className="w-[1em] h-[1em] fill-current hover:text-black transition inline-block" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.3799.9483A11.9628 11.9628 0 0 1 21.248 19.5397l2.4096 2.4225c.7322.7362.21 1.9905-.8272 1.9905l-10.7105.01a12.52 12.52 0 0 1-.304 0h-.02A11.9628 11.9628 0 0 1 7.3818.9503Zm7.3217 4.428a7.1717 7.1717 0 1 0-5.4873 13.2512 7.1717 7.1717 0 0 0 5.4883-13.2511Z" /></svg></a>
            <a href="https://trackpi.blogspot.com/"><i className="ri-blogger-line hover:text-black transition"></i></a>
          </div>
        </div>


        {/* 🔗 Links */}
        <div>
          <h3 className="font-extrabold text-lg mb-4 text-black">Links</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>
              <Link to="" className="cursor-pointer hover:text-[#FFB300]">
              Home
            </Link>
            </li>
            <li>
              <Link to="/about" className="cursor-pointer hover:text-[#FFB300]">
              About
              </Link></li>
            <li>
              <Link to="/connect" className="cursor-pointer hover:text-[#FFB300]">Connect Us</Link></li>
            <li>
              <Link to="/creators" className="hover:text-[#FFB300]">
                Creators
              </Link>
            </li>
            <li className="cursor-pointer hover:text-[#FFB300]">Terms & Conditions</li>
          </ul>
        </div>
        {/* 🛠 Services */}
        <div>
          <h3 className="font-extrabold text-lg mb-4 text-black">Services</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li className="cursor-pointer hover:text-[#FFB300]">Software development</li>
            <li className="cursor-pointer hover:text-[#FFB300]">Sales training</li>
            <li className="cursor-pointer hover:text-[#FFB300]">Operations training</li>
            <li className="cursor-pointer hover:text-[#FFB300]">Software development</li>
            <li className="cursor-pointer hover:text-[#FFB300]">Sales training</li>
            <li className="cursor-pointer hover:text-[#FFB300]">Operations training</li>
          </ul>
        </div>

        {/* 📞 Contact */}
        <div>
          <h3 className="font-extrabold text-lg mb-4 text-black">Contact</h3>

          <div className="flex items-start gap-3 text-sm text-gray-700 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#FFB300] flex items-center justify-center flex-shrink-0">
              <i className="ri-map-pin-line text-black text-lg"></i>
            </div>
            <p>
              Trackpi Private<br />
              Limited, 10E BCG<br />
              Tower, Opp. CSEZ,<br />
              Seaport-Airport Rd,<br />
              Kakkanad, Kochi,<br />
              Kerala - 682037,<br />
              India
            </p>
          </div>

          <div className="flex items-center gap-3 font-medium mb-4">
            <div className="w-8 h-8 rounded-full bg-[#FFB300] flex items-center justify-center flex-shrink-0">
              <i className="ri-phone-line text-black text-lg"></i>
            </div>
            <span>+91 9538610745</span>
          </div>

          <div className="flex items-center gap-3 font-medium">
            <div className="w-8 h-8 rounded-full bg-[#FFB300] flex items-center justify-center flex-shrink-0">
              <i className="ri-mail-line text-black text-lg"></i>
            </div>
            <span>operations@trackpi.in</span>
          </div>
        </div>
      </div>

      {/* ⬇️ Bottom Rights */}
      <p className="text-center text-gray-500 text-sm mt-12 border-t pt-6">
        © {new Date().getFullYear()} Trackpi Private Limited — All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
