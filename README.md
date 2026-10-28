# Sistema de Ventas — Frontend

Aplicación móvil (Android, iOS y web mediante Expo) para el agente de ventas.
Digitaliza el flujo de puntos de venta: Cardex, pedido recomendado, nota de
crédito, beneficios y formalización del pedido.

Este repositorio contiene **solo el cliente**. La API REST vive en su propio
repositorio y es la autoridad de validación y persistencia.

## Requisitos

- Node.js 20.19 o superior
- pnpm 11
- Expo Go en el dispositivo, o un emulador de Android/iOS

## Puesta en marcha

```bash
pnpm install
cp .env.example .env   # ajustar EXPO_PUBLIC_API_URL
pnpm start
```

## Comandos

| Comando          | Descripción                                     |
| ---------------- | ----------------------------------------------- |
| `pnpm start`     | Inicia el servidor de desarrollo de Expo        |
| `pnpm android`   | Abre la app en Android                          |
| `pnpm ios`       | Abre la app en iOS (requiere macOS)             |
| `pnpm web`       | Abre la app en el navegador                     |
| `pnpm lint`      | ESLint                                          |
| `pnpm format`    | Formatea con Prettier                           |
| `pnpm typecheck` | Verificación de tipos                           |
| `pnpm test`      | Pruebas con Jest + React Native Testing Library |
| `pnpm doctor`    | Diagnóstico del proyecto (expo-doctor)          |

## Estructura

Organización por capacidad de negocio (screaming architecture): el nombre de la
carpeta dice qué hace el sistema, no qué framework usa.

```text
src/
├── shell/                  # Armazón de composición: providers y navegación global
│   ├── navigation/         # Root stack: solo destinos de primer nivel
│   └── providers/
├── features/               # Una carpeta por capacidad del negocio
│   └── dashboard/          # Módulo de referencia con la anatomía completa
│       ├── screens/
│       └── index.ts        # API pública del módulo
├── shared/                 # Transversal a varios módulos, sin reglas de negocio
│   ├── api/                # Cliente HTTP y error normalizado
│   ├── colors/             # Paleta de colores
│   ├── config/             # Variables de entorno validadas
│   ├── lib/                # Utilidades (QueryClient)
│   ├── storage/            # Almacenamiento seguro
│   ├── theme/              # Tokens de diseño (spacing, radius, typography; re-exporta colors)
│   └── ui/                 # Componentes base
└── test/                   # Helpers de prueba
```

## Anatomía de un módulo

Todo módulo vive en `src/features/<capacidad>/` y sigue esta anatomía.
`features/dashboard` es el **módulo de referencia**: mantiene todas las carpetas
creadas con un `.gitkeep` para que el esqueleto sea visible. Al crear un módulo
nuevo se copian las carpetas que ese módulo realmente usa, y el `.gitkeep` se
borra en cuanto la carpeta recibe su primer archivo.

```text
src/features/<capacidad>/
├── api/          # Funciones de request y hooks de TanStack Query del módulo
├── components/   # Componentes propios del módulo (no se reutilizan fuera)
├── errors/       # Errores de regla de negocio del módulo
├── hooks/        # Hooks de estado y comportamiento de UI
├── routes/       # Solo si el módulo tiene un flujo propio de varias pantallas
├── schemas/      # Esquemas zod de validación del módulo
├── screens/      # Pantallas y su composición
├── store/        # Solo si hay estado local compartido dentro del módulo
├── types/        # Tipos del dominio del módulo
├── utils/        # Funciones puras y cálculos del módulo
└── index.ts      # API pública: lo único que se importa desde fuera
```

### Reglas

1. **`index.ts` es la frontera.** Desde otro módulo o desde `src/shell` se importa
   `@/features/<capacidad>`, nunca una ruta interna como
   `@/features/<capacidad>/screens/...`.
2. **`api/` es estado de servidor.** Requests + hooks de TanStack Query. El
   estado del servidor no se copia a `store/`.
3. **`store/` es el último recurso.** Solo para estado local compartido entre
   pantallas del módulo. Si el estado viene del backend, va en `api/`.
4. **`utils/` concentra las reglas de negocio puras** (nota de crédito, ahorro,
   utilidad, cantidad recomendada). Funciones sin React, sin red y sin
   persistencia: se prueban directo.
5. **`errors/` es para violaciones de regla de negocio.** Los errores de
   transporte (HTTP, red, timeout) viven en `shared/api/ApiError`.
6. **`shared/` se llena en el segundo consumidor.** Algo se mueve a `shared/`
   cuando dos módulos lo necesitan de verdad, no antes.
7. **Los nombres de módulo son del negocio**: `auth`, `points-of-sale`,
   `products`, `cardex`, `orders`. No `utils2`, no `common`, no `misc`.

### `src/shell/navigation` vs `src/features/<capacidad>/routes`

Son dos cosas distintas y por eso no comparten nombre:

- **`src/shell/navigation/`** es la navegación de la aplicación: el
  `NavigationContainer`, el root stack, el deep linking y el
  `RootStackParamList`. Existe una sola vez.
- **`src/features/<capacidad>/routes/`** es opcional y describe cómo se navega
  _dentro_ de un módulo. Exporta el navigator del módulo y su propio param list
  (por ejemplo `routes/OrdersStack.tsx` con `OrdersStack` y
  `OrdersStackParamList`).

Reglas:

1. Una pantalla suelta se registra directamente en el root stack: no se agrega
   un navigator en `routes/` para envolver una sola pantalla.
2. `routes/` aparece cuando el módulo tiene un flujo propio de varios pasos
   (el Cardex es el caso típico: análisis → propuesta → beneficios →
   confirmación).
3. El módulo exporta su navigator desde su `index.ts`; el root stack lo consume
   sin mirar dentro de `routes/`.
4. No se anidan navigators sin motivo: cada nivel extra complica el header, los
   gestos y el deep linking.

## Por qué `src/shell` y no `src/app`

La carpeta de composición raíz se llamaba `src/app` y **Expo la interpretaba como
el directorio de rutas de Expo Router**. Al arrancar el servidor imprimía:

```text
Using src/app as the root directory for Expo Router.
```

La app navega con `@react-navigation`, así que nada se rompía: `expo-router` no
está instalado. El problema era la colisión silenciosa. Expo y sus herramientas
tratan `app/` como una convención reservada, de modo que cualquier archivo que
cayera ahí podía ser leído como una ruta, y el día que alguien agregara
`expo-router` el diagnóstico habría sido caro.

`shell` describe lo que la carpeta realmente es: el armazón que compone la
aplicación (providers + navegación), no un conjunto de rutas. Además deja libre
`app/` para la convención de Expo si alguna vez se usa.

## Decisiones pendientes

- Fórmulas de nota de crédito, utilidad y cantidad recomendada (ver `docs/`).
- Herramienta de generación de PDF.
