import prisma from '../config/database';

async function checkDatabase() {
  try {
    console.log('🔍 Verificando conexão com banco de dados...');
    
    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Conexão com banco de dados estabelecida');

    // Check tables
    const userCount = await prisma.user.count();
    console.log(`✅ Tabela Users: ${userCount} usuários`);

    const streamCount = await prisma.stream.count();
    console.log(`✅ Tabela Streams: ${streamCount} streams`);

    const recordingCount = await prisma.recording.count();
    console.log(`✅ Tabela Recordings: ${recordingCount} gravações`);

    // Check admin user
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@multiview.com' },
    });

    if (admin) {
      console.log('✅ Usuário admin encontrado');
    } else {
      console.log('⚠️  Usuário admin não encontrado - execute: npm run db:seed');
    }

    console.log('\n✨ Banco de dados está OK!');
  } catch (error) {
    console.error('❌ Erro ao verificar banco de dados:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
