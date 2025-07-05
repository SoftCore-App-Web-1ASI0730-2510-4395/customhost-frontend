workspace {

  model {
    user = person "Usuario" "Usuario final del sistema"

    softwareSystem "Hotel Management System" "Sistema de gestión hotelera" {
      container vueFrontend "Frontend (Vue.js)" "Aplicación web construida con Vue.js" "JavaScript, Vue.js" {
        uses publicApi "Consume APIs REST" "HTTPS/JSON"
      }
      container publicApi "Public API" "Componentes y utilidades compartidas (auth, layout, notificaciones)" "C#, .NET" {
        uses database "Lee/Escribe datos" "JDBC/MySQL"
      }
      container iam "IAM Service" "Gestión de usuarios, roles y permisos" "C#, .NET" {
        uses publicApi "Usa utilidades generales"
        uses database "Lee/Escribe datos de autenticación"
      }
      container crm "CRM Service" "Gestión de clientes y su historial" "C#, .NET" {
        uses publicApi
        uses database "Lee/Escribe datos de clientes"
      }
      container rooms "Rooms Service" "Gestión de habitaciones, tarifas y disponibilidad" "C#, .NET" {
        uses publicApi
        uses database "Lee/Escribe datos de habitaciones"
      }
      container guestExperience "Guest Experience Service" "Solicitudes de servicio, check‐in/out y feedback" "C#, .NET" {
        uses crm "Obtiene datos de huéspedes"
        uses rooms "Obtiene estado de habitación"
        uses publicApi
        uses database "Lee/Escribe datos de experiencia"
      }
      container staffManagement "Staff Management Service" "Administración de personal y turnos" "C#, .NET" {
        uses crm "Obtiene datos de huéspedes VIP"
        uses rooms "Obtiene información de habitaciones"
        uses publicApi
        uses database "Lee/Escribe datos de personal"
      }
      container swaggerUi "Swagger UI" "Documentación y pruebas de APIs" "Swagger/OpenAPI" {
        uses publicApi "Describe y prueba los endpoints"
      }
      container database "MySQL Database" "Base de datos principal" "MySQL"
    }

    user -> vueFrontend "Usa la interfaz"
    vueFrontend -> publicApi "Llama a"
    publicApi -> iam "Autentica/Autoriza"
    publicApi -> crm "Gestiona clientes"
    publicApi -> rooms "Gestiona habitaciones"
    publicApi -> guestExperience "Gestiona experiencia"
    publicApi -> staffManagement "Gestiona personal"

    crm -> database
    rooms -> database
    guestExperience -> database
    staffManagement -> database
    iam -> database
  }

  views {
    systemContext "Hotel Management System - Contexto" {
      include *
      autolayout lr
    }
    container "Hotel Management System - Contenedores" {
      include *
      autolayout lr
    }
    theme default
  }
}
