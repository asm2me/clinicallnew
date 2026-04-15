import { DEMO_CREDENTIALS, type DemoRole, getDemoCredentialsByRole } from '@/lib/demo-auth';

export type OverviewKpi = {
  label: string;
  value: string;
  change: string;
};

export type OverviewActivity = {
  title: string;
  description: string;
  status: string;
};

export type OverviewHighlight = {
  label: string;
  value: string;
  note: string;
};

export type DashboardOverviewData = {
  kpis: OverviewKpi[];
  activitySummary: string;
  activities: OverviewActivity[];
  highlights: OverviewHighlight[];
};

export type AppointmentsSummaryItem = {
  label: string;
  value: string;
  note: string;
};

export type AppointmentRow = {
  time: string;
  patient: string;
  clinic: string;
  doctor: string;
  status: string;
};

export type AppointmentsPageData = {
  summary: AppointmentsSummaryItem[];
  appointments: AppointmentRow[];
};

export type PatientsMetric = {
  label: string;
  value: string;
  note: string;
};

export type PatientRow = {
  name: string;
  mrn: string;
  lastVisit: string;
  team: string;
  status: string;
};

export type PatientsPageData = {
  metrics: PatientsMetric[];
  patients: PatientRow[];
};

export type ClinicsSummaryItem = {
  label: string;
  value: string;
  note: string;
};

export type ClinicRow = {
  name: string;
  city: string;
  manager: string;
  rooms: string;
  status: string;
};

export type ClinicsPageData = {
  summary: ClinicsSummaryItem[];
  clinics: ClinicRow[];
};

export type AnalyticsKpi = {
  label: string;
  value: string;
  note: string;
};

export type AnalyticsMetric = {
  label: string;
  value: string;
  note: string;
};

export type AnalyticsTrend = {
  label: string;
  value: string;
  note: string;
};

export type AnalyticsPageData = {
  kpis: AnalyticsKpi[];
  metrics: AnalyticsMetric[];
  trends: AnalyticsTrend[];
};

export type SettingsProfileItem = {
  label: string;
  value: string;
  note: string;
};

export type SettingsPreferenceItem = {
  label: string;
  value: string;
  note: string;
};

export type SettingsPageData = {
  profile: SettingsProfileItem[];
  preferences: SettingsPreferenceItem[];
};

