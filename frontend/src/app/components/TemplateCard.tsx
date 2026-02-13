// app/components/TemplateCard.tsx - SUPER COLORFUL!
export default function TemplateCard({ template }: { template: any }) {
  // Vibrant color combinations
  const vibrantColors = [
    "from-pink-500 via-red-500 to-yellow-500",
    "from-green-400 via-cyan-500 to-blue-500",
    "from-purple-500 via-pink-500 to-red-500",
    "from-yellow-400 via-orange-500 to-red-500",
    "from-indigo-500 via-purple-500 to-pink-500",
    "from-blue-400 via-green-500 to-teal-500",
    "from-red-500 via-yellow-500 to-green-500",
    "from-fuchsia-500 via-purple-600 to-indigo-600",
  ];
  
  // Animated gradient colors
  const animatedGradients = [
    "bg-gradient-to-r animate-gradient-x",
    "bg-gradient-to-br animate-gradient-xy",
  ];
  
  const colorIndex = template._id 
    ? template._id.charCodeAt(0) % vibrantColors.length 
    : Math.floor(Math.random() * vibrantColors.length);
  
  const gradient = vibrantColors[colorIndex];

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden h-full flex flex-col relative">
      {/* Animated background effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-r ${gradient}`}></div>
      
      {/* Colorful Header with Animation */}
      <div className={`bg-gradient-to-r ${gradient} p-6 text-white relative overflow-hidden`}>
        {/* Animated circles */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-6 -mt-6"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-6 -mb-6"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex items-center justify-between relative">
          <div className="bg-white/30 p-3 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-xs bg-white/30 px-3 py-1.5 rounded-full backdrop-blur-sm font-semibold">
            📄 FREE TEMPLATE
          </span>
        </div>
        
        <h3 className="font-bold text-xl text-white mt-4 mb-1 line-clamp-2 min-h-[3.5rem] drop-shadow-lg">
          {template.name || "Scholarship Application Template"}
        </h3>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col bg-white">
        <p className="text-gray-600 mb-4 line-clamp-3 flex-1 text-sm leading-relaxed">
          {template.description || "Ready-to-use professionally designed template for scholarship applications. Easy to edit and customize."}
        </p>

        {/* Features List */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center text-xs text-gray-500">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Microsoft Word Format
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Fully Editable
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-5m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Includes Guidelines
          </div>
        </div>

        {/* Download Button - Super Colorful */}
        <a
          href={template.fileUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-3 bg-gradient-to-r ${gradient} text-white px-5 py-3.5 rounded-xl hover:opacity-90 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl transform group-hover:scale-105 relative overflow-hidden`}
        >
          {/* Shine effect */}
          <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Template Now
        </a>

        {/* File info */}
        {template.fileUrl && (
          <div className="mt-4 text-xs text-gray-400 flex items-center gap-1.5 bg-gray-50 p-2 rounded-lg">
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span className="truncate">{template.fileUrl.split('/').pop() || 'template.docx'}</span>
            <span className="ml-auto text-gray-400">~245 KB</span>
          </div>
        )}
      </div>
      
      {/* Decorative corner */}
      <div className={`absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tr ${gradient} opacity-10 rounded-tl-3xl`}></div>
    </div>
  );
}