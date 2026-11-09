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

window.__ModuleLoader__.load({
  id: 'dsh-sidebar-collapse',
  factory(moduleRequire: ModuleRequire): ModuleExports {
    const React = moduleRequire('react') as ReactLike;
    const h = React.createElement.bind(React);
    const NS = 'sidebar-collapse';
    const PLUGIN = 'dsh-sidebar-collapse';
    const STORAGE_KEY = 'dsh-sidebar-collapse:panels-hidden';
    const PANEL_LIST_SELECTOR = 'nav[class*="panelList"]';
    const DIVIDER_ATTR = 'data-dsh-sidebar-collapse-divider';
    const HIDE_PANELS_CSS = `${PANEL_LIST_SELECTOR}{display:none !important}`;
    const DIVIDER_CSS = [
      `[${DIVIDER_ATTR}]{display:flex;align-items:center;gap:6px;height:16px;margin:-6px 3px 8px;flex:none;color:var(--dsw-alias-label-secondary);}`,
      `[${DIVIDER_ATTR}][data-anchor="new-session"]{margin-top:-8px;}`,
      `[${DIVIDER_ATTR}][data-anchor="panels"]{margin-top:-6px;margin-bottom:6px;}`,
      `[${DIVIDER_ATTR}] .dsh-sc-divider-line{flex:1 1 auto;min-width:8px;height:1px;border-radius:1px;background:currentColor;opacity:.3;}`,
      `[${DIVIDER_ATTR}] .dsh-sc-divider-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;width:24px;height:16px;padding:0;border:0;border-radius:4px;background:transparent;color:inherit;cursor:pointer;opacity:.75;transition:opacity .12s ease,background-color .12s ease;}`,
      `[${DIVIDER_ATTR}] .dsh-sc-divider-btn:hover{opacity:1;background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.16));}`,
      `[${DIVIDER_ATTR}] .dsh-sc-divider-btn:focus-visible{outline:2px solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:1px;}`,
      `[${DIVIDER_ATTR}] .dsh-sc-divider-tip{position:absolute;left:50%;top:calc(100% + 6px);transform:translateX(-50%);white-space:nowrap;font-size:12px;line-height:18px;padding:2px 8px;border-radius:6px;background:var(--dsw-alias-label-primary,#2b2b2b);color:var(--dsw-alias-label-primary-inverted,#fff);opacity:0;pointer-events:none;transition:opacity .12s ease;z-index:9;}`,
      `[${DIVIDER_ATTR}] .dsh-sc-divider-btn:hover .dsh-sc-divider-tip,[${DIVIDER_ATTR}] .dsh-sc-divider-btn:focus-visible .dsh-sc-divider-tip{opacity:1;}`,
    ].join('');

    const zh: Record<string, string> = {
      'panels.hide': '收起功能入口',
      'panels.show': '展开功能入口',
    };
    const en: Record<string, string> = {
      'panels.hide': 'Collapse feature panel bar',
      'panels.show': 'Expand feature panel bar',
    };

    function readHidden(): boolean {
      try {
        return window.localStorage.getItem(STORAGE_KEY) === '1';
      } catch {
        return false;
      }
    }

    function writeHidden(hidden: boolean): void {
      try {
        window.localStorage.setItem(STORAGE_KEY, hidden ? '1' : '0');
      } catch {
        // Persisting the preference is best effort only.
      }
    }

    interface DividerDom {
      root: HTMLDivElement;
      button: HTMLButtonElement;
      apply(hidden: boolean, label: string): void;
    }

    function createDivider(): DividerDom {
      const root = document.createElement('div');
      root.setAttribute(DIVIDER_ATTR, '');
      root.setAttribute('data-dsh-plugin', PLUGIN);
      const left = document.createElement('span');
      left.className = 'dsh-sc-divider-line';
      const right = document.createElement('span');
      right.className = 'dsh-sc-divider-line';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'dsh-sc-divider-btn';
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 16 16');
      svg.setAttribute('width', '12');
      svg.setAttribute('height', '12');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('aria-hidden', 'true');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', '1.6');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      svg.append(path);
      const tip = document.createElement('span');
      tip.className = 'dsh-sc-divider-tip';
      button.append(svg, tip);
      root.append(left, button, right);
      return {
        root,
        button,
        apply(hidden: boolean, label: string): void {
          path.setAttribute('d', hidden ? 'M4 6l4 4 4-4' : 'M4 10l4-4 4 4');
          root.setAttribute('data-anchor', hidden ? 'new-session' : 'panels');
          button.setAttribute('aria-label', label);
          button.setAttribute('aria-expanded', hidden ? 'false' : 'true');
          button.title = label;
          tip.textContent = label;
        },
      };
    }

    function anchorForDivider(hidden: boolean): Element | null {
      const newSession = document.querySelector('button[class*="newSession"]');
      const panels = document.querySelector(PANEL_LIST_SELECTOR);
      const anchor = hidden ? (newSession ?? panels) : (panels ?? newSession);
      return anchor?.parentElement ? anchor : null;
    }

    function DividerDock(): unknown {
      const t = ctx.locale.bind(NS);
      const [hidden, setHidden] = React.useState<boolean>(readHidden);
      const label = hidden ? t('panels.show') : t('panels.hide');
      const hiddenRef = React.useRef(hidden);
      const labelRef = React.useRef(label);
      const domRef = React.useRef<DividerDom | null>(null);
      const ensureRef = React.useRef<(() => void) | null>(null);
      hiddenRef.current = hidden;
      labelRef.current = label;

      React.useEffect(() => {
        const dom = createDivider();
        domRef.current = dom;
        dom.apply(hiddenRef.current, labelRef.current);
        const onClick = (): void => setHidden((previous) => {
          const next = !previous;
          writeHidden(next);
          return next;
        });
        dom.button.addEventListener('click', onClick);

        let observer: MutationObserver | undefined;
        let observed: Element | undefined;
        let inserts: number[] = [];
        let stopped = false;
        const ensure = (): void => {
          if (stopped) return;
          const anchor = anchorForDivider(hiddenRef.current);
          if (anchor === null) return;
          const parent = anchor.parentElement;
          if (parent === null) return;
          if (dom.root.parentElement !== parent || dom.root.previousElementSibling !== anchor) {
            const now = Date.now();
            inserts = inserts.filter((at) => now - at < 2000);
            if (inserts.length >= 20) {
              stopped = true;
              observer?.disconnect();
              return;
            }
            inserts.push(now);
            anchor.insertAdjacentElement('afterend', dom.root);
          }
          if (observed !== parent && typeof MutationObserver === 'function') {
            observer?.disconnect();
            observer = new MutationObserver(ensure);
            observer.observe(parent, { childList: true });
            observed = parent;
          }
        };
        ensure();
        ensureRef.current = ensure;
        const timer = window.setInterval(ensure, 2000);
        return (): void => {
          window.clearInterval(timer);
          observer?.disconnect();
          dom.button.removeEventListener('click', onClick);
          ensureRef.current = null;
          dom.root.remove();
          domRef.current = null;
        };
      }, []);

      React.useEffect(() => {
        domRef.current?.apply(hidden, label);
        ensureRef.current?.();
      }, [hidden, label]);

      return h(React.Fragment, null, [
        h('style', { key: 'divider-style', 'data-dsh-plugin': PLUGIN }, DIVIDER_CSS),
        hidden ? h('style', { key: 'hide-style', 'data-dsh-plugin': PLUGIN }, HIDE_PANELS_CSS) : null,
      ]);
    }

    let ctx: ClientContext;

    function apply(clientCtx: ClientContext): unknown {
      ctx = clientCtx;
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'sidebar-collapse: dictionaries');
      const t = ctx.locale.bind(NS);
      return ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
        name: 'sidebar.footer.action',
        id: 'sidebar-collapse-divider',
        order: 20,
        label: () => t('panels.hide'),
        locale: NS,
      }, DividerDock));
    }

    return {
      inject: ['slots', 'locale'],
      apply,
    };
  },
});
