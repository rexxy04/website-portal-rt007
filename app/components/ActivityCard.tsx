// Tentukan tipe data untuk satu aktivitas
type Activity = {
  id: string;
  title: string;
  date: string;
};

// Tentukan props untuk komponen
type ActivityCardProps = {
  activities: Activity[];
};

export default function ActivityCard({ activities }: ActivityCardProps) {
  return (
    // Card container
    <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full mx-auto border border-gray-100">
      
      {/* Card Header */}
      <div className="bg-green-600 p-4">
        <h2 className="text-white text-lg font-bold">Aktivitas Terbaru</h2>
      </div>
      
      {/* Card Body - List of Activities */}
      <div className="p-4 md:p-6">
        <ul className="space-y-4">
          {/* Loop melalui data 'activities' */}
          {activities.length > 0 ? (
            activities.map((activity) => (
              <li key={activity.id} className="pb-3 border-b border-gray-200 last:border-b-0">
                <h3 className="text-sm font-semibold text-gray-800 tracking-tight">{activity.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500">Belum ada aktivitas terbaru.</p>
          )}
        </ul>
      </div>

    </div>
  );
}