const dashboardOverviewByRole: Record<DemoRole, DashboardOverviewData> = {
  'Super Admin': {
    kpis: [
      { label: 'Active tenants', value: '42', change: '+4 this month' },
      { label: 'Clinic uptime', value: '99.94%', change: 'Stable across regions' },
      { label: 'Monthly revenue', value: '$248K', change: '+12.6% vs last month' },
      { label: 'Open incidents', value: '3', change: '2 require follow-up' }
    ],
    activitySummary: 'Platform-wide visibility',
    activities: [
      {
        title: 'New tenant onboarding completed',
        description: 'Verde Care Group finished setup for 6 clinics and 41 staff members.',
        status: 'Completed'
      },
      {
        title: 'Cross-region performance alert',
        description: 'No-show rate dropped below target after reminder workflow rollout.',
        status: 'Improved'
      },
      {
        title: 'Subscription renewal review',
        description: 'Five enterprise tenants are up for renewal in the next 14 days.',
        status: 'Pending'
      }
    ],
    highlights: [
      { label: 'Top-performing tenant', value: 'Northstar Health', note: 'Highest conversion and retention rate this month.' },
      { label: 'Expansion pipeline', value: '8 new clinic launches', note: 'Expected to go live over the next 30 days.' },
      { label: 'Support resolution', value: '94% within SLA', note: 'Operational support trending above target.' }
    ]
  },
  'Tenant Admin': {
    kpis: [
      { label: 'Managed clinics', value: '8', change: '2 added this quarter' },
      { label: 'Today’s visits', value: '214', change: '+18 vs yesterday' },
      { label: 'Filled schedules', value: '92%', change: 'High utilization this week' },
      { label: 'Open staffing gaps', value: '2', change: 'Coverage needed Friday' }
    ],
    activitySummary: 'Tenant operations in motion',
    activities: [
      {
        title: 'Clinic staffing updated',
        description: 'Weekend coverage assigned to South Branch and Pediatric Unit.',
        status: 'Completed'
      },
      {
        title: 'Schedule utilization review',
        description: 'Dermatology clinic has increased occupancy and low idle room time.',
        status: 'Healthy'
      },
      {
        title: 'Billing plan reminder',
        description: 'Pro plan feature adoption report is ready for review.',
        status: 'Pending'
      }
    ],
    highlights: [
      { label: 'Best performing branch', value: 'North Branch', note: 'Highest daily throughput and lowest wait times.' },
      { label: 'Patient satisfaction', value: '96%', note: 'Improved after intake form optimization.' },
      { label: 'No-show improvement', value: '-11%', note: 'Reminder automation reduced missed visits.' }
    ]
  },
  Doctor: {
    kpis: [
      { label: 'Today’s patients', value: '18', change: '4 in queue now' },
      { label: 'Average consult', value: '14 min', change: '-2 min vs last week' },
      { label: 'Follow-ups due', value: '6', change: '2 urgent' },
      { label: 'Notes pending', value: '3', change: 'Before end of day' }
    ],
    activitySummary: 'Clinical workload overview',
    activities: [
      {
        title: 'Morning clinic fully booked',
        description: 'Back-to-back consultations scheduled through 1:00 PM.',
        status: 'Busy'
      },
      {
        title: 'Care plan review',
        description: 'Two chronic care follow-ups require medication confirmation.',
        status: 'Needs review'
      },
      {
        title: 'Telehealth session added',
        description: 'A new remote consultation was inserted into the afternoon block.',
        status: 'Updated'
      }
    ],
    highlights: [
      { label: 'Patient adherence', value: '92%', note: 'Care plan completion is trending upward.' },
      { label: 'Documentation accuracy', value: '98%', note: 'Clinical notes submitted on time.' },
      { label: 'Care quality score', value: '4.8/5', note: 'Based on recent patient feedback.' }
    ]
  },
  Staff: {
    kpis: [
      { label: 'Check-ins handled', value: '32', change: '+7 from yesterday' },
      { label: 'Unread messages', value: '14', change: '5 need responses now' },
      { label: 'Reschedules', value: '5', change: '2 urgent changes' },
      { label: 'Desk wait time', value: '7 min', change: '-1 min average' }
    ],
    activitySummary: 'Front-desk coordination',
    activities: [
      {
        title: 'Peak check-in wave managed',
        description: 'Morning arrivals cleared without queue overflow.',
        status: 'Smooth'
      },
      {
        title: 'Insurance verification follow-up',
        description: 'Three patient records still need updated policy information.',
        status: 'Pending'
      },
      {
        title: 'Reminder calls sent',
        description: 'Afternoon appointment confirmations have been completed.',
        status: 'Done'
      }
    ],
    highlights: [
      { label: 'Messaging response rate', value: '89%', note: 'Patient replies handled within working hours.' },
      { label: 'Front-desk throughput', value: '128 visits', note: 'Strong handling across the team today.' },
      { label: 'Escalations', value: '1 open', note: 'Waiting on clinic manager confirmation.' }
    ]
  },
  Patient: {
    kpis: [
      { label: 'Upcoming visits', value: '2', change: 'Next one this Thursday' },
      { label: 'Care tasks due', value: '5', change: '2 due this week' },
      { label: 'Unread updates', value: '1', change: 'New lab note available' },
      { label: 'Care score', value: 'On track', change: 'All routines progressing' }
    ],
    activitySummary: 'Personal care journey',
    activities: [
      {
        title: 'Upcoming appointment confirmed',
        description: 'Your follow-up with Dr. Patel is booked for Thursday at 2:00 PM.',
        status: 'Confirmed'
      },
      {
        title: 'Lab update received',
        description: 'A new test result is available in your health timeline.',
        status: 'New'
      },
      {
        title: 'Medication reminder',
        description: 'One care plan task is due tomorrow morning.',
        status: 'Pending'
      }
    ],
    highlights: [
      { label: 'Primary clinic', value: 'Downtown Clinic', note: 'Your core care team is available here.' },
      { label: 'Visit completion', value: '100%', note: 'No missed visits in the last quarter.' },
      { label: 'Care plan progress', value: '92%', note: 'You are nearly complete with this cycle.' }
    ]
  }
};

