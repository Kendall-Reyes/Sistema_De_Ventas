/**
 * Route map for the root stack. Screens are added here as features land.
 * Keep this list small: only top-level destinations belong to the root stack.
 */
export type RootStackParamList = {
  Dashboard: undefined;
};

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
