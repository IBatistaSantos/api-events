interface SortSession {
  date: string;
  hourEnd: string;
  hourStart: string;
  isCurrent: boolean;
  id: string;
}

export function sortSessions(sessions: SortSession[]) {
  return sessions.sort((a, b) => {
    if (a.isCurrent === b.isCurrent) {
      return Number(new Date(b.date)) - Number(new Date(a.date));
    }
    return a.isCurrent ? -1 : 1;
  });
}
