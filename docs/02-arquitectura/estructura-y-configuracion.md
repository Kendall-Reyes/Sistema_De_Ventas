# Estructura, configuración y cómo entender el proyecto

Este documento tiene como objetivo dejar claro cómo está organizado el frontend `Sistema_De_Ventas_Frontend`, qué archivos son clave, cómo está configurado y cómo probarlo.

## 1. Stack tecnológico

| Tecnología | Versión | Uso |
| --- | --- | --- |
| [Expo](https://expo.dev/) | ~58.0.19 | Framework para desarrollo móvil con React Native |
| [React Native](https://reactnative.dev/) | 0.88.0 | UI nativa para Android/iOS/Web |
| [React](https://react.dev/) | 19.3.0 | Librería base para componentes |
| [TypeScript](https://www.typescriptlang.org/) | ~6.0.3 | Tipado estático |
| [Expo Router / React Navigation](https://reactnavigation.org/) | @react-navigation/native ^7.5.1 / native-stack ^7.21.0 | Navegación. Ver nota sobre `src/shell` vs `src/app` |
| [TanStack Query](https://tanstack.com/query) | ^5.105.0 | Gestión de estado de servidor (cache, requests, mutations) |
| [React Hook Form](https://react-hook-form.com/) | ^7.91.0 | Formularios |
| [Zod](https://zod.dev/) | ^4.6.7 | Validación de esquemas y variables de entorno |
| [Expo Secure Store](https://docs.expo.dev/versions/latest/sdk/securestore/ | ~58.0.2 | Almacenamiento seguro (tokens/sesiones) |
| [Jest](https://jestjs.io/) | ^30.5.2 | Pruebas unitarias |
| [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) | ^14.1.0 | Pruebas de componentes |
| [ESLint](https://eslint.org/) | ^9.39.5 | Linting |
| [Prettier](https://prettier.io/) | ^3.9.10 | Formateado |

## 2. Requisitos para correr el proyecto

- **Node.js**: >= 20.19.0
- **pnpm**: 11.1.3 (definido en `packageManager`)
- **Dispositivo**: Expo Go (Android/iOS) o emulador/simulador

## 3. Archivos de configuración clave

| Archivo | Propósito |
| --- | --- |
| `package.json` | Dependencias, scripts, engines y `packageManager`. Punto de partida para entender qué comandos usar. |
| `app.json` / `app.config.*` | Configuración de Expo (nombre, íconos, splash, permisos, etc.). |
| `tsconfig.json` | Configuración de TypeScript. Usa aliases como `@/*` para imports limpios. |
| `eslint.config.*` / `.eslintrc.*` | Reglas de linting (config base de Expo + prettier). |
| `.prettierrc` / `.prettierignore` | Formateo con Prettier. |
| `jest.config.*` / `jest.setup.*` | Configuración de Jest con `jest-expo` y RTL. |
| `babel.config.*` | Configuración de Babel/Metro. |
| `.env.example` | Plantilla de variables de entorno. Copiar a `.env` y ajustar `EXPO_PUBLIC_API_URL`. |
| `index.ts` | Entry point de la app (usado por Expo/Metro). |

## 4. Estructura de carpetas

La organización sigue **screaming architecture**.

```text
Sistema_De_Ventas_Frontend/
├── assets/                 # Íconos, imágenes y recursos estáticos
│   ├── icon.png
│   ├── favicon.png
│   ├── android-icon-*.png
│   └── ...
├── docs/                   # Documentación del proyecto
│   ├── 01-contexto/        # Contexto de negocio, objetivos, alcance
│   └── 02-arquitectura/    # Este documento
├── src/
│   ├── shell/              # Armazón de composición: providers + navegación global
│   │   ├── navigation/     # Root stack, configuración de navegación
│   │   └── providers/      # Providers globales (QueryClient, Theme, etc.)
│   ├── features/           # Módulos por capacidad de negocio
│   │   └── dashboard/      # Módulo de referencia
│   │       ├── api/        # Requests + hooks TanStack Query
│   │       ├── components/ # Componentes propios
│   │       ├── hooks/      # Hooks propios
│   │       ├── routes/     # Navigator del módulo (opcional, solo si hay flujo multi-pantalla)
│   │       ├── schemas/    # Schemas Zod
│   │       ├── screens/    # Pantallas
│   │       │   ├── DashboardScreen.tsx
│   │       │   └── DashboardScreen.test.tsx
│   │       ├── store/      # Estado local compartido dentro del módulo (último recurso)
│   │       ├── types/      # Tipos del dominio
│   │       ├── utils/      # Funciones puras de negocio
│   │       └── index.ts    # API pública del módulo
│   ├── shared/             # Transversal, sin reglas de negocio
│   │   ├── api/            # Cliente HTTP, errores normalizados (ApiError)
│   │   ├── config/         # Config/env validado con Zod
│   │   ├── lib/            # Utilidades compartidas (QueryClient, etc.)
│   │   ├── storage/        # Almacenamiento seguro
│   │   ├── theme/          # Tokens de diseño (colors, spacing, typography, radius)
│   │   └── ui/             # Componentes base reutilizables
│   └── test/               # Helpers para pruebas
├── index.ts                # Entry point
├── package.json
└── README.md
```

### Nota importante: `src/shell` vs `src/app`

En algún momento se usó `src/app` como nombre, pero **Expo Router interpreta `app/` como directorio de rutas reservado**. Aunque en este proyecto se usa `@react-navigation/native-stack` (no `expo-router`), la carpeta se renombró a `src/shell` para evitar colisión silenciosa con herramientas de Expo. 

- **`src/shell/navigation/`**: navegación global (Root Stack, `NavigationContainer`, deep linking, `RootStackParamList`). Única.
- **`src/features/<capacidad>/routes/`**: opcional. Solo cuando el módulo tiene un flujo propio con varias pantallas (ej. Cardex con varios pasos). Se exporta desde `index.ts` del módulo.

## 5. Cómo ejecutar el proyecto

### Primera vez

```bash
# Instalar dependencias
pnpm install

# Crear archivo de variables de entorno
cp .env.example .env
# Ajustar EXPO_PUBLIC_API_URL en .env
```

### Desarrollo

```bash
# Levantar dev server (muestra QR para Expo Go)
pnpm start

# Abrir directamente en Android
pnpm android

# Abrir directamente en iOS (solo macOS)
pnpm ios

# Abrir directamente en web
pnpm web
```

**Para probar desde el celular con Expo Go:**
1. Tener la PC y el celular en la **misma red WiFi**
2. Correr `pnpm start`
3. Escanear el QR con Expo Go (Android) o la app Cámara (iOS)

### Calidad de código

```bash
# Lint
pnpm lint
pnpm lint:fix

# Formateo
pnpm format
pnpm format:check

# Tipado
pnpm typecheck

# Tests
pnpm test
pnpm test:watch
pnpm test:ci

# Diagnóstico de Expo
pnpm doctor
```

## 6. `src/shell`, navegación y providers

### `src/shell/App.tsx`
Es el componente raíz de la app.

```tsx
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './navigation/RootNavigator';
import { AppProviders } from './providers/AppProviders';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProviders>
        <StatusBar style="dark" />
        <RootNavigator />
      </AppProviders>
    </SafeAreaProvider>
  );
}
```

- **`SafeAreaProvider`**: Habilita safe area para respetar notches/barras.
- **`AppProviders`**: Agrupa providers globales.
- **`StatusBar`**: Configuración global.
- **`RootNavigator`**: Renderiza la navegación principal.

### `src/shell/providers/AppProviders.tsx`
Centraliza providers globales.

```tsx
import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';

import { queryClient } from '@/shared/lib/queryClient';

export function AppProviders({ children }: PropsWithChildren) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

### `src/shell/navigation/RootNavigator.tsx`
Usa `@react-navigation/native-stack` con root stack.

```tsx
import { DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DashboardScreen } from '@/features/dashboard';
import { colors } from '@/shared/theme';

import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.danger,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### `src/shell/navigation/types.ts`
Define rutas del root stack y tipado global.

```tsx
export type RootStackParamList = {
  Dashboard: undefined;
};

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
```

### `src/shared/ui/Screen.tsx`
Componente base con safe area, padding opcional y fondo.

```tsx
import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors, spacing } from '@/shared/theme';

type ScreenProps = PropsWithChildren<{
  edges?: readonly Edge[];
  padded?: boolean;
}>;

export function Screen({ children, edges = ['top', 'bottom'], padded = true }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={edges}>
      <View style={[styles.content, padded && styles.padded]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  padded: { paddingHorizontal: spacing.md, paddingVertical: spacing.md },
});
```

Uso: `<Screen>` por defecto con padding. Usar `padded={false}` para listas/mapas full-bleed.

## 7. Flujo actual para entender rápido

1. **Entry point**: `index.ts` carga la app
2. **Raíz**: `src/shell/App.tsx` envuelve con `SafeAreaProvider` + `AppProviders` + `RootNavigator`
3. **Providers**: `src/shell/providers/AppProviders.tsx` provee `QueryClient` vía TanStack Query
4. **Navegación**: `src/shell/navigation/RootNavigator.tsx` registra `Dashboard` y aplica tema desde `shared/theme`
5. **Pantalla inicial**: `src/features/dashboard/screens/DashboardScreen.tsx` usa `Screen` de `shared/ui`
6. **API pública**: cada feature expone lo que otros módulos necesitan desde `src/features/<capacidad>/index.ts`. **Nunca** importar rutas internas.
7. **Transversales**: tema, cliente HTTP, storage, etc. van en `src/shared/`

## 8. Reglas prácticas para mantener la estructura

- **Frontera con `index.ts`**: desde fuera del módulo, importar solo desde `@/features/<modulo>`.
- **`api/` = servidor**: usar TanStack Query. No duplicar estado de servidor en `store/`.
- **`store/` = último recurso**: solo para estado local compartido entre pantallas del mismo módulo.
- **`utils/` = puro**: sin React, sin red, sin persistencia. Ideal para reglas de negocio (NC, utilidad, cantidad recomendada).
- **`shared/` = segundo consumidor**: mover a `shared/` solo cuando al menos dos módulos lo necesiten.
- **Módulos con nombre de negocio**: `auth`, `points-of-sale`, `products`, `cardex`, `orders`. Evitar `common`, `misc`, `utils`.
- **`.gitkeep` en dashboard**: sirve para mantener la anatomía visible. Al crear un nuevo módulo real, copiar solo lo necesario y borrar `.gitkeep` cuando la carpeta tenga archivos.
