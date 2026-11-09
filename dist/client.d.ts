interface ModuleLoader {
    load(module: ModuleDefinition): void;
}
interface ModuleDefinition {
    id: string;
    factory(require: ModuleRequire): ModuleExports;
}
type ModuleRequire = (moduleId: string) => unknown;
interface ModuleExports {
    inject: readonly string[];
    apply(context: ClientContext): unknown;
}
interface ReactRef<T> {
    current: T;
}
interface ReactLike {
    Fragment: unknown;
    createElement(type: unknown, props: Record<string, unknown> | null, ...children: unknown[]): unknown;
    useState<T>(initial: T | (() => T)): [T, (value: T | ((previous: T) => T)) => void];
    useRef<T>(initial: T): ReactRef<T>;
    useEffect(effect: () => void | (() => void), dependencies?: readonly unknown[]): void;
}
interface LocaleApi {
    register(namespace: string, dictionaries: Record<string, Record<string, string>>): void;
    bind(namespace: string): (key: string) => string;
}
interface SlotRegistration {
    name: string;
    id: string;
    order: number;
    label: () => string;
    locale: string;
}
interface SlotApi {
    inject(slot: string, factory: () => unknown): unknown;
    register(registration: SlotRegistration, component: () => unknown): unknown;
}
interface ClientContext {
    effect(effect: () => void, label?: string): unknown;
    locale: LocaleApi;
    slots: SlotApi;
}
interface Window {
    __ModuleLoader__: ModuleLoader;
}
//# sourceMappingURL=client.d.ts.map