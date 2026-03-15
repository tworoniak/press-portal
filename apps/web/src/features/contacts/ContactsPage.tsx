import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { SelectField } from '../../components/SelectField/SelectField';
import {
  useContacts,
  useCreateContact,
  useDeleteContact,
  useUpdateContact,
} from './queries';
import { Trash2 } from 'lucide-react';
import page from '../../components/ui/Page/Page.module.scss';
import card from '../../components/ui/Card/Card.module.scss';
import table from '../../components/ui/Table/Table.module.scss';
import styles from './ContactsPage.module.scss';
import { Badge, type BadgeTone } from '../../components/ui/Badge/Badge';
import { TagRow } from '../../components/ui/Tag/TagRow';
import { Modal } from '../../components/ui/Modal/Modal';
import Button from '../../components/ui/Button/Button';

type ContactStatus =
  | ''
  | 'NOT_CONTACTED'
  | 'CONTACTED'
  | 'RESPONDED'
  | 'CONFIRMED'
  | 'PUBLISHED'
  | 'ARCHIVED';

const STATUS_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'NOT_CONTACTED', label: 'NOT CONTACTED' },
  { value: 'CONTACTED', label: 'CONTACTED' },
  { value: 'RESPONDED', label: 'RESPONDED' },
  { value: 'CONFIRMED', label: 'CONFIRMED' },
  { value: 'PUBLISHED', label: 'PUBLISHED' },
  { value: 'ARCHIVED', label: 'ARCHIVED' },
] as const satisfies readonly { value: ContactStatus; label: string }[];

type ContactRow = {
  id: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  company: string | null;
  role: string | null;
  status: ContactStatus | null;
  tags: string[] | null;
  lastContactedAt: string | null;
  interactions?: { id: string; nextFollowUpAt: string | null }[];
};

function fmtDate(dt: string) {
  return new Date(dt).toLocaleString();
}

function displayName(c: {
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}) {
  return (
    c.displayName ||
    [c.firstName, c.lastName].filter(Boolean).join(' ') ||
    c.email ||
    '(no name)'
  );
}

function statusTone(status: string | null | undefined): BadgeTone {
  switch (status) {
    case 'PUBLISHED':
    case 'CONFIRMED':
      return 'ok';
    case 'RESPONDED':
      return 'warn';
    case 'ARCHIVED':
      return 'default';
    case 'NOT_CONTACTED':
    case 'CONTACTED':
    default:
      return 'default';
  }
}

function followUpBadge(nextFollowUpAt: string | null) {
  if (!nextFollowUpAt) return null;

  const ms = new Date(nextFollowUpAt).getTime() - Date.now();
  const day = 24 * 60 * 60 * 1000;

  if (ms <= 0) return { tone: 'danger' as const, label: 'Due' };
  if (ms <= 3 * day) return { tone: 'warn' as const, label: 'Soon' };
  return { tone: 'default' as const, label: 'Scheduled' };
}

