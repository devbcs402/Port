import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, Sparkles, Layers, Package, Palette, PenTool, Layout } from 'lucide-react';
import api from '../api/axios';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        if (res.data.success) {
          setServices(res.data.services);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-indigo-600">
            Design Capabilities
          </span>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-gray-950 tracking-tight leading-tight">
            Comprehensive Design Services Tailored for Growth.
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl leading-relaxed">
            From strategic brand architecture and luxury packaging to tactile editorial prints and high-converting marketing campaigns.
          </p>
        </div>

        {/* Services List / Cards */}
        <div className="space-y-12 mb-24">
          {services.map((service, idx) => (
            <div
              key={service._id || idx}
              className="p-8 sm:p-12 rounded-3xl bg-white border border-gray-100 shadow-xs hover:border-gray-200 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <div className="lg:col-span-4 space-y-4">
                <span className="font-mono text-xs uppercase font-bold tracking-wider text-indigo-600">
                  Service 0{idx + 1}
                </span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-gray-950">
                  {service.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {service.shortDescription}
                </p>
                <div className="pt-2">
                  <Link
                    to={`/contact?service=${encodeURIComponent(service.title)}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-950 text-white text-xs font-semibold hover:bg-black transition-all"
                  >
                    <span>Inquire About This Service</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-6 lg:pl-8 lg:border-l lg:border-gray-100">
                {service.fullDescription && (
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-2">Overview</h4>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                      {service.fullDescription}
                    </p>
                  </div>
                )}

                {service.deliverables && service.deliverables.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-3">Key Deliverables</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.deliverables.map((d, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs font-medium text-gray-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="p-10 sm:p-14 rounded-3xl bg-gray-950 text-white text-center space-y-6">
          <h3 className="font-display font-black text-2xl sm:text-4xl">
            Need a Custom Design Package?
          </h3>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Every brand has unique requirements. Reach out to request a tailored quote and consultation for your specific deliverables.
          </p>
          <div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-gray-950 font-semibold text-xs uppercase tracking-wider hover:bg-gray-100 transition-all shadow-lg"
            >
              <span>Request Custom Proposal</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