const appointmentsByRole: Record<DemoRole, AppointmentsPageData> = {
  'Super Admin': {
    summary: [
      { label: 'Appointments today', value: '1,284', note: 'Across all tenants' },
      { label: 'Pending approvals', value: '31', note: 'Require staff review' },
      { label: 'No-show risk', value: '4.2%', note: 'Lower than last week' }
    ],
    appointments: [
      { time: '09:00 AM', patient: 'Maria Gomez', clinic: 'Downtown Clinic', doctor: 'Dr. Patel', status: 'Confirmed' },
      { time: '10:30 AM', patient: 'James Liu', clinic: 'Westside Health', doctor: 'Dr. Ahmed', status: 'Pending' },
      { time: '11:45 AM', patient: 'Rana Ali', clinic: 'Northstar Care', doctor: 'Dr. Salim', status: 'Completed' }
    ]
  },
  'Tenant Admin': {
    summary: [
      { label: 'Today’s visits', value: '214', note: 'Across managed branches' },
      { label: 'Reschedules', value: '9', note: 'Mostly afternoon slots' },
      { label: 'Booked capacity', value: '92%', note: 'Strong tenant utilization' }
    ],
    appointments: [
      { time: '08:30 AM', patient: 'Nina Brown', clinic: 'North Branch', doctor: 'Dr. Owen', status: 'Confirmed' },
      { time: '09:15 AM', patient: 'Chris Walker', clinic: 'North Branch', doctor: 'Dr. Owen', status: 'Pending' },
      { time: '01:00 PM', patient: 'Dina Saleh', clinic: 'South Branch', doctor: 'Dr. Noor', status: 'Confirmed' }
    ]
  },
  Doctor: {
    summary: [
      { label: 'Consultations', value: '18', note: 'Your booked schedule today' },
      { label: 'Follow-ups', value: '6', note: 'Need chart review' },
      { label: 'Avg. gap time', value: '6 min', note: 'Between patients' }
    ],
    appointments: [
      { time: '10:00 AM', patient: 'Alex Morgan', clinic: 'Cedar Medical', doctor: 'You', status: 'Confirmed' },
      { time: '10:30 AM', patient: 'Elena Park', clinic: 'Cedar Medical', doctor: 'You', status: 'Pending' },
      { time: '11:15 AM', patient: 'Hassan Adel', clinic: 'Cedar Medical', doctor: 'You', status: 'Completed' }
    ]
  },
  Staff: {
    summary: [
      { label: 'Check-ins due', value: '32', note: 'Reception handling today' },
      { label: 'Late arrivals', value: '4', note: 'Need reslotting' },
      { label: 'Calls pending', value: '7', note: 'Reminder outreach list' }
    ],
    appointments: [
      { time: '11:00 AM', patient: 'Sofia Hall', clinic: 'River Clinic', doctor: 'Dr. Chen', status: 'Confirmed' },
      { time: '11:30 AM', patient: 'Dylan Reed', clinic: 'River Clinic', doctor: 'Dr. Chen', status: 'Pending' },
      { time: '12:00 PM', patient: 'Leila Mostafa', clinic: 'Lakeview Center', doctor: 'Dr. Omar', status: 'Cancelled' }
    ]
  },
  Patient: {
    summary: [
      { label: 'Upcoming visits', value: '2', note: 'Your next 30 days' },
      { label: 'Pending confirmation', value: '1', note: 'Awaiting clinic approval' },
      { label: 'Care reminders', value: '3', note: 'Linked to upcoming visits' }
    ],
    appointments: [
      { time: 'Thu · 2:00 PM', patient: 'You', clinic: 'Downtown Clinic', doctor: 'Dr. Patel', status: 'Confirmed' },
      { time: 'Mon · 9:30 AM', patient: 'You', clinic: 'Downtown Clinic', doctor: 'Dr. Patel', status: 'Pending' }
    ]
  }
};

