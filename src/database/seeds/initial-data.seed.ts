import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../../components/usuarios/entities/usuario.entity';
import { Postulacion } from '../../components/postulaciones/entities/postulacion.entity';
import { Requisito } from '../../components/requisitos/entities/requisito.entity';
import { Formulario } from '../../components/formularios/entities/formulario.entity';

export async function seedInitialData(dataSource: DataSource) {
  console.log('🌱 Iniciando seeds de datos iniciales...');

  // Crear usuario administrador
  const usuarioRepository = dataSource.getRepository(Usuario);
  const adminExists = await usuarioRepository.findOne({
    where: { email: 'admin@municipalidad.cl' }
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = usuarioRepository.create({
      email: 'admin@municipalidad.cl',
      password: hashedPassword,
      nombre: 'Administrador Sistema',
      rol: 'admin',
      estado: 'activo'
    });
    await usuarioRepository.save(admin);
    console.log('✅ Usuario administrador creado');
  }

  // Crear postulaciones de ejemplo
  const postulacionRepository = dataSource.getRepository(Postulacion);
  const postulacionesCount = await postulacionRepository.count();

  if (postulacionesCount === 0) {
    const postulaciones = [
      {
        titulo: 'Analista de Sistemas',
        descripcion: 'Se requiere analista de sistemas con experiencia en desarrollo web',
        fechaVencimiento: new Date('2024-02-15'),
        estado: 'activa' as const
      },
      {
        titulo: 'Contador Senior',
        descripcion: 'Contador con experiencia mínima de 5 años en contabilidad pública',
        fechaVencimiento: new Date('2024-02-10'),
        estado: 'activa' as const
      },
      {
        titulo: 'Secretaria Administrativa',
        descripcion: 'Secretaria con conocimientos en gestión documental',
        fechaVencimiento: new Date('2024-01-20'),
        estado: 'vencida' as const
      }
    ];

    for (const postulacionData of postulaciones) {
      const postulacion = postulacionRepository.create(postulacionData);
      await postulacionRepository.save(postulacion);
    }
    console.log('✅ Postulaciones de ejemplo creadas');
  }

  // Crear requisitos de ejemplo
  const requisitoRepository = dataSource.getRepository(Requisito);
  const requisitosCount = await requisitoRepository.count();

  if (requisitosCount === 0) {
    const requisitos = [
      {
        nombre: 'Certificado de Antecedentes',
        descripcion: 'Certificado de antecedentes penales emitido por el Registro Civil',
        tipo: 'certificado' as const,
        obligatorio: true,
        activo: true
      },
      {
        nombre: 'Título Profesional',
        descripcion: 'Título universitario o técnico relacionado al cargo',
        tipo: 'titulo' as const,
        obligatorio: true,
        activo: true
      },
      {
        nombre: 'Curriculum Vitae',
        descripcion: 'CV actualizado con experiencia laboral',
        tipo: 'documento' as const,
        obligatorio: true,
        activo: true
      },
      {
        nombre: 'Certificado de Experiencia',
        descripcion: 'Certificado de experiencia laboral mínima de 2 años',
        tipo: 'experiencia' as const,
        obligatorio: true,
        activo: true
      },
      {
        nombre: 'Carnet de Identidad',
        descripcion: 'Copia de cédula de identidad vigente',
        tipo: 'documento' as const,
        obligatorio: true,
        activo: true
      },
      {
        nombre: 'Certificado de Salud',
        descripcion: 'Certificado médico de aptitud para el cargo',
        tipo: 'certificado' as const,
        obligatorio: false,
        activo: true
      }
    ];

    for (const requisitoData of requisitos) {
      const requisito = requisitoRepository.create(requisitoData);
      await requisitoRepository.save(requisito);
    }
    console.log('✅ Requisitos de ejemplo creados');
  }

  // Crear formularios de ejemplo
  const formularioRepository = dataSource.getRepository(Formulario);
  const formulariosCount = await formularioRepository.count();

  if (formulariosCount === 0) {
    const formularios = [
      {
        cargo: 'Ingeniero Civil Geotécnico',
        fechaInicio: new Date('2025-05-13'),
        fechaTermino: new Date('2025-05-20'),
        estado: 'Activo' as const
      },
      {
        cargo: 'Ingeniero de Soporte - Experiencia con ERP Odoo',
        fechaInicio: new Date('2025-05-13'),
        fechaTermino: new Date('2025-05-21'),
        estado: 'Activo' as const
      },
      {
        cargo: 'Ingeniero/a Comercial Freelance',
        fechaInicio: new Date('2025-01-13'),
        fechaTermino: new Date('2025-02-21'),
        estado: 'Inactivo' as const
      }
    ];

    for (const formularioData of formularios) {
      const formulario = formularioRepository.create(formularioData);
      await formularioRepository.save(formulario);
    }
    console.log('✅ Formularios de ejemplo creados');
  }

  console.log('🎉 Seeds completados exitosamente');
} 