function splitTags(value: string) {
  return value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

type EditDraft = {
  id: string;
  displayName: string;
  email: string;
  company: string;
  role: string;
  status: Exclude<ContactStatus, ''> | '';
  tagsText: string;
};

export default function ContactsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ContactStatus>('');
  const [tag, setTag] = useState('');
  const [needsFollowUp, setNeedsFollowUp] = useState(false);

  const filters = useMemo(
    () => ({
      search: search.trim() || undefined,
      status: status || undefined,
      tag: tag.trim() || undefined,
      needsFollowUp: needsFollowUp || undefined,
    }),
    [search, status, tag, needsFollowUp],
  );

  const { data, isLoading, isError, error } = useContacts(filters);
  const create = useCreateContact();
  const update = useUpdateContact();
  const del = useDeleteContact();

  // Create modal
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newTags, setNewTags] = useState('Press');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const shouldOpenFromRoute = searchParams.get('create') === '1';
  const createModalOpen = isCreateOpen || shouldOpenFromRoute;

  // Edit modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);

  // Delete modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ContactRow | null>(null);

  async function onAdd() {
    const email = newEmail.trim();
    if (!email) return;

    const name = newName.trim();
    const [firstName, ...rest] = name.split(' ');
    const lastName = rest.length ? rest.join(' ') : undefined;

    const tags = splitTags(newTags);

    await create.mutateAsync({
      email,
      firstName: firstName || undefined,
      lastName,
      company: newCompany.trim() || undefined,
      role: 'Publicist',
      tags,
      status: 'NOT_CONTACTED',
    });

    setIsCreateOpen(false);
    setNewName('');
    setNewEmail('');
    setNewCompany('');
    setNewTags('Press');

    if (shouldOpenFromRoute) {
      navigate('/contacts', { replace: true });
    }
  }

  function openEdit(c: ContactRow) {
    setEditDraft({
      id: c.id,
      displayName: c.displayName ?? '',
      email: c.email ?? '',
      company: c.company ?? '',
      role: c.role ?? '',
      status: (c.status ?? '') as EditDraft['status'],
      tagsText: (c.tags ?? []).join(', '),
    });
    setIsEditOpen(true);
  }

  async function onSaveEdit() {
    if (!editDraft) return;

    const tags = splitTags(editDraft.tagsText);

    await update.mutateAsync({
      id: editDraft.id,
      data: {
        displayName: editDraft.displayName.trim() || null,
        email: editDraft.email.trim() || null,
        company: editDraft.company.trim() || null,
        role: editDraft.role.trim() || null,
        status: editDraft.status || undefined,
        tags,
      },
    });

    setIsEditOpen(false);
    setEditDraft(null);
  }

  function openDelete(c: ContactRow) {
    setDeleteTarget(c);
    setIsDeleteOpen(true);
  }

  async function onConfirmDelete() {
    if (!deleteTarget) return;
    await del.mutateAsync(deleteTarget.id);
    setIsDeleteOpen(false);
    setDeleteTarget(null);
  }

  return (
    <div className={page.page}>
      <div className={page.container}>
        {/* Create */}
        <Modal
          title='Create contact'
          open={createModalOpen}
          onClose={() => {
            setIsCreateOpen(false);

            if (shouldOpenFromRoute) {
              navigate('/contacts', { replace: true });
            }
          }}
        >
          <div className={card.card}>
            <div className={card.cardTitle}>Quick add</div>

            <div className={styles.quickAddGrid}>
              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Name</span>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder='Jane Doe'
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Email *</span>
                <input
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder='jane@label.com'
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Company</span>
                <input
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder='Metal PR Co'
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>
                  Tags (comma)
                </span>
                <input
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder='Press, Metal, US'
                />
              </label>

              <Button
                variant='contained'
                color='primary'
                size='lg'
                onClick={() => void onAdd()}
                disabled={create.isPending || !newEmail.trim()}
              >
                {create.isPending ? 'Adding…' : 'Add'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Edit */}
        <Modal
          title='Edit contact'
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
        >
          <div className={card.card}>
            <div className={card.cardTitle}>Details</div>

            <div className={styles.quickAddGrid}>
              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>
                  Display name
                </span>
                <input
                  value={editDraft?.displayName ?? ''}
                  onChange={(e) =>
                    setEditDraft((prev) =>
                      prev ? { ...prev, displayName: e.target.value } : prev,
                    )
                  }
                  placeholder='Jane Doe'
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Email</span>
                <input
                  value={editDraft?.email ?? ''}
                  onChange={(e) =>
                    setEditDraft((prev) =>
                      prev ? { ...prev, email: e.target.value } : prev,
                    )
                  }
                  placeholder='jane@label.com'
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Company</span>
                <input
                  value={editDraft?.company ?? ''}
                  onChange={(e) =>
                    setEditDraft((prev) =>
                      prev ? { ...prev, company: e.target.value } : prev,
                    )
                  }
                  placeholder='Metal PR Co'
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Role</span>
                <input
                  value={editDraft?.role ?? ''}
                  onChange={(e) =>
                    setEditDraft((prev) =>
                      prev ? { ...prev, role: e.target.value } : prev,
                    )
                  }
                  placeholder='Publicist'
                />
              </label>

              <SelectField<ContactStatus>
                label='Status'
                value={(editDraft?.status ?? '') as ContactStatus}
                options={STATUS_OPTIONS}
                onChange={(v) =>
                  setEditDraft((prev) => (prev ? { ...prev, status: v } : prev))
                }
              />

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.75 }}>Tags</span>
                <input
                  value={editDraft?.tagsText ?? ''}
                  onChange={(e) =>
                    setEditDraft((prev) =>
                      prev ? { ...prev, tagsText: e.target.value } : prev,
                    )
                  }
                  placeholder='Press, Metal, US'
                />
              </label>

              <Button
                variant='contained'
                color='primary'
                size='xl'
                onClick={() => void onSaveEdit()}
                disabled={update.isPending}
              >
                {update.isPending ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete */}
        <Modal
          title='Delete contact'
          open={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
        >
          <div className={card.card}>
            <div
              className={page.subtle}
              style={{
                marginBottom: 10,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              This cannot be undone.
            </div>

            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              {deleteTarget ? displayName(deleteTarget) : ''}
            </div>
            <div className={page.subtle} style={{ marginBottom: 14 }}>
              {deleteTarget?.email ?? ''}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Button
                variant='contained'
                color='danger'
                size='lg'
                onClick={() => void onConfirmDelete()}
                disabled={del.isPending || !deleteTarget}
              >
                {del.isPending ? 'Deleting…' : 'Delete'}
              </Button>

              <Button
                variant='outline'
                color='neutral'
                size='lg'
                onClick={() => setIsDeleteOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {/* Header */}
        <div className={page.headerRow}>
          <h1 className={page.title}>Contacts</h1>
          <div className={page.nav}>
            <Button
              variant='contained'
              color='primary'
              size='lg'
              onClick={() => setIsCreateOpen(true)}
            >
              New Contact
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className={card.card}>
          <div className={card.cardTitle}>Filters</div>

          <div className={styles.filterGrid}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.75 }}>Search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Name, email, company...'
              />
            </label>

            <SelectField<ContactStatus>
              label='Status'
              value={status}
              options={STATUS_OPTIONS}
              onChange={setStatus}
            />

            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.75 }}>Tag</span>
              <input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder='Metal, Festival...'
              />
            </label>

            <label
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <input
                type='checkbox'
                checked={needsFollowUp}
                onChange={(e) => setNeedsFollowUp(e.target.checked)}
              />
              <span style={{ fontSize: 14 }}>Needs follow-up</span>
            </label>
          </div>
        </div>

        <div style={{ height: 18 }} />

        {/* Results */}
        {isLoading && <p>Loading…</p>}

        {isError && (
          <p>
            Error:{' '}
            {error instanceof Error ? error.message : 'Failed to load contacts'}
          </p>
        )}

        {!isLoading && !isError && (
          <>
            <div className={page.subtle}>{data?.length ?? 0} contact(s)</div>
            <div style={{ height: 10 }} />

            <div className={table.tableWrap}>
              <table className={table.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company / Role</th>
                    <th>Status</th>
                    <th>Last contacted</th>
                    <th>Follow-up</th>
                    <th>Tags</th>
                    <th style={{ width: 160 }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {((data ?? []) as ContactRow[]).map((c) => {
                    const label = c.status?.replaceAll('_', ' ') ?? '—';
                    const tone = statusTone(c.status);
                    const nextFollowUpAt =
                      c.interactions?.[0]?.nextFollowUpAt ?? null;
                    const fu = followUpBadge(nextFollowUpAt);

                    return (
                      <tr key={c.id}>
                        <td>
                          <div className={table.rowTitle}>
                            <Link to={`/contacts/${c.id}`}>
                              {displayName(c)}
                            </Link>
                          </div>
                          <div className={table.smallMuted}>
                            {c.email ?? ''}
                          </div>
                        </td>

                        <td>
                          <div className={table.rowCompany}>
                            {c.company ?? '—'}
                          </div>
                          <div className={table.smallMuted}>
                            {c.role ?? '—'}
                          </div>
                        </td>

                        <td>
                          <Badge tone={tone}>{label}</Badge>
                        </td>

                        <td className={table.smallMuted}>
                          {c.lastContactedAt ? fmtDate(c.lastContactedAt) : '—'}
                        </td>

                        <td>
                          {fu ? (
                            <>
                              <Badge tone={fu.tone}>{fu.label}</Badge>
                              <div
                                className={table.smallMuted}
                                style={{ marginTop: 6 }}
                              >
                                {fmtDate(nextFollowUpAt!)}
                              </div>
                            </>
                          ) : (
                            <span style={{ opacity: 0.6 }}>—</span>
                          )}
                        </td>

                        <td>
                          <TagRow tags={c.tags ?? []} />
                        </td>

                        <td>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <Button
                              variant='contained'
                              color='primary'
                              size='lg'
                              onClick={() => openEdit(c)}
                            >
                              Edit
                            </Button>

                            <Button
                              variant='outline'
                              color='danger'
                              size='lg'
                              onClick={() => openDelete(c)}
                            >
                              <span className='mobile-hidden'>Delete</span>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {(data?.length ?? 0) === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: 14, opacity: 0.75 }}>
                        No contacts match these filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