const patientsByRole: Record<DemoRole, PatientsPageData> = {
  'Super Admin': {
    metrics: [
      { label: 'Patient records', value: '84.2K', note: 'Across all tenants' },
      { label: 'Flagged follow-ups', value: '312', note: 'Need action this week' },
      { label: 'Portal adoption', value: '71%', note: 'Patient accounts enabled' },
      { label: 'Satisfaction', value: '4.8/5', note: 'Average latest score' }
    ],
    patients: [
      { name: 'Maria Gomez', mrn: 'MRN-40211', lastVisit: 'Apr 14', team: 'Downtown Care Team', status: 'Stable' },
      { name: 'James Liu', mrn: 'MRN-40212', lastVisit: 'Apr 13', team: 'Westside Internal Med', status: 'Needs Follow-up' },
      { name: 'Rana Ali', mrn: 'MRN-40213', lastVisit: 'Apr 12', team: 'Northstar Family Unit', status: 'Under Review' }
    ]
  },
  'Tenant Admin': {
    metrics: [
      { label: 'Active patients', value: '11.6K', note: 'Within your tenant' },
      { label: 'New registrations', value: '84', note: 'This week' },
      { label: 'Pending intake', value: '17', note: 'Forms awaiting completion' },
      { label: 'Retention', value: '88%', note: 'Quarterly trend' }
    ],
    patients: [
      { name: 'Nina Brown', mrn: 'MRN-52011', lastVisit: 'Today', team: 'North Branch', status: 'Stable' },
      { name: 'Chris Walker', mrn: 'MRN-52012', lastVisit: 'Today', team: 'North Branch', status: 'Under Review' },
      { name: 'Dina Saleh', mrn: 'MRN-52013', lastVisit: 'Apr 10', team: 'South Branch', status: 'Needs Follow-up' }
    ]
  },
  Doctor: {
    metrics: [
      { label: 'Assigned patients', value: '286', note: 'Under your care' },
      { label: 'Follow-up queue', value: '12', note: 'Priority review list' },
      { label: 'Critical alerts', value: '2', note: 'Immediate attention needed' },
      { label: 'Visit completion', value: '96%', note: 'Recent cycle' }
    ],
    patients: [
      { name: 'Alex Morgan', mrn: 'MRN-62011', lastVisit: 'Today', team: 'Your panel', status: 'Stable' },
      { name: 'Elena Park', mrn: 'MRN-62012', lastVisit: 'Today', team: 'Your panel', status: 'Needs Follow-up' },
      { name: 'Hassan Adel', mrn: 'MRN-62013', lastVisit: 'Apr 11', team: 'Your panel', status: 'Under Review' }
    ]
  },
  Staff: {
    metrics: [
      { label: 'Today check-ins', value: '32', note: 'Processed by front desk' },
      { label: 'Forms pending', value: '11', note: 'Need patient completion' },
      { label: 'Insurance verifications', value: '7', note: 'Open today' },
      { label: 'Messages to route', value: '14', note: 'Patient communication queue' }
    ],
    patients: [
      { name: 'Sofia Hall', mrn: 'MRN-72011', lastVisit: 'Today', team: 'River Clinic Front Desk', status: 'Stable' },
      { name: 'Dylan Reed', mrn: 'MRN-72012', lastVisit: 'Today', team: 'River Clinic Front Desk', status: 'Under Review' },
      { name: 'Leila Mostafa', mrn: 'MRN-72013', lastVisit: 'Apr 09', team: 'Lakeview Center', status: 'Needs Follow-up' }
    ]
  },
  Patient: {
    metrics: [
      { label: 'Your records', value: '1 profile', note: 'Personal dashboard view' },
      { label: 'Upcoming tasks', value: '5', note: 'Due soon' },
      { label: 'Unread notes', value: '1', note: 'From care team' },
      { label: 'Plan progress', value: '92%', note: 'Current care cycle' }
    ],
    patients: [
      { name: 'You', mrn: 'MRN-90001', lastVisit: 'Apr 14', team: 'Downtown Clinic', status: 'Stable' },
      { name: 'Care plan note', mrn: 'NOTE-1002', lastVisit: 'Today', team: 'Dr. Patel', status: 'Under Review' }
    ]
  }
};

