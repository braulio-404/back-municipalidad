import { DataSource } from 'typeorm';
import { pgDataSourceOptions } from '../../config/database.config';
import { seedInitialData } from './initial-data.seed';

async function runSeeds() {
  const dataSource = new DataSource(pgDataSourceOptions);
  
  try {
    await dataSource.initialize();
    console.log('📦 Conexión a la base de datos establecida');
    
    await seedInitialData(dataSource);
    
    console.log('✅ Todos los seeds ejecutados correctamente');
  } catch (error) {
    console.error('❌ Error ejecutando seeds:', error);
  } finally {
    await dataSource.destroy();
    console.log('🔌 Conexión a la base de datos cerrada');
  }
}

runSeeds(); 