function formatCZ(ms) {
  const d = new Date(ms);
  const dd = d.getDate();
  const mm = d.getMonth() + 1;
  const yyyy = d.getFullYear();
  const hhmmss = d.toTimeString().slice(0, 8);
  return `${dd}. ${mm}. ${yyyy} ${hhmmss}`;
}

function formatShort(ms) {
  const totalMinutes = Math.floor(ms / 60000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  if (h > 0 && m > 0) return `${h} h, ${m} m`;
  if (h > 0) return `${h} h`;
  return `${m} m`;
}

module.exports = { formatCZ, formatShort };