const clinicsByRole: Record<DemoRole, ClinicsPageData> = {
  'Super Admin': {
    summary: [
      { label: 'Live clinics', value: '118', note: 'Across all tenants' },
      { label: 'Cities covered', value: '26', note: 'Current footprint' },
      { label: 'Expansion queue', value: '8', note: 'Opening soon' }
    ],
    clinics: [
      { name: 'Downtown Clinic', city: 'New York', manager: 'Lina Hassan', rooms: '18', status: 'Operational' },
      { name: 'Westside Health', city: 'Boston', manager: 'Omar Nabil', rooms: '11', status: 'Operational' },
      { name: 'Northstar Care', city: 'Chicago', manager: 'Mira Adel', rooms: '9', status: 'Launching' }
    ]
  },
  'Tenant Admin': {
    summary: [
      { label: 'Managed branches', value: '8', note: 'Tenant locations' },
      { label: 'Open rooms', value: '46', note: 'Across all branches' },
      { label: 'Staff coverage', value: '94%', note: 'Healthy operational level' }
    ],
    clinics: [
      { name: 'North Branch', city: 'Austin', manager: 'Huda Salem', rooms: '12', status: 'Operational' },
      { name: 'South Branch', city: 'Austin', manager: 'Karim Noor', rooms: '9', status: 'Operational' },
      { name: 'East Branch', city: 'Austin', manager: 'Nadia Karim', rooms: '7', status: 'Under Review' }
    ]
  },
  Doctor: {
    summary: [
      { label: 'Assigned clinics', value: '2', note: 'Your active locations' },
      { label: 'Shared rooms', value: '6', note: 'Available this week' },
      { label: 'Care coverage', value: '98%', note: 'Panel availability' }
    ],
    clinics: [
      { name: 'Cedar Medical', city: 'Seattle', manager: 'Practice Ops Team', rooms: '14', status: 'Operational' },
      { name: 'Harbor Health', city: 'Seattle', manager: 'Regional Ops', rooms: '10', status: 'Operational' }
    ]
  },
  Staff: {
    summary: [
      { label: 'Front desk sites', value: '2', note: 'Current assignment' },
      { label: 'Active rooms', value: '8', note: 'Receiving patients now' },
      { label: 'Queue pressure', value: 'Moderate', note: 'Balanced staffing' }
    ],
    clinics: [
      { name: 'River Clinic', city: 'Chicago', manager: 'Front Desk Lead', rooms: '8', status: 'Operational' },
      { name: 'Lakeview Center', city: 'Chicago', manager: 'Operations Lead', rooms: '6', status: 'Operational' }
    ]
  },
  Patient: {
    summary: [
      { label: 'Your clinics', value: '2', note: 'Primary and telehealth access' },
      { label: 'Support channels', value: '24/7', note: 'Available for help' },
      { label: 'Care access', value: 'High', note: 'Remote + in-person' }
    ],
    clinics: [
      { name: 'Downtown Clinic', city: 'New York', manager: 'Patient Services', rooms: '18', status: 'Available' },
      { name: 'Mobile Care', city: 'Remote', manager: 'Virtual Care Team', rooms: 'Virtual', status: 'Available' }
    ]
  }
};

