import { Building2, TrendingUp, MapPin, Award } from 'lucide-react';
import { Analytics } from '@/lib/types';

interface AnalyticsDashboardProps {
  data: Analytics;
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const topServices = Object.entries(data.serviceBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  const stats = [
    {
      label: 'Total Agencies',
      value: data.totalAgencies.toLocaleString(),
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      lightColor: 'from-blue-50 to-blue-100',
    },
    {
      label: `Top Service: ${topServices[0]?.[0] || 'N/A'}`,
      value: topServices[0]?.[1].toString() || '0',
      subtitle: 'agencies',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      lightColor: 'from-green-50 to-green-100',
    },
    {
      label: 'Average Rating',
      value: data.avgRating.toFixed(1),
      subtitle: '/ 5.0',
      icon: Award,
      color: 'from-amber-500 to-amber-600',
      lightColor: 'from-amber-50 to-amber-100',
    },
    {
      label: 'US Locations',
      value: data.locationsCount.toString(),
      subtitle: 'states',
      icon: MapPin,
      color: 'from-purple-500 to-purple-600',
      lightColor: 'from-purple-50 to-purple-100',
    },
  ];

  return (
    <section className="w-full bg-white dark:bg-slate-900 py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Marketplace Insights
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Real-time statistics from our vetted agency network
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 transition-all hover:shadow-lg hover:border-primary/20 group"
              >
                {/* Background gradient */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8 bg-gradient-to-br ${stat.lightColor} opacity-30 rounded-full group-hover:scale-110 transition-transform duration-300`}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                    {stat.subtitle && (
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {stat.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
