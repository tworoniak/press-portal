// import { createContext, useContext, useMemo, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   CommandPalette,
//   type CommandItem,
// } from '../components/ui/CommandPalette/CommandPalette';

// type Ctx = {
//   open: () => void;
//   close: () => void;
// };

// const CommandPaletteContext = createContext<Ctx | null>(null);

// export function useCommandPalette() {
//   const ctx = useContext(CommandPaletteContext);
//   if (!ctx)
//     throw new Error(
//       'useCommandPalette must be used within CommandPaletteProvider',
//     );
//   return ctx;
// }

// export function CommandPaletteProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const nav = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);

//   // MVP global commands
//   const items: CommandItem[] = useMemo(
//     () => [
//       {
//         id: 'go-dashboard',
//         label: 'Go to Dashboard',
//         keywords: ['dashboard'],
//         run: () => nav('/dashboard'),
//       },
//       {
//         id: 'go-contacts',
//         label: 'Go to Contacts',
//         keywords: ['contacts'],
//         run: () => nav('/contacts'),
//       },
//       {
//         id: 'go-bands',
//         label: 'Go to Bands',
//         keywords: ['bands'],
//         run: () => nav('/bands'),
//       },
//       {
//         id: 'go-festivals',
//         label: 'Go to Festivals',
//         keywords: ['festivals'],
//         run: () => nav('/festivals'),
//       },

//       // This can route and pass state to open a modal on ContactsPage (optional)
//       {
//         id: 'create-contact',
//         label: 'Create Contact',
//         keywords: ['new', 'add', 'contact'],
//         run: () => nav('/contacts', { state: { openCreate: true } }),
//       },
//     ],
//     [nav],
//   );

//   // ⌘K / Ctrl+K + Escape
//   // (If you already have useKey/useHotkeys, plug it in here instead)
//   React.useEffect(() => {
//     function onKeyDown(e: KeyboardEvent) {
//       const isK = e.key.toLowerCase() === 'k';
//       if ((e.metaKey || e.ctrlKey) && isK) {
//         e.preventDefault();
//         setIsOpen((v) => !v);
//       }
//       if (e.key === 'Escape') setIsOpen(false);
//     }
//     window.addEventListener('keydown', onKeyDown);
//     return () => window.removeEventListener('keydown', onKeyDown);
//   }, []);

//   const value = useMemo(
//     () => ({ open: () => setIsOpen(true), close: () => setIsOpen(false) }),
//     [],
//   );

//   return (
//     <CommandPaletteContext.Provider value={value}>
//       {children}
//       <CommandPalette
//         open={isOpen}
//         onClose={() => setIsOpen(false)}
//         items={items}
//         onRun={() => setIsOpen(false)}
//       />
//     </CommandPaletteContext.Provider>
//   );
// }
