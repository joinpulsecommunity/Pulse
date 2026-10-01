/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: { unoptimized: true },
  // The Tina editor lives at /admin (it's a static page in public/admin)
  async rewrites() {
    return [
      { source: "/admin", destination: "/admin/index.html" },
      { source: "/admin/", destination: "/admin/index.html" },
    ];
  },
};
