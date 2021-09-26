export default function functionFormatDate(date) {
  const dateObject = new Date(date);
  const dateString = dateObject.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const timeString = dateObject.toLocaleTimeString('en-AU', {
    hour: 'numeric',
    hour12: true,
    minute: 'numeric'
  });
  return `${dateString} at ${timeString}`;
}
