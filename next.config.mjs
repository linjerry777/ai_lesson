

const nextConfig = {
  outputFileTracingIncludes: {
    '/api/course-resources': ['./course-resources/codex-remotion-lab.zip'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
}

export default nextConfig
