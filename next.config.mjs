/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // 启用静态导出（VPS 部署用）
  trailingSlash: true,       // URL 加 / 适配 Nginx
  images: { unoptimized: true }, // 静态导出必须关图片优化
  reactStrictMode: true,
};

export default nextConfig;