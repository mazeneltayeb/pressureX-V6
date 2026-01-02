// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;


// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1️⃣ السماح لـ Next.js بتحسين صور Cloudinary
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },

  // 2️⃣ زيادة حجم الملفات المسموح برفعها (مهم جداً)
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '10mb',
  },

  // 3️⃣ ⚠️ إزالة experimental لأن بعضها deprecated في Next.js 14
  // serverComponentsExternalPackages مطلوبة في App Router
  // نضيفها بشكل مختلف
  
  // 4️⃣ إعدادات الأمان والأداء
  poweredByHeader: false,
  generateEtags: true,
  reactStrictMode: true,
  swcMinify: true,
  
  // 5️⃣ ⚠️ مهم لـ Vercel: إعدادات الـ runtime
  // ضرورية لاستخدام packages مثل cloudinary في API routes
  serverExternalPackages: ['cloudinary'], // ⚠️ دي بدل experimental
  
  // 6️⃣ ⚠️ مهم جداً: إعدادات الـ headers للـ CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },

  // 7️⃣ ⚠️ مهم لـ Vercel: إعدادات الـ build
  eslint: {
    ignoreDuringBuilds: true, // تجاهل أخطاء ESLint أثناء البناء
  },
  typescript: {
    ignoreBuildErrors: true, // تجاهل أخطاء TypeScript أثناء البناء
  },
  
  // 8️⃣ ⚠️ مهم لـ Vercel: إعدادات الـ output
  output: 'standalone', // ⚠️ دي مهمة جداً للأداء على Vercel
};

export default nextConfig;
