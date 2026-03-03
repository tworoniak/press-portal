import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

import page from '../../components/ui/Page/Page.module.scss';
import card from '../../components/ui/Card/Card.module.scss';

type ContactRef = {
  contact: {
    id: string;
    displayName: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    company: string | null;
    role: string | null;
  };
};

type FestivalDetail = {
  id: string;
  name: string;
  location: string | null;
  website: string | null;
  startDate: string | null;
  endDate: string | null;
  contacts: ContactRef[];
};

function displayName(c: ContactRef['contact']) {
  return (
    c.displayName ||
    [c.firstName, c.lastName].filter(Boolean).join(' ') ||
    c.email ||
    '(no name)'
  );
}

export default function FestivalDetailPage() {
  const { id = '' } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['festival', id],
    queryFn: async () => {
      const res = await api.get<FestivalDetail>(`/festivals/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className={page.page}>
        <div className={page.container}>Loading…</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className={page.page}>
        <div className={page.container}>Not found.</div>
      </div>
    );
  }

  return (
    <div className={page.page}>
      <div className={page.container}>
        <h1>{data.name}</h1>

        <div style={{ opacity: 0.75 }}>
          {data.location ?? '—'}
          {data.startDate
            ? ` • ${new Date(data.startDate).toLocaleDateString()}`
            : ''}
          {data.endDate
            ? ` – ${new Date(data.endDate).toLocaleDateString()}`
            : ''}
        </div>

        <div style={{ height: 16 }} />

        <div className={card.card}>
          <div className={card.cardTitle}>Linked Contacts</div>

          {data.contacts.length ? (
            <div style={{ display: 'grid', gap: 10 }}>
              {data.contacts.map((ref) => (
                <div key={ref.contact.id}>
                  <Link to={`/contacts/${ref.contact.id}`}>
                    {displayName(ref.contact)}
                  </Link>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    {ref.contact.company ?? '—'}
                    {ref.contact.role ? ` • ${ref.contact.role}` : ''}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ opacity: 0.75 }}>No contacts linked yet.</div>
          )}
        </div>

        <div style={{ height: 12 }} />
        <Link to='/contacts'>← Back</Link>
      </div>
    </div>
  );
}