const analyticsByRole: Record<DemoRole, AnalyticsPageData> = {
  'Super Admin': {
    kpis: [
      { label: 'MRR', value: '$248K', note: '+12.6% month-over-month' },
      { label: 'Gross retention', value: '93%', note: 'Enterprise cohort' },
      { label: 'No-show rate', value: '3.1%', note: 'Platform average' },
      { label: 'Activation rate', value: '78%', note: 'New tenant onboarding success' }
    ],
    metrics: [
      { label: 'Top revenue segment', value: 'Multi-clinic groups', note: 'Highest expansion velocity this quarter.' },
      { label: 'Reminder automation impact', value: '-18% missed visits', note: 'Measured after rollout across tenants.' },
      { label: 'Support cost efficiency', value: '11% lower', note: 'Operational tooling continues to improve margins.' },
      { label: 'Mobile booking share', value: '64%', note: 'Patients increasingly book from mobile devices.' }
    ],
    trends: [
      { label: 'Tenant expansion trend', value: 'Upward in 4 straight months', note: 'Strong upsell pipeline and activation.' },
      { label: 'Regional demand', value: 'Highest in Gulf + North Africa', note: 'New market interest accelerating.' },
      { label: 'Patient experience score', value: '4.8 / 5', note: 'Driven by shorter wait and easier booking.' }
    ]
  },
  'Tenant Admin': {
    kpis: [
      { label: 'Bookings', value: '1,128', note: '+12% this week' },
      { label: 'Utilization', value: '92%', note: 'High room efficiency' },
      { label: 'Late arrivals', value: '6%', note: '-1% vs prior week' },
      { label: 'Patient satisfaction', value: '96%', note: 'Post-visit survey trend' }
    ],
    metrics: [
      { label: 'Best performing branch', value: 'North Branch', note: 'Highest throughput and best conversion.' },
      { label: 'Reminder impact', value: '-9% reschedules', note: 'More patients are arriving on time.' },
      { label: 'Demand peak', value: '10 AM to 1 PM', note: 'Highest booking density throughout weekdays.' },
      { label: 'Referral growth', value: '+14%', note: 'More patients returning via word of mouth.' }
    ],
    trends: [
      { label: 'Booking momentum', value: 'Growing week over week', note: 'Driven by better marketing funnel conversion.' },
      { label: 'Care retention', value: '88%', note: 'Patients are maintaining follow-up adherence.' },
      { label: 'Operational health', value: 'Stable', note: 'Low staffing friction across the tenant.' }
    ]
  },
  Doctor: {
    kpis: [
      { label: 'Avg. visit time', value: '14m', note: '-1m from last month' },
      { label: 'Chart closure', value: '97%', note: 'Completed within SLA' },
      { label: 'Follow-up adherence', value: '91%', note: 'Strong patient compliance' },
      { label: 'Care satisfaction', value: '4.9/5', note: 'Latest patient feedback' }
    ],
    metrics: [
      { label: 'Most common case type', value: 'Follow-up consults', note: 'Largest part of current panel demand.' },
      { label: 'Review backlog', value: '12 charts', note: 'Lower than last week.' },
      { label: 'Patient engagement', value: 'High', note: 'Message response times improved significantly.' },
      { label: 'Telehealth share', value: '22%', note: 'Useful for ongoing care continuity.' }
    ],
    trends: [
      { label: 'Clinical efficiency', value: 'Improving steadily', note: 'Shorter gaps and more complete notes.' },
      { label: 'Return visits', value: 'Stable', note: 'Healthy continuity of care.' },
      { label: 'Quality indicator', value: 'Excellent', note: 'Care outcomes remain above target.' }
    ]
  },
  Staff: {
    kpis: [
      { label: 'Average wait', value: '11m', note: '-2m improvement' },
      { label: 'Calls answered', value: '89%', note: '+3% this week' },
      { label: 'Check-in speed', value: '4.2m', note: 'Faster intake average' },
      { label: 'Desk throughput', value: '128', note: 'Patients processed today' }
    ],
    metrics: [
      { label: 'Peak queue time', value: '9:30 AM', note: 'Best time to add coverage.' },
      { label: 'Message turnaround', value: 'Within 2 hours', note: 'Communication workflow is healthy.' },
      { label: 'Insurance delays', value: 'Low', note: 'Fewer verification bottlenecks now.' },
      { label: 'Reschedule handling', value: 'Improved', note: 'Same-day slot replacement is faster.' }
    ],
    trends: [
      { label: 'Front-desk productivity', value: 'Upward', note: 'Team handling more visits with less friction.' },
      { label: 'Patient sentiment', value: 'Positive', note: 'Reception experience scores improved.' },
      { label: 'Operational load', value: 'Manageable', note: 'Balanced across shifts this week.' }
    ]
  },
  Patient: {
    kpis: [
      { label: 'Adherence', value: '92%', note: 'Current plan progress' },
      { label: 'Visit completion', value: '100%', note: 'No missed visits recently' },
      { label: 'Messages answered', value: 'Fast', note: 'Care team usually replies same day' },
      { label: 'Care consistency', value: 'Strong', note: 'You are staying on track' }
    ],
    metrics: [
      { label: 'Upcoming milestone', value: 'Follow-up check-in', note: 'Scheduled for this week.' },
      { label: 'Best communication channel', value: 'Patient portal', note: 'Fastest path to your care team.' },
      { label: 'Health plan progress', value: 'Nearly complete', note: 'Most assigned tasks are done.' },
      { label: 'Care access mode', value: 'Hybrid', note: 'Mix of virtual and in-person visits.' }
    ],
    trends: [
      { label: 'Wellness trend', value: 'Improving', note: 'Routine adherence is helping outcomes.' },
      { label: 'Care response time', value: 'Quick', note: 'Messages are being handled efficiently.' },
      { label: 'Visit readiness', value: 'High', note: 'Upcoming appointments and tasks are clear.' }
    ]
  }
};

