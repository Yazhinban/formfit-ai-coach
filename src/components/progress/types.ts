
export interface ProgressEntry {
  id: string;
  date: string;
  weight?: number;
  workout?: string;
  notes?: string;
}

export const calculateWeightChange = (progressData: ProgressEntry[]): number => {
  if (progressData.length < 2) return 0;
  
  const sortedData = [...progressData]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const latest = sortedData[0];
  const previous = sortedData[sortedData.length - 1];
  
  if (!latest.weight || !previous.weight) return 0;
  
  return ((latest.weight - previous.weight) / previous.weight) * 100;
};

export const filterDataByTimeRange = (
  progressData: ProgressEntry[],
  activeTab: 'weekly' | 'monthly'
): ProgressEntry[] => {
  const now = new Date();
  const startDate = new Date();
  
  if (activeTab === 'weekly') {
    startDate.setDate(now.getDate() - 7);
  } else {
    startDate.setMonth(now.getMonth() - 1);
  }
  
  return progressData
    .filter(entry => new Date(entry.date) >= startDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
