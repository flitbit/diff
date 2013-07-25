var util = require('util')
, diff = require('..')
, data = require('./practice-data')
;

var cycle = -1
, i
, len = data.length
, prior = {}
, comparand
, records
, roll = []
, ch
, stat
, stats = []
, mark, elapsed, avg = { diff: { ttl: 0 }, apply: { ttl: 0 } }, ttl = 0
;

mark = process.hrtime();
while(++cycle < 10) {
	i = -1;
	while(++i < len) {
		stats.push(stat = { mark: process.hrtime() });

		comparand = roll[i] || data[i];

		stat.diff = { mark: process.hrtime() };
		records = diff(prior, comparand);
		stat.diff.intv = process.hrtime(stat.diff.mark);

		if (records) {
			stat.apply = { count: diff.length, mark: process.hrtime() };
			records.forEach(function(ch) {
				diff.applyChange(prior, comparand, ch);
			});
			stat.apply.intv = process.hrtime(stat.apply.mark);

			prior = comparand;
		}
		stat.intv = process.hrtime(stat.mark);
	}
}

function ms(intv) {
	return (intv[0]*1e9 + intv[1]/1e6);
}
elapsed = ms(process.hrtime(mark));

stats.forEach(function(stat) {
	stat.elapsed = ms(stat.intv);
	stat.diff.elapsed = ms(stat.diff.intv);
	avg.diff.ttl += stat.diff.elapsed;
	if (stat.apply) {
		stat.apply.elapsed = ms(stat.apply.intv);
		ttl += stat.apply.count;
		avg.apply.ttl += stat.apply.elapsed;
	}
});

avg.diff.avg = avg.diff.ttl / ttl;
avg.apply.avg = avg.apply.ttl / ttl;

console.log('Captured '.concat(stats.length, ' samples with ', ttl, ' combined differences in ', elapsed, 'ms'));
console.log('\tavg diff: '.concat(avg.diff.avg, 'ms or ', (1 / avg.diff.avg), ' per ms'));
console.log('\tavg apply: '.concat(avg.apply.avg, 'ms or ', (1 / avg.apply.avg), ' per ms'));
