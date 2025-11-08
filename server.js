require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const connectDB = require('./config/database');
const errorHandler = require('./src/middleware/error');

// Inicializar la aplicación Express
const app = express();

// Conectar a la base de datos
connectDB();

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para cookies
app.use(cookieParser());

// Middleware para subir archivos
app.use(fileupload());

// Configuración de CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
  // Agrega aquí tus dominios de producción
  // 'https://tudominio.com',
  // 'https://www.tudominio.com'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir solicitudes sin origen (como aplicaciones móviles o curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'La política de CORS para este sitio no permite acceso desde el origen especificado.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Habilita el envío de credenciales (cookies, encabezados HTTP)
  optionsSuccessStatus: 200, // Algunos navegadores antiguos (IE11, varios SmartTVs) fallan con 204
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Allow-Headers',
    'X-Access-Token',
    'X-Refresh-Token'
  ],
  exposedHeaders: [
    'Content-Range',
    'X-Content-Range',
    'X-Total-Count',
    'Content-Disposition',
    'X-Refresh-Token',
    'X-Access-Token'
  ],
  maxAge: 86400 // 24 horas
};

// Aplicar CORS
app.use(cors(corsOptions));

// Manejar preflight requests
app.options('*', cors(corsOptions));

// Configuración de sesión
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60, // 14 días
      autoRemove: 'native',
    }),
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 días
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  })
);

// Sanitizar datos para prevenir inyección NoSQL
app.use(mongoSanitize());

// Establecer cabeceras de seguridad
app.use(helmet());

// Prevenir ataques XSS
app.use(xss());

// Limitar la tasa de solicitudes
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 100, // límite de 100 solicitudes por ventana
});
app.use(limiter);

// Prevenir la contaminación de parámetros HTTP
app.use(hpp());

// Registrar solicitudes HTTP en modo desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Establecer carpeta estática
app.use(express.static(path.join(__dirname, 'public')));

// Configuración del motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Variables globales
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash ? req.flash('success_msg') : [];
  res.locals.error_msg = req.flash ? req.flash('error_msg') : [];
  res.locals.error = req.flash ? req.flash('error') : [];
  next();
});

// Rutas de la API
app.use('/api/v1', require('./src/routes'));

// Ruta de inicio
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Artesanica - Inicio',
  });
});

// Middleware para manejar errores 404
app.use((req, res, next) => {
  res.status(404).render('error/404', {
    title: 'Página no encontrada',
    message: 'La página que buscas no existe',
  });
});

// Middleware para manejar errores
app.use(errorHandler);

// Configuración del puerto
const HTTP_PORT = process.env.HTTP_PORT || 5000;
const HTTPS_PORT = process.env.HTTPS_PORT || 5443;

// Importar módulos para HTTPS
const https = require('https');
const fs = require('fs');

// Ruta a los certificados SSL
const sslDir = path.join(__dirname, 'ssl');
const privateKeyPath = path.join(sslDir, 'private.key');
const certificatePath = path.join(sslDir, 'certificate.crt');

// Verificar si los certificados existen
const useHttps = fs.existsSync(privateKeyPath) && fs.existsSync(certificatePath);

// Función para iniciar servidor HTTP (redirige a HTTPS)
const startHttpServer = () => {
  const httpApp = express();
  
  // Redirigir todo el tráfico HTTP a HTTPS
  httpApp.get('*', (req, res) => {
    res.redirect(`https://${req.headers.host}${req.url}`);
  });
  
  return httpApp.listen(HTTP_PORT, () => {
    console.log(`Servidor HTTP redirigiendo a HTTPS en el puerto ${HTTP_PORT}`.yellow);
  });
};

// Función para iniciar servidor HTTPS
const startHttpsServer = () => {
  try {
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    const certificate = fs.readFileSync(certificatePath, 'utf8');
    const credentials = { key: privateKey, cert: certificate };

    return https.createServer(credentials, app).listen(HTTPS_PORT, () => {
      console.log(
        `Servidor HTTPS ejecutándose en modo ${process.env.NODE_ENV} en el puerto ${HTTPS_PORT}`.green.bold
      );
      console.log(`Accede a la aplicación en: https://localhost:${HTTPS_PORT}`.cyan.underline);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor HTTPS:'.red.bold, error.message);
    console.log('Iniciando solo servidor HTTP...'.yellow);
    return null;
  }
};

// Iniciar servidores
let httpServer, httpsServer;

// Función para cerrar todos los servidores
const closeServers = () => {
  if (httpServer) {
    httpServer.close(() => {
      console.log('Servidor HTTP cerrado'.gray);
    });
  }
  if (httpsServer) {
    httpsServer.close(() => {
      console.log('Servidor HTTPS cerrado'.gray);
    });
  }
};

// Manejador de cierre de la aplicación
const gracefulShutdown = () => {
  console.log('\nCerrando servidores...'.yellow);
  closeServers();
  process.exit(0);
};

// Manejadores de señales del sistema
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Manejar excepciones no capturadas
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error no manejado: ${err.message}`.red);
  console.error(err.stack);
  closeServers();
  process.exit(1);
});

// Iniciar los servidores según la configuración
if (useHttps) {
  // En producción, inicia ambos servidores (HTTP redirige a HTTPS)
  if (process.env.NODE_ENV === 'production') {
    httpServer = startHttpServer();
  }
  httpsServer = startHttpsServer();
  
  // Si el servidor HTTPS no se pudo iniciar, inicia HTTP
  if (!httpsServer) {
    startHttpServer();
  }
} else {
  // En desarrollo o sin certificados, inicia solo HTTP
  httpServer = app.listen(HTTP_PORT, () => {
    console.log(
      `Servidor HTTP ejecutándose en modo ${process.env.NODE_ENV} en el puerto ${HTTP_PORT}`.yellow.bold
    );
    console.log('NOTA: El servidor se está ejecutando en modo HTTP. Para HTTPS, genera certificados.'.yellow);
    console.log('Ejecuta `node scripts/generate-cert.js` para generar certificados de desarrollo.'.yellow);
  });
}
