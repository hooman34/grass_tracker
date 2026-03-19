import { format, startOfYear, endOfYear, eachDayOfInterval } from 'date-fns';

export function generateYearGrid(): string[] {
  const today = new Date();
  const days = eachDayOfInterval({
    start: startOfYear(today),
    end: endOfYear(today),
  });
  return days.map(d => format(d, 'yyyy-MM-dd'));
}

// Groups days into weeks (columns), padding the first week with nulls so
// day-of-week rows align correctly (Mon=row0 … Sun=row6).
export function groupIntoWeeks(days: string[]): (string | null)[][] {
  const firstDay = new Date(days[0] + 'T12:00:00');
  // Convert to Monday-based index: Mon=0, Tue=1, ... Sun=6
  const leadingEmpties = (firstDay.getDay() + 6) % 7;

  const allCells: (string | null)[] = [
    ...Array<null>(leadingEmpties).fill(null),
    ...days,
  ];

  const weeks: (string | null)[][] = [];
  for (let i = 0; i < allCells.length; i += 7) {
    weeks.push(allCells.slice(i, i + 7));
  }

  // Pad the last week to 7 rows so today lands in the correct day-of-week row
  const lastWeek = weeks[weeks.length - 1];
  while (lastWeek.length < 7) lastWeek.push(null);

  return weeks;
}