const settingsByRole: Record<DemoRole, SettingsPageData> = {
  'Super Admin': {
    profile: [
      { label: 'Account owner', value: 'Super Admin', note: 'Global access across all tenants and environments.' },
      { label: 'Primary email', value: 'superadmin@clinicall.demo', note: 'Deterministic demo credential.' },
      { label: 'Workspace scope', value: 'Platform-wide', note: 'Includes operations, billing, and analytics.' }
    ],
    preferences: [
      { label: 'Security alerts', value: 'Enabled', note: 'Receive alerts for platform-critical changes.' },
      { label: 'Weekly executive digest', value: 'Enabled', note: 'Performance summary every Monday.' },
      { label: 'Tenant onboarding approvals', value: 'Manual', note: 'Each new tenant reviewed before activation.' }
    ]
  },
  'Tenant Admin': {
    profile: [
      { label: 'Account owner', value: 'Tenant Admin', note: 'Admin access for one tenant workspace.' },
      { label: 'Primary email', value: 'tenantadmin@clinicall.demo', note: 'Deterministic demo credential.' },
      { label: 'Workspace scope', value: 'Tenant-wide', note: 'Covers branch operations and users.' }
    ],
    preferences: [
      { label: 'Staff alerts', value: 'Enabled', note: 'Receive staffing and scheduling changes.' },
      { label: 'Daily clinic digest', value: 'Enabled', note: 'Overview of operational health each day.' },
      { label: 'Patient reminder mode', value: 'Automatic', note: 'Messages sent before booked visits.' }
    ]
  },
  Doctor: {
    profile: [
      { label: 'Account owner', value: 'Doctor', note: 'Clinical dashboard and patient-care workspace.' },
      { label: 'Primary email', value: 'doctor@clinicall.demo', note: 'Deterministic demo credential.' },
      { label: 'Workspace scope', value: 'Assigned clinics', note: 'Access limited to active practice sites.' }
    ],
    preferences: [
      { label: 'Follow-up reminders', value: 'Enabled', note: 'Prompted when chart reviews are due.' },
      { label: 'Patient message digest', value: 'Twice daily', note: 'Summarized communication inbox.' },
      { label: 'Telehealth availability', value: 'Enabled', note: 'Allows patients to request virtual slots.' }
    ]
  },
  Staff: {
    profile: [
      { label: 'Account owner', value: 'Staff', note: 'Reception and scheduling workspace.' },
      { label: 'Primary email', value: 'staff@clinicall.demo', note: 'Deterministic demo credential.' },
      { label: 'Workspace scope', value: 'Assigned clinics', note: 'Focused on operations and coordination.' }
    ],
    preferences: [
      { label: 'Queue alerts', value: 'Enabled', note: 'Notifies you of check-in surges.' },
      { label: 'Reminder calls', value: 'Manual assist', note: 'Combine automation with personal follow-up.' },
      { label: 'Desk summary', value: 'Hourly', note: 'Quick operational summary during shifts.' }
    ]
  },
  Patient: {
    profile: [
      { label: 'Account owner', value: 'Patient', note: 'Personal health and appointment workspace.' },
      { label: 'Primary email', value: 'patient@clinicall.demo', note: 'Deterministic demo credential.' },
      { label: 'Workspace scope', value: 'Personal profile', note: 'Access only to your own care overview.' }
    ],
    preferences: [
      { label: 'Appointment reminders', value: 'Enabled', note: 'Receive reminders before every visit.' },
      { label: 'Care plan notifications', value: 'Enabled', note: 'Get nudges for tasks and updates.' },
      { label: 'Preferred visit mode', value: 'Hybrid', note: 'Use both clinic and virtual appointments.' }
    ]
  }
};

export function getDemoDashboardData(role: DemoRole): DashboardOverviewData {
  return dashboardOverviewByRole[role] ?? dashboardOverviewByRole.Patient;
}

export function getDashboardDemoData(role: DemoRole): DashboardOverviewData {
  return getDemoDashboardData(role);
}

export function getAppointmentsDemoData(role: DemoRole): AppointmentsPageData {
  return appointmentsByRole[role] ?? appointmentsByRole.Patient;
}

export function getPatientsDemoData(role: DemoRole): PatientsPageData {
  return patientsByRole[role] ?? patientsByRole.Patient;
}

export function getClinicsDemoData(role: DemoRole): ClinicsPageData {
  return clinicsByRole[role] ?? clinicsByRole.Patient;
}

export function getAnalyticsDemoData(role: DemoRole): AnalyticsPageData {
  return analyticsByRole[role] ?? analyticsByRole.Patient;
}

export function getSettingsDemoData(role: DemoRole): SettingsPageData {
  return settingsByRole[role] ?? settingsByRole.Patient;
}

export function getAllDemoCredentials() {
  return DEMO_CREDENTIALS;
}

export function getDemoRoleLabel(role: DemoRole): string {
  return getDemoCredentialsByRole(role).label;
}
