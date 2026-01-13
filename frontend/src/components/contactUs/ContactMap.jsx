import React from "react";
import { MapPin } from "lucide-react";

const ContactMap = () => {
    return (
        <div className="space-y-6 flex flex-col h-full">
            <h3 className="text-2xl font-bold">Find <span className="text-[#FFB300]">Our</span> Office</h3>
            <div className="w-full flex-1 min-h-[500px] bg-gray-200 rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15715.48590680696!2d76.30790807663248!3d10.008815143328228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080c8e94a07a07%3A0x49921cdfae82660!2sKakkanad%2C%20Kerala!5e0!3m2!1sen!2sin!4v1709664532000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="TrackPi Location"
                ></iframe>

                {/* Location Marker Overlay (Simulated styling from design) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-lg shadow-xl text-center">
                    <MapPin className="text-red-500 mx-auto mb-1" size={24} fill="currentColor" />
                    <p className="font-bold text-xs">Trackpi Pvt Limited</p>
                    <span className="bg-[#FFB300] text-black text-[10px] px-1 rounded">544</span>
                </div>
            </div>
        </div>
    );
};

export default ContactMap;
