// app/components/ScholarshipCard.tsx
export default function ScholarshipCard({ scholarship }: { scholarship: any }) {
  // Ultra-vibrant gradient combinations
  const gradients = [
    "from-blue-600 via-indigo-600 to-purple-600",
    "from-emerald-500 via-teal-500 to-cyan-600",
    "from-orange-500 via-red-500 to-pink-600",
    "from-fuchsia-500 via-purple-600 to-violet-600",
    "from-amber-500 via-orange-600 to-red-600",
    "from-lime-500 via-green-600 to-emerald-600",
    "from-rose-500 via-pink-600 to-fuchsia-600",
    "from-sky-500 via-blue-600 to-indigo-700",
    "from-violet-600 via-purple-600 to-fuchsia-600",
  ];

  // Animated gradient backgrounds
  const animatedGradients = [
    "bg-gradient-to-r animate-gradient-x",
    "bg-gradient-to-br animate-gradient-xy",
  ];

  // Pattern overlays
  const patterns = [
    "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]",
    "bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))]",
  ];

  const gradientIndex = scholarship._id 
    ? scholarship._id.charCodeAt(0) % gradients.length 
    : Math.floor(Math.random() * gradients.length);
  
  const gradient = gradients[gradientIndex];
  const animatedGradient = animatedGradients[gradientIndex % animatedGradients.length];
  const pattern = patterns[gradientIndex % patterns.length];

  return (
    <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden h-full flex flex-col relative">
      {/* Animated background glow effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-r ${gradient} blur-xl`}></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-700"></div>
      
      {/* Image/Header Section - Ultra Colorful */}
      <div className={`relative h-56 w-full overflow-hidden bg-gradient-to-br ${gradient} ${animatedGradient} ${pattern}`}>
        {/* Animated overlay */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
        
        {/* Decorative circles */}
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/60 rounded-full"></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-white/40 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-white/50 rounded-full"></div>

        {scholarship.image ? (
          // If image exists, show it with overlay
          <>
            <img
              src={scholarship.image}
              alt={scholarship.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-60 mix-blend-overlay`}></div>
          </>
        ) : (
          // If no image, show spectacular gradient design
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
            {/* Animated icon */}
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-white/20 p-5 rounded-2xl backdrop-blur-sm transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
            </div>
            
            {/* Country/University name with animation */}
            <div className="text-center">
              <span className="inline-block px-4 py-1.5 bg-white/30 backdrop-blur-sm rounded-full text-sm font-semibold mb-2">
                🌍 {scholarship.country || "International"}
              </span>
              <h3 className="text-lg font-bold opacity-90 line-clamp-2">
                {scholarship.university || "Top University"}
              </h3>
            </div>
          </div>
        )}

        {/* Floating badges - Ultra colorful */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <span className={`px-4 py-1.5 bg-gradient-to-r ${gradient} text-white rounded-full text-xs font-bold shadow-lg backdrop-blur-sm flex items-center gap-1`}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            {scholarship.degree || "All Levels"}
          </span>
          
          {scholarship.deadline && (
            <span className="px-4 py-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white rounded-full text-xs font-bold shadow-lg backdrop-blur-sm flex items-center gap-1 animate-pulse">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {new Date(scholarship.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>

        {/* Featured ribbon */}
        <div className="absolute top-6 left-0">
          <div className={`bg-gradient-to-r ${gradient} text-white px-4 py-1.5 text-xs font-bold shadow-lg transform -skew-x-12`}>
            ✨ FEATURED
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col bg-white/90 backdrop-blur-sm">
        {/* Title with gradient */}
        <h3 className={`text-xl font-bold mb-3 bg-gradient-to-r ${gradient} bg-clip-text text-transparent line-clamp-2 min-h-[3.5rem]`}>
          {scholarship.title || "Scholarship Opportunity"}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
          {scholarship.description || "A prestigious fully-funded scholarship opportunity for international students to pursue higher education abroad."}
        </p>

        {/* Benefits Preview - Colorful */}
        {scholarship.benefits && (
          <div className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-1 rounded-lg">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-green-700">BENEFITS</span>
            </div>
            <p className="text-xs text-gray-700 line-clamp-2">
              {scholarship.benefits}
            </p>
          </div>
        )}

        {/* Requirements Preview - Colorful */}
        {scholarship.requirements && (
          <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-1 rounded-lg">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-5m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-blue-700">REQUIREMENTS</span>
            </div>
            <p className="text-xs text-gray-700 line-clamp-2">
              {scholarship.requirements}
            </p>
          </div>
        )}

        {/* Action Buttons - Super Colorful */}
        <div className="flex flex-wrap gap-3 mt-auto pt-4 border-t border-gray-100">
          <a
            href={scholarship.officialLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 bg-gradient-to-r ${gradient} text-white text-center px-4 py-3 rounded-xl hover:opacity-90 transition-all duration-300 text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 relative overflow-hidden group/btn`}
          >
            <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Apply Now
          </a>
          
          {scholarship.youtubeLink ? (
            <a
              href={scholarship.youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-red-600 via-red-500 to-pink-600 text-white text-center px-4 py-3 rounded-xl hover:opacity-90 transition-all duration-300 text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 relative overflow-hidden group/btn"
            >
              <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Watch Guide
            </a>
          ) : (
            <button className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-center px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 opacity-80 cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Coming Soon
            </button>
          )}
        </div>
      </div>
      
      {/* Decorative corner gradient */}
      <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl ${gradient} opacity-10 rounded-tl-3xl pointer-events-none`}></div>
    </div>
  );
}