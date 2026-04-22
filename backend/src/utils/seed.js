import 'dotenv/config';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import mongoose from 'mongoose';
import User from '../models/User.model.js';
import Profile from '../models/Profile.model.js';
import Project from '../models/Project.model.js';
import Skill from '../models/Skill.model.js';

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // ── Admin User ──────────────────────────────────────
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      await User.create({ email: 'admin@papai.dev', password: 'Admin@1234', role: 'admin' });
      console.log('✅ Admin user created — email: admin@papai.dev | password: Admin@1234');
    } else {
      console.log('⏭  Admin already exists, skipping...');
    }

    // ── Profile ─────────────────────────────────────────
    await Profile.deleteMany({});
    await Profile.create({
      name: 'Papai',
      title: 'Full Stack Developer',
      bio: "Hi, I'm Papai — a passionate full-stack developer crafting modern web experiences. I specialize in building scalable applications with Angular, Node.js, and MongoDB. Focused on clean architecture and production-ready systems.",
      location: 'India',
      email: 'papai@dev.com',
      github: 'https://github.com/papai',
      linkedin: 'https://linkedin.com/in/papai',
      twitter: 'https://twitter.com/papai_dev',
      heroTagline: 'Building things that live on the internet.',
      availableForWork: true,
      yearsOfExperience: 2,
    });
    console.log('✅ Profile seeded');

    // ── Projects ─────────────────────────────────────────
    await Project.deleteMany({});
    await Project.insertMany([
      {
        title: 'Task Flow Pro',
        description: 'A full-stack task management application with real-time updates and drag-and-drop kanban boards.',
        longDescription: 'Task Flow Pro is a production-grade project management tool built with Angular and Node.js. Features include real-time collaboration via Socket.io, drag-and-drop kanban boards, team workspaces, and deadline tracking.',
        techStack: ['Angular', 'Node.js', 'MongoDB', 'Socket.io', 'Tailwind CSS'],
        githubUrl: 'https://github.com/papai/task-flow-pro',
        liveUrl: 'https://taskflowpro.vercel.app',
        featured: true,
        visible: true,
        order: 1,
        category: 'fullstack',
      },
      {
        title: 'ShopEase API',
        description: 'A scalable RESTful e-commerce backend with Stripe payment integration and Cloudinary media management.',
        longDescription: 'ShopEase API is a robust e-commerce backend built with Express and MongoDB. Includes product catalog, cart management, order processing, Stripe checkout, and Cloudinary-based image uploads with full admin control.',
        techStack: ['Node.js', 'Express', 'MongoDB', 'Stripe', 'Cloudinary', 'JWT'],
        githubUrl: 'https://github.com/papai/shopease-api',
        liveUrl: 'https://shopease-api.onrender.com/api-docs',
        featured: true,
        visible: true,
        order: 2,
        category: 'backend',
      },
      {
        title: 'DevConnect',
        description: 'A developer networking platform with JWT authentication, profiles, and real-time chat.',
        longDescription: 'DevConnect is a LinkedIn-style developer community platform. Features include JWT-secured profiles, follow system, real-time messaging via WebSockets, and a tech-stack based developer discovery system.',
        techStack: ['Angular', 'Node.js', 'MongoDB', 'WebSockets', 'JWT', 'Tailwind CSS'],
        githubUrl: 'https://github.com/papai/devconnect',
        liveUrl: 'https://devconnect.vercel.app',
        featured: true,
        visible: true,
        order: 3,
        category: 'fullstack',
      },
    ]);
    console.log('✅ Projects seeded (3)');

    // ── Skills ───────────────────────────────────────────
    await Skill.deleteMany({});
    await Skill.insertMany([
      // Frontend
      { name: 'Angular', category: 'frontend', level: 90, order: 1 },
      { name: 'TypeScript', category: 'frontend', level: 85, order: 2 },
      { name: 'HTML5 / CSS3', category: 'frontend', level: 95, order: 3 },
      { name: 'Tailwind CSS', category: 'frontend', level: 88, order: 4 },
      { name: 'GSAP', category: 'frontend', level: 75, order: 5 },
      // Backend
      { name: 'Node.js', category: 'backend', level: 88, order: 1 },
      { name: 'Express.js', category: 'backend', level: 85, order: 2 },
      { name: 'REST APIs', category: 'backend', level: 90, order: 3 },
      { name: 'WebSockets', category: 'backend', level: 70, order: 4 },
      // Database
      { name: 'MongoDB', category: 'database', level: 85, order: 1 },
      { name: 'Mongoose', category: 'database', level: 82, order: 2 },
      { name: 'Redis', category: 'database', level: 60, order: 3 },
      // Tools
      { name: 'Git / GitHub', category: 'tools', level: 92, order: 1 },
      { name: 'Docker', category: 'tools', level: 65, order: 2 },
      { name: 'Postman', category: 'tools', level: 88, order: 3 },
      { name: 'Swagger', category: 'tools', level: 80, order: 4 },
    ]);
    console.log('✅ Skills seeded (16)');

    console.log('\n🎉 Database seed complete!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seedData();
