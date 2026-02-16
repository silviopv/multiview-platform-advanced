import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@multiview.com' },
    update: {},
    create: {
      email: 'admin@multiview.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN',
      language: 'pt-BR',
    },
  });

  console.log('Admin user created:', admin.email);

  const demoPassword = await bcrypt.hash('demo123', 12);
  const demo = await prisma.user.upsert({
    where: { email: 'demo@multiview.com' },
    update: {},
    create: {
      email: 'demo@multiview.com',
      name: 'Usuário Demo',
      password: demoPassword,
      role: 'USER',
      language: 'pt-BR',
    },
  });

  console.log('Demo user created:', demo.email);

  // Create sample streams for demo user
  const sampleStreams = [
    { name: 'Big Buck Bunny', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', protocol: 'HLS' as const },
    { name: 'Sintel', url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8', protocol: 'HLS' as const },
    { name: 'Tears of Steel', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8', protocol: 'HLS' as const },
    { name: 'Test Pattern', url: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8', protocol: 'HLS' as const },
  ];

  for (let i = 0; i < sampleStreams.length; i++) {
    await prisma.stream.upsert({
      where: { id: `seed-stream-${i + 1}` },
      update: {},
      create: {
        id: `seed-stream-${i + 1}`,
        name: sampleStreams[i].name,
        url: sampleStreams[i].url,
        protocol: sampleStreams[i].protocol,
        userId: demo.id,
        order: i,
        tags: ['demo', 'sample'],
      },
    });
  }

  console.log('Sample streams created');

  // Create default layout
  await prisma.layout.create({
    data: {
      name: 'Layout 2x2 Padrão',
      grid: '2x2',
      userId: demo.id,
      isDefault: true,
      items: {
        create: [
          { position: 0, row: 0, col: 0, streamId: 'seed-stream-1', audioOn: true },
          { position: 1, row: 0, col: 1, streamId: 'seed-stream-2' },
          { position: 2, row: 1, col: 0, streamId: 'seed-stream-3' },
          { position: 3, row: 1, col: 1, streamId: 'seed-stream-4' },
        ],
      },
    },
  });

  console.log('Default layout created');
  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
