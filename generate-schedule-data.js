// Generate schedule data for all quote IDs 1-20
import fs from 'fs';

const machines = [
  { id: 1, name: 'VF2SS', operation: 'milling' },
  { id: 2, name: 'UMC750', operation: '5-axis' },
  { id: 3, name: 'Puma 2100SY', operation: 'mill-turn' },
  { id: 4, name: 'Makino EDM', operation: 'EDM' },
];

const statuses = ['scheduled', 'in_progress', 'complete', 'delayed'];
const operations = ['milling', '5-axis', 'mill-turn', 'EDM'];

const scheduleData = [];

// Generate 5 entries per quote for quotes 1-20
for (let quoteId = 1; quoteId <= 20; quoteId++) {
  // Randomly pick 3-5 machines for this quote
  const numMachines = 3 + Math.floor(Math.random() * 3);
  
  for (let i = 0; i < numMachines; i++) {
    const machine = machines[Math.floor(Math.random() * machines.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const hours = [2, 4, 6, 8, 12, 16][Math.floor(Math.random() * 6)];
    const partCount = [1, 5, 10, 20][Math.floor(Math.random() * 4)];
    
    // Random date in Feb-April 2026
    const startDay = Math.floor(Math.random() * 80) + 3; // Feb 3 - April 23
    const startDate = new Date('2026-02-03');
    startDate.setDate(startDate.getDate() + startDay);
    const startHour = Math.floor(Math.random() * 16); // 0-15 (6am-9pm starts)
    startDate.setHours(startHour, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + hours);
    
    const partNum = 100 + Math.floor(Math.random() * 900);
    const rev = ['A', 'B', 'C'][Math.floor(Math.random() * 3)];
    
    scheduleData.push({
      equipment_id: machine.id,
      machine_name: machine.name,
      job_name: `Part-${partNum} Rev ${rev}`,
      quote_id: quoteId,
      start_time: startDate.toISOString().slice(0, 19).replace('T', ' '),
      end_time: endDate.toISOString().slice(0, 19).replace('T', ' '),
      status: status,
      operation: machine.operation,
      part_count: partCount,
      estimated_hours: hours
    });
  }
}

// Sort by start time
scheduleData.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

// Write to file
fs.writeFileSync(
  'public/data/sample-schedule.json',
  JSON.stringify(scheduleData, null, 2)
);

console.log(`✅ Generated ${scheduleData.length} schedule entries for quotes 1-20`);
console.log(`   File: public/data/sample-schedule.json`);
