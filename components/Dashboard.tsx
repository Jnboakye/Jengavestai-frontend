import MetricsBar from './MetricsBar';
import PortfolioChart from './PortfolioChart';
import AllocationChart from './AllocationChart';
import HoldingsTable from './HoldingsTable';
import NewsPanel from './NewsPanel';
import UploadDocument from './UploadDocument';

export default function Dashboard() {
  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <MetricsBar />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PortfolioChart />
        <AllocationChart />
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <HoldingsTable />
        <NewsPanel />
      </div>

      {/* Upload Section */}
      <UploadDocument />
    </div>
  );